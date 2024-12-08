import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import customerRoutes from './routes/customers.js';
import invoiceRoutes from './routes/invoices.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize database
export const db = createClient({
  url: 'file:invoice.db',
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});