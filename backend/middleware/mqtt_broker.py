import random
import json
import time
from confluent_kafka import Producer
from paho.mqtt import client as mqtt_client

# Configuration
KAFKA_CONFIG = {
    'bootstrap.servers': 'localhost:9092',
    'message.send.max.retries': 5,
    'acks': 'all'
}

MQTT_CONFIG = {
    'broker': 'localhost',
    'port': 1883,
    'topic': "sensor/DHT22/#",
    'client_id': f'mqtt-kafka-bridge-{random.randint(0, 1000)}',
    'callback_api_version': mqtt_client.CallbackAPIVersion.VERSION2  # Required for newer paho-mqtt
}

# Kafka Topics
KAFKA_TOPICS = {
    'temperature_celsius': 'temperature_celsius',
    'temperature_fahrenheit': 'temperature_fahrenheit',
    'humidity': 'humidity',
    'air_quality': 'air_quality',
    'distance': 'distance'
}

# Initialize Kafka Producer
producer = Producer(KAFKA_CONFIG)

def delivery_report(err, msg):
    """Callback for Kafka message delivery reports"""
    if err is not None:
        print(f'Message delivery failed: {err}')
    else:
        print(f'Message delivered to {msg.topic()} [{msg.partition()}]')

def connect_mqtt() -> mqtt_client:
    """Connect to MQTT Broker with proper API version"""
    def on_connect(client, userdata, flags, reason_code, properties):
        if reason_code == 0:
            print("Connected to MQTT Broker!")
        else:
            print(f"Failed to connect, return code {reason_code}")

    client = mqtt_client.Client(
        mqtt_client.CallbackAPIVersion.VERSION2,
        client_id=MQTT_CONFIG['client_id']
    )
    
    client.on_connect = on_connect
    client.connect(
        MQTT_CONFIG['broker'],
        MQTT_CONFIG['port']
    )
    return client

def process_message(msg):
    """Process MQTT message and send to Kafka"""
    try:
        payload = float(msg.payload.decode())
        data = {
            'data': payload,
            'iddevice': 19
        }

        if msg.topic.endswith('temperature_celsius'):
            data['idattribute'] = 3
            topic = KAFKA_TOPICS['temperature_celsius']
        elif msg.topic.endswith('temperature_fahrenheit'):
            data['idattribute'] = 1  # Different ID for Fahrenheit
            topic = KAFKA_TOPICS['temperature_fahrenheit']
        elif msg.topic.endswith('humidity'):
            data['idattribute'] = 2
            topic = KAFKA_TOPICS['humidity']
        elif msg.topic.endswith('air_quality'):
            data['idattribute'] = 4
            topic = KAFKA_TOPICS['air_quality']
        elif msg.topic.endswith('distance'):
            data['idattribute'] = 5
            topic = KAFKA_TOPICS['distance']
        else:
            print(f"Unhandled topic: {msg.topic}")
            return

        # Send to Kafka with proper serialization
        producer.produce(
            topic=topic,
            value=json.dumps(data).encode('utf-8'),
            callback=delivery_report
        )
        producer.flush()
        
        print(f"Processed: {data}")

    except Exception as e:
        print(f"Error processing message: {e}")

def subscribe(client: mqtt_client):
    """Subscribe to MQTT topics with proper callback version"""
    def on_message(client, userdata, msg):
        print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
        process_message(msg)

    client.subscribe(MQTT_CONFIG['topic'])
    client.on_message = on_message

def run():
    """Main execution"""
    try:
        mqtt_client = connect_mqtt()
        subscribe(mqtt_client)
        mqtt_client.loop_forever()
    except KeyboardInterrupt:
        print("Shutting down...")
    finally:
        producer.flush()

if __name__ == '__main__':
    run()