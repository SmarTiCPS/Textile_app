const { Kafka, logLevel } = require('kafkajs');
const client = require('../routes/db');


module.exports = function createKafkaConsumer(io) {
  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: process.env.KAFKA_BROKERS.split(','),
    logLevel: logLevel.ERROR,
    retry: {
      initialRetryTime: 3000,
      retries: 10
    }
  });


  const consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID,
    heartbeatInterval: 3000,
    sessionTimeout: 30000
  });

  const topics = ['temperature_celsius', 'humidity', 'air_quality', 'distance','camera'];
  const topicsVm = ["co", "coo", "fire", "humidity", "motion", "temperature", "test"];

  // Function to save event to database
  async function saveEventToDatabase(value) {
    try {
    //console.log(value)
      await client.query(
        `INSERT INTO events 
        (idattribute, iddevice, value, timestamp) 
        VALUES ($1, $2, $3, $4)`,
        [
          value.idattribute || null,
          value.iddevice || null,
          value.data || null,
          new Date(value.timestamp || Date.now()),
        ]
      );
    } catch (err) {
      console.error('Failed to save event to database:', err);
    }
  }

  return {
    connect: async () => {
      try {

        // Connect to Kafka
        await consumer.connect();
        console.log('Kafka consumer connected');

        await Promise.all(
          topics.map(topic =>
            consumer.subscribe({ topic, fromBeginning: true })
        ));

        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            try {
              const messageValue = message.value.toString();

              // Replace single quotes with double quotes to ensure valid JSON
              const fixedValue = messageValue.replace(/'/g, '"');
  
              // Parse the fixed JSON string
              const value = JSON.parse(fixedValue);
  
              const payload = {
                topic,
                partition,
                offset: message.offset,
                value: value, // Use the parsed object directly
                timestamp: message.timestamp
              };
              console.log(payload)

              // 1. First save to database
              await saveEventToDatabase(value);

              // 2. Then emit to WebSocket clients
              io.emit('kafka-message', payload);
              
            } catch (error) {
              console.error('Error processing Kafka message:', error);
            }
          }
        });
      } catch (err) {
        console.error('Initialization error:', err);
        process.exit(1);
      }
    },

    disconnect: async () => {
      try {
        await consumer.disconnect();
        await client.end();
        console.log('Disconnected from Kafka and database');
      } catch (err) {
        console.error('Error during disconnection:', err);
      }
    }
  };
};