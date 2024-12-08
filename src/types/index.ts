export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  items: InvoiceItem[];
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  dueDate: Date;
  isRecurring: boolean;
  recurringInterval?: 'monthly' | 'quarterly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
  total: number;
}