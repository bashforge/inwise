import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { fetchInvoices } from '../lib/api';

export function useInvoices() {
  const { invoices, setInvoices } = useStore();

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await fetchInvoices();
        setInvoices(data);
      } catch (error) {
        console.error('Failed to load invoices:', error);
      }
    };

    loadInvoices();
  }, [setInvoices]);

  return invoices;
}