import { useState, useEffect, useCallback } from 'react';
import { customerRepository } from '../repositories/customerRepository';
import Customer from '@core/database/models/Customer';
import { useDebounce } from '@shared/hooks/useDebounce';

export const useCustomers = (searchQuery: string = '') => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
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

    const refreshCredit = useCallback(() => {
        customerRepository.getOutstandingCredit(customerId).then(setOutstandingCredit);
    }, [customerId]);

    useEffect(() => {
        const subscription = customerRepository
            .observeById(customerId)
            .subscribe((result) => {
                setCustomer(result);
                setIsLoading(false);
            });

        // Load outstanding credit initially
        refreshCredit();

        // Observe credit entries for this customer so balance updates reactively
        const creditSub = customerRepository
            .getCreditEntries(customerId)
            .subscribe(() => {
                refreshCredit();
            });

        return () => {
            subscription.unsubscribe();
            creditSub.unsubscribe();
        };
    }, [customerId, refreshCredit]);

    return { customer, outstandingCredit, isLoading, refreshCredit };
};
