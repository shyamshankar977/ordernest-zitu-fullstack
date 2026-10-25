import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());

const businesses = [
  { id: 1, name: 'GreenLeaf Packaging', category: 'Packaging', city: 'Chennai', description: 'Recyclable packaging for small and growing brands.', contact: 'hello@greenleaf.example' },
  { id: 2, name: 'Metro Tech Supplies', category: 'Technology', city: 'Chennai', description: 'Office computers, accessories and business IT supplies.', contact: 'sales@metrotech.example' },
  { id: 3, name: 'Sunrise Foods', category: 'Food Supply', city: 'Coimbatore', description: 'Bulk ingredients and food products for local businesses.', contact: 'orders@sunrise.example' },
  { id: 4, name: 'CraftWorks Studio', category: 'Manufacturing', city: 'Chennai', description: 'Custom merchandise and small-batch manufacturing.', contact: 'team@craftworks.example' }
];
const enquiries = [];
app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'Zitu API' }));
app.get('/api/businesses', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const city = String(req.query.city || '').trim().toLowerCase();
  const result = businesses.filter(b => (!q || `${b.name} ${b.category} ${b.description}`.toLowerCase().includes(q)) && (!city || b.city.toLowerCase().includes(city)));
  res.json(result);
});
app.post('/api/enquiries', (req, res) => {
  const { businessId, senderName, email, message } = req.body ?? {};
  const business = businesses.find(b => b.id === Number(businessId));
  if (!business || typeof senderName !== 'string' || !senderName.trim() || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Provide a valid business, name, email and message.' });
  }
  const enquiry = { id: enquiries.length + 1, businessId: business.id, businessName: business.name, senderName: senderName.trim(), email: email.trim(), message: message.trim(), createdAt: new Date().toISOString() };
  enquiries.push(enquiry);
  res.status(201).json({ message: 'Enquiry submitted successfully.', enquiry });
});
app.get('/api/enquiries', (_req, res) => res.json(enquiries));
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.listen(PORT, () => console.log(`Zitu API running at http://localhost:${PORT}`));