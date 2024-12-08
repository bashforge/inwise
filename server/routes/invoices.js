import express from 'express';
import { db } from '../index.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// Get all invoices with customer details
router.get('/', asyncHandler(async (req, res) => {
  const result = await db.execute(`
    SELECT i.*, c.name as customer_name 
    FROM invoices i 
    JOIN customers c ON i.customer_id = c.id 
    ORDER BY i.created_at DESC
  `);
  
  const invoices = await Promise.all(result.rows.map(async (invoice) => {
    const items = await db.execute('SELECT * FROM invoice_items WHERE invoice_id = ?', [invoice.id]);
    return { ...invoice, items: items.rows };
  }));
  
  res.json(invoices);
}));

// Get invoice by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const invoice = await db.execute('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
  if (invoice.rows.length === 0) {
    res.status(404).json({ message: 'Invoice not found' });
    return;
  }
  
  const items = await db.execute('SELECT * FROM invoice_items WHERE invoice_id = ?', [req.params.id]);
  res.json({ ...invoice.rows[0], items: items.rows });
}));

// Create invoice
router.post('/', asyncHandler(async (req, res) => {
  const { customer_id, status, due_date, is_recurring, recurring_interval, total, items } = req.body;
  const invoice_id = crypto.randomUUID();
  
  await db.execute(
    'INSERT INTO invoices (id, customer_id, status, due_date, is_recurring, recurring_interval, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [invoice_id, customer_id, status, due_date, is_recurring, recurring_interval, total]
  );
  
  for (const item of items) {
    await db.execute(
      'INSERT INTO invoice_items (id, invoice_id, description, quantity, price) VALUES (?, ?, ?, ?, ?)',
      [crypto.randomUUID(), invoice_id, item.description, item.quantity, item.price]
    );
  }
  
  const result = await db.execute('SELECT * FROM invoices WHERE id = ?', [invoice_id]);
  const invoice_items = await db.execute('SELECT * FROM invoice_items WHERE invoice_id = ?', [invoice_id]);
  
  res.status(201).json({ ...result.rows[0], items: invoice_items.rows });
}));

// Update invoice
router.put('/:id', asyncHandler(async (req, res) => {
  const { status, due_date, is_recurring, recurring_interval, total, items } = req.body;
  
  await db.execute(
    'UPDATE invoices SET status = ?, due_date = ?, is_recurring = ?, recurring_interval = ?, total = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, due_date, is_recurring, recurring_interval, total, req.params.id]
  );
  
  // Delete existing items and insert new ones
  await db.execute('DELETE FROM invoice_items WHERE invoice_id = ?', [req.params.id]);
  
  for (const item of items) {
    await db.execute(
      'INSERT INTO invoice_items (id, invoice_id, description, quantity, price) VALUES (?, ?, ?, ?, ?)',
      [crypto.randomUUID(), req.params.id, item.description, item.quantity, item.price]
    );
  }
  
  const result = await db.execute('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
  const invoice_items = await db.execute('SELECT * FROM invoice_items WHERE invoice_id = ?', [req.params.id]);
  
  res.json({ ...result.rows[0], items: invoice_items.rows });
}));

// Delete invoice
router.delete('/:id', asyncHandler(async (req, res) => {
  await db.execute('DELETE FROM invoices WHERE id = ?', [req.params.id]);
  res.status(204).send();
}));

export default router;