// server.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// File path for logs
const LOG_FILE = path.join(__dirname, 'logs.txt');

// Endpoint to fetch logs
app.get('/logs', (req, res) => {
  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // No logs yet
        return res.json([]);
      }
      return res.status(500).json({ error: 'Unable to read logs' });
    }
    // Send logs as JSON
    const logs = data.trim() ? JSON.parse(data) : [];
    res.json(logs);
  });
});

// Endpoint to add a new log
app.post('/logs', (req, res) => {
  const newLog = req.body;

  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    let logs = [];
    if (!err && data.trim()) {
      logs = JSON.parse(data);
    }

    logs.push(newLog);

    fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to save log' });
      }
      res.status(201).json({ message: 'Log added successfully' });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
