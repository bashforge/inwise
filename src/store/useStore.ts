import { create } from 'zustand';
import type { Customer, Invoice } from '../types';
import { createCustomer, createInvoice } from '../lib/api';

interface Store {
  customers: Customer[];
  invoices: Invoice[];
  setCustomers: (customers: Customer[]) => void;
  setInvoices: (invoices: Invoice[]) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  customers: [],
  invoices: [],
  setCustomers: (customers) => set({ customers }),
  setInvoices: (invoices) => set({ invoices }),
  addCustomer: async (customer) => {
    try {
      const newCustomer = await createCustomer(customer);
      set((state) => ({ customers: [...state.customers, newCustomer] }));
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  },
  updateCustomer: (id, customer) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...customer } : c
      ),
    })),
  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),
  addInvoice: async (invoice) => {
    try {
      const newInvoice = await createInvoice(invoice);
      set((state) => ({ invoices: [...state.invoices, newInvoice] }));
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  },
  updateInvoice: (id, invoice) =>
    set((state) => ({
      invoices: state.invoices.map((i) =>
        i.id === id ? { ...i, ...invoice } : i
      ),
    })),
  deleteInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((i) => i.id !== id),
    })),
}));