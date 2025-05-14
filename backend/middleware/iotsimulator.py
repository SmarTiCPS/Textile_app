import random
import time
from paho.mqtt import client as mqtt_client

# MQTT settings
broker = 'localhost'  # Same as your consumer
port = 1883
client_id = f'python-mqtt-publisher-{random.randint(0, 1000)}'

# Topics to publish to (same as your consumer)
topics = {
    'temperature_celsius': "sensor/DHT22/temperature_celsius",
    'temperature_fahrenheit': "sensor/DHT22/temperature_fahrenheit",
    'humidity': "sensor/DHT22/humidity",
    'air_quality': "sensor/DHT22/air_quality",
    'distance': "sensor/DHT22/distance"
}

def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print(f"Failed to connect, return code {rc}\n")

    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client

def publish(client):
    while True:
        try:
            # Generate random sensor values
            temp_c = round(random.uniform(15.0, 35.0), 2)  # Celsius
            temp_f = round(temp_c * 1.8 + 32, 2)          # Fahrenheit
            humidity = random.randint(30, 90)             # Percentage
            air_quality = random.randint(0, 500)          # PPM
            distance = round(random.uniform(0.5, 10.0), 2) # Meters

            # Publish each value to its respective topic
            client.publish(topics['temperature_celsius'], str(temp_c))
            print(f"Published {temp_c}°C to {topics['temperature_celsius']}")
            
            client.publish(topics['temperature_fahrenheit'], str(temp_f))
            print(f"Published {temp_f}°F to {topics['temperature_fahrenheit']}")
            
            client.publish(topics['humidity'], str(humidity))
            print(f"Published {humidity}% to {topics['humidity']}")
            
            client.publish(topics['air_quality'], str(air_quality))
            print(f"Published {air_quality}ppm to {topics['air_quality']}")
            
            client.publish(topics['distance'], str(distance))
            print(f"Published {distance}m to {topics['distance']}")

            # Wait 2-5 seconds before next publish
            time.sleep(random.uniform(10, 30))
            
        except KeyboardInterrupt:
            print("Publisher stopped")
            break
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(5)  # Wait before retrying

def run():
    client = connect_mqtt()
    client.loop_start()
    publish(client)

if __name__ == '__main__':
    run()