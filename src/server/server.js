const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = 8080;


// Create a WebSocket server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

const stockData = [
    { symbol: 'AAPL', cours: 150.00, variation: 0.00 },
    { symbol: 'GOOG', cours: 2800.00, variation: 0.00 },
    { symbol: 'AMZN', cours: 3400.00, variation: 0.00 },
    { symbol: 'MSFT', cours: 300.00, variation: 0.00 },
    { symbol: 'TSLA', cours: 900.00, variation: 0.00 },
];

// Function to update stock data and send updates
const updateStockData = (symbol) => {
    const stock = stockData.find((stock) => stock.symbol === symbol);
    if (stock) {
        stock.cours = parseFloat((Math.random() * 1000).toFixed(2));
        stock.variation =parseFloat((Math.random() * 1000).toFixed(2));

        // Broadcast only the updated stock data
        const updatedStock = { symbol: stock.symbol, cours: stock.cours, variation: stock.variation };
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'update', data: updatedStock }));
            }
        });
    }
};

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send initial stock data to the client
    ws.send(JSON.stringify({ type: 'initial', data: stockData }));

    // Update and send stock data every 1 second
    const intervalId = setInterval(() => {
        const randomSymbol = stockData[Math.floor(Math.random() * stockData.length)].symbol;
        updateStockData(randomSymbol); // Update and send only the affected stock
    }, 1000);

    // Handle client disconnect
    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(intervalId); // Stop the interval when the client disconnects
    });
});
