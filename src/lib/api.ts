const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCustomers() {
  const response = await fetch(`${API_URL}/customers`);
  if (!response.ok) throw new Error('Failed to fetch customers');
  return response.json();
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
  const response = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  });
  if (!response.ok) throw new Error('Failed to create customer');
  return response.json();
}

export async function fetchInvoices() {
  const response = await fetch(`${API_URL}/invoices`);
  if (!response.ok) throw new Error('Failed to fetch invoices');
  return response.json();
}

export async function createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) {
  const response = await fetch(`${API_URL}/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice),
  });
  if (!response.ok) throw new Error('Failed to create invoice');
  return response.json();
}