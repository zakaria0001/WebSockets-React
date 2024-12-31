import React, { useEffect, useState } from 'react';

function App() {
    const [stocks, setStocks] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null); // State to track the selected row

    useEffect(() => {
        // Connect to the WebSocket server
        const socket = new WebSocket('ws://localhost:8080');

        socket.onmessage = (event) => {
            const stockData = JSON.parse(event.data);
            setStocks(stockData);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-center text-white bg-red-600 py-4 rounded-md">
                Live Stock Data
            </h1>
            <table className="table-auto w-full border border-gray-300 mt-4">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 border">Symbol</th>
                        <th className="px-4 py-2 border">Cours</th>
                        <th className="px-4 py-2 border">Variation</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock, index) => (
                        <tr
                            key={index}
                            className={`text-center cursor-pointer ${
                                selectedRow === index
                                    ? 'bg-blue-200'
                                    : 'bg-green-100'
                            }`}
                            onClick={() => setSelectedRow(index)} // Set the selected row on click
                        >
                            <td className="px-4 py-2 border">{stock.symbol}</td>
                            <td className="px-4 py-2 border">${stock.cours}</td>
                            <td className="px-4 py-2 border">{stock.variation}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
