import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { fetchCustomers } from '../lib/api';

export function useCustomers() {
  const { customers, setCustomers } = useStore();

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Failed to load customers:', error);
      }
    };

    loadCustomers();
  }, [setCustomers]);

  return customers;
}