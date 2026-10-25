import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const foods = [
  { id: 1, name: 'Veg Burger', price: 99, category: 'Fast Food' },
  { id: 2, name: 'Margherita Pizza', price: 199, category: 'Pizza' },
  { id: 3, name: 'Paneer Wrap', price: 129, category: 'Wraps' },
  { id: 4, name: 'French Fries', price: 79, category: 'Sides' }
];
const orders = [];
app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'OrderNest API' }));
app.get('/api/foods', (_req, res) => res.json(foods));
app.get('/api/orders', (_req, res) => res.json(orders));
app.post('/api/orders', (req, res) => {
  const { customerName, items } = req.body ?? {};
  if (typeof customerName !== 'string' || !customerName.trim() || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Enter a customer name and at least one item.' });
  }
  let total = 0;
  const orderItems = [];
  for (const item of items) {
    const food = foods.find((f) => f.id === Number(item.foodId));
    const quantity = Number(item.quantity);
    if (!food || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      return res.status(400).json({ message: 'Each item must have a valid foodId and quantity (1–50).' });
    }
    total += food.price * quantity;
    orderItems.push({ foodId: food.id, name: food.name, price: food.price, quantity });
  }
  const order = { id: orders.length + 1, customerName: customerName.trim(), items: orderItems, total, status: 'Received', createdAt: new Date().toISOString() };
  orders.push(order);
  res.status(201).json(order);
});
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.listen(PORT, () => console.log(`OrderNest API running at http://localhost:${PORT}`));