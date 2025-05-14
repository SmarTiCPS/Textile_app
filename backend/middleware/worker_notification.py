import random
import time
import json
from kafka import KafkaProducer

# Kafka settings
bootstrap_servers = ['localhost:9092']  # Update with your Kafka server address
topic = 'camera'  # Kafka topic name

# Danger events to simulate
danger_events = [
    "fire_detected",
    "unauthorized_zone_entry",
    "fight_detected",
    "safety_equipment_violation",
    "equipment_tampering",
    "smoking_in_restricted_area"
]

def create_kafka_producer():
    try:
        producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            acks='all',
            retries=3
        )
        print("Connected to Kafka successfully!")
        return producer
    except Exception as e:
        print(f"Failed to connect to Kafka: {e}")
        raise

def send_alerts(producer):
    while True:
        try:
            # Generate random alert data
            alert_data = {
                'data': random.choice(danger_events),
                'iddevice': 19,  # Fixed as per your requirement
                'idattribute': 6  # Fixed as per your requirement
            }
            
            # Send to Kafka topic
            producer.send(topic, value=alert_data)
            producer.flush()  # Ensure message is sent
            print(f"Sent alert to Kafka: {alert_data}")
            
            # Random delay between 5-30 seconds
            time.sleep(random.uniform(5, 30))
            
        except KeyboardInterrupt:
            print("Alert producer stopped")
            break
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(5)

def run():
    producer = create_kafka_producer()
    send_alerts(producer)
    producer.close()  # Cleanup when done

if __name__ == '__main__':
    run()