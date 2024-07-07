const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  
const app = express();
const port = 3000;

app.use(cors());

const dbPath = path.join(__dirname, 'db.json');
let database;

fs.readFile(dbPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the database file:', err);
    return;
  }
  database = JSON.parse(data);
  console.log('Database loaded successfully');
});

app.get('/api/orders', (req, res) => {
  if (!database) {
    return res.status(500).json({ error: 'Database not loaded' });
  }
  res.json(database.orders);
});

app.post('/api/orders', express.json(), (req, res) => {
  if (!database) {
    return res.status(500).json({ error: 'Database not loaded' });
  }
  const newOrder = req.body;
  database.orders.push(newOrder);

  fs.writeFile(dbPath, JSON.stringify(database, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error saving the order' });
    }
    res.status(201).json(newOrder);
  });
});

app.get('/api/orders/:id', (req, res) => {
  if (!database) {
    return res.status(500).json({ error: 'Database not loaded' });
  }

  console.log(req.params.id)
  const order = database.orders.find(order => order.orderId === req.params.id);
  
  console.log(order)
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.put('/api/orders/:id', express.json(), (req, res) => {
  if (!database) {
    return res.status(500).json({ error: 'Database not loaded' });
  }
  const orderIndex = database.orders.findIndex(order => order.orderId === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const updatedOrder = req.body;
  database.orders[orderIndex] = updatedOrder;

  fs.writeFile(dbPath, JSON.stringify(database, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating the order' });
    }
    res.json(updatedOrder);
  });
});

app.listen(port, () => {
  console.log(`Mock server is running at http://localhost:${port}`);
});