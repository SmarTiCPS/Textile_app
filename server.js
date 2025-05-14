require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const debug = require("debug")("node-angular");
const app = require('./backend/app');
const createKafkaConsumer = require('./backend/middleware/kafka');

// Enhanced port configuration
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
};

const port = normalizePort(process.env.PORT || "3000");
const host = process.env.HOST || "0.0.0.0"; // Listen on all interfaces

// Create HTTP server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS || "*",
        methods: ["GET", "POST"]
    }
});

// Initialize Kafka Consumer
const kafkaConsumer = createKafkaConsumer(io); 

// Error handling (keep your existing)
const onError = error => { /* ... */ };

// Server listening handler
const onListening = () => {
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    debug("Listening on " + bind);
    console.log(`Server running on http://${host}:${port}`);
};

// Enhanced start server function
const startServer = async () => {
    try {
        await kafkaConsumer.connect(); 
        server.listen(port, host);
        server.on("error", onError);
        server.on("listening", onListening);
        
        console.log(`Kafka brokers: ${process.env.KAFKA_BROKERS || 'Not configured'}`);
        console.log(`Consumer group: ${process.env.KAFKA_GROUP_ID || 'Not configured'}`);
        console.log(`Allowed origins: ${process.env.ALLOWED_ORIGINS || 'All origins allowed'}`);
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();