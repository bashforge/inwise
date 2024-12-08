import express from 'express';
import { db } from '../index.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// Get all customers
router.get('/', asyncHandler(async (req, res) => {
  const result = await db.execute('SELECT * FROM customers ORDER BY created_at DESC');
  res.json(result.rows);
}));

// Get customer by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const result = await db.execute('SELECT * FROM customers WHERE id = ?', [req.params.id]);
  if (result.rows.length === 0) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }
  res.json(result.rows[0]);
}));

// Create customer
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;
  const id = crypto.randomUUID();
  
  await db.execute(
    'INSERT INTO customers (id, name, email, phone, address) VALUES (?, ?, ?, ?, ?)',
    [id, name, email, phone, address]
  );
  
  const result = await db.execute('SELECT * FROM customers WHERE id = ?', [id]);
  res.status(201).json(result.rows[0]);
}));

// Update customer
router.put('/:id', asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;
  
  await db.execute(
    'UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, email, phone, address, req.params.id]
  );
  
  const result = await db.execute('SELECT * FROM customers WHERE id = ?', [req.params.id]);
  if (result.rows.length === 0) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }
  res.json(result.rows[0]);
}));

// Delete customer
router.delete('/:id', asyncHandler(async (req, res) => {
  await db.execute('DELETE FROM customers WHERE id = ?', [req.params.id]);
  res.status(204).send();
}));

export default router;