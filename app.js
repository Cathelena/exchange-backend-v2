// app.js

// The backend URL (replace with your actual backend URL)
const BACKEND_URL = 'https://exchange-backend-v2.onrender.com'; 

// Fetch logs from the backend when the page loads
window.onload = function() {
    fetchLogs();
}

// Function to calculate and save the log to the backend
function calculate() {
    // Get input values
    const currentRate = parseFloat(document.getElementById("currentRate").value);
    const amountMDL = parseFloat(document.getElementById("amountMDL").value);
    const buyRate = parseFloat(document.getElementById("buyRate").value);
    const sellRate = parseFloat(document.getElementById("sellRate").value);

    // Get date and time inputs
    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    const time = document.getElementById("time").value;

    // Calculate INR values
    const inrCurrentRate = (currentRate * amountMDL).toFixed(2);
    const inrBuyRate = (buyRate * amountMDL).toFixed(2);
    const inrSellRate = (sellRate * amountMDL).toFixed(2);

    // Calculate the difference (Buy Rate vs Sell Rate)
    const differenceBuySell = (inrSellRate - inrBuyRate).toFixed(2);

    // Display the results
    document.getElementById("inrCurrentRate").textContent = `INR Value (Current Rate): ${inrCurrentRate}`;
    document.getElementById("inrBuyRate").textContent = `INR Value (Buy Rate): ${inrBuyRate}`;
    document.getElementById("inrSellRate").textContent = `INR Value (Sell Rate): ${inrSellRate}`;
    document.getElementById("differenceBuySell").textContent = `Difference (Buy Rate vs Sell Rate): ${differenceBuySell}`;

    // Log the exchange details with date and time
    const logDateTime = `${year}-${month}-${day} ${time}`;
    const exchangeLog = {
        amountMDL,
        currentRate,
        inrCurrentRate,
        buyRate,
        inrBuyRate,
        sellRate,
        inrSellRate,
        differenceBuySell,
        logDateTime
    };

    // Send the log to the backend to be saved
    fetch(`${BACKEND_URL}/logs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exchangeLog)
    })
    .then(response => response.json())
    .then(data => {
        // After saving the log, fetch and display all logs
        fetchLogs();
    })
    .catch(error => console.error('Error saving log:', error));
}

// Function to fetch logs from the backend and display them
function fetchLogs() {
    fetch(`${BACKEND_URL}/logs`)
        .then(response => response.json())
        .then(data => {
            const logsContainer = document.getElementById("exchangeLogs");
            logsContainer.innerHTML = ''; // Clear current logs before adding new ones
            data.forEach((log, index) => {
                const logEntry = document.createElement("li");
                logEntry.textContent = `MDL ${log.amountMDL} @ Current Rate: ${log.currentRate} = INR ${log.inrCurrentRate}, 
                                        Buy Rate: ${log.buyRate} = INR ${log.inrBuyRate}, 
                                        Sell Rate: ${log.sellRate} = INR ${log.inrSellRate}, 
                                        Difference (Buy Rate vs Sell Rate): ${log.differenceBuySell}, 
                                        Date: ${log.logDateTime}`;

                // Add a delete button to each log
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-btn");
                deleteButton.onclick = function() {
                    deleteLog(log._id); // Call delete log with the log's ID
                };

                logEntry.appendChild(deleteButton);
                logsContainer.appendChild(logEntry);
            });
        })
        .catch(error => console.error('Error fetching logs:', error));
}

// Function to delete a log from the backend
function deleteLog(logId) {
    fetch(`${BACKEND_URL}/logs/${logId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        // After deleting, fetch and display updated logs
        fetchLogs();
    })
    .catch(error => console.error('Error deleting log:', error));
}
