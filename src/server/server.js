const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = 8080;

// Serve static files (if needed)
app.use(express.static('public'));

// Create a WebSocket server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

// Default stock data
const stockData = [
    { symbol: 'AAPL', cours: 150.00, variation: 0.00 },
    { symbol: 'GOOG', cours: 2800.00, variation: 0.00 },
    { symbol: 'AMZN', cours: 3400.00, variation: 0.00 },
    { symbol: 'MSFT', cours: 300.00, variation: 0.00 },
    { symbol: 'TSLA', cours: 900.00, variation: 0.00 },
];

// Update only the specific symbol's stock data
const updateSpecificStockData = (symbol) => {
    const stock = stockData.find((item) => item.symbol === symbol);
    if (stock) {
        const variation = (Math.random() - 0.5) * 10; // Random variation
        // stock.cours = parseFloat((stock.cours + variation).toFixed(2));
        stock.variation = parseFloat(variation.toFixed(2));
    }
};

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send default stock data
    ws.send(JSON.stringify(stockData));

    // Update and send stock data every 5 seconds for a specific symbol
    const intervalId = setInterval(() => {
        updateSpecificStockData('TSLA'); // Update only TSLA
        ws.send(JSON.stringify(stockData));
    }, 1000);

    // Handle client disconnect
    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(intervalId); // Stop the interval when the client disconnects
    });
});
