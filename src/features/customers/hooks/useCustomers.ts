import { useState, useEffect, useMemo } from 'react';
import { customerRepository } from '../repositories/customerRepository';
import Customer from '@core/database/models/Customer';
import { useDebounce } from '@shared/hooks/useDebounce';

export const useCustomers = (searchQuery: string = '') => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    setIsLoading(true);
    const observable = debouncedSearch
      ? customerRepository.search(debouncedSearch)
      : customerRepository.observeAll();

    const subscription = observable.subscribe((result) => {
      setCustomers(result);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [debouncedSearch]);

  return { customers, isLoading };
};

export const useCustomerDetail = (customerId: string) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [outstandingCredit, setOutstandingCredit] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscription = customerRepository
      .observeById(customerId)
      .subscribe((result) => {
        setCustomer(result);
        setIsLoading(false);
      });

    // Load outstanding credit
    customerRepository.getOutstandingCredit(customerId).then(setOutstandingCredit);

    return () => subscription.unsubscribe();
  }, [customerId]);

  return { customer, outstandingCredit, isLoading };
};
