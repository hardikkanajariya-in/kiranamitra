import { useState, useEffect } from 'react';
import Product from '@core/database/models/Product';
import Category from '@core/database/models/Category';
import { productRepository } from '../repositories/productRepository';
import { useDebounce } from '@shared/hooks/useDebounce';

const getProductObservable = (search: string, catId?: string) => {
    if (search) {
        return productRepository.search(search);
    }
    if (catId) {
        return productRepository.observeByCategory(catId);
    }
    return productRepository.observeAll();
};

export const useProducts = (searchQuery: string = '', categoryId?: string) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        const observable = getProductObservable(debouncedSearch, categoryId);

        const subscription = observable.subscribe((result) => {
            setProducts(result);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [debouncedSearch, categoryId]);

    return { products, isLoading };
};

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const subscription = productRepository
            .observeCategories()
            .subscribe((result) => {
                setCategories(result);
                setIsLoading(false);
            });

        return () => subscription.unsubscribe();
    }, []);

    return { categories, isLoading };
};

export const useProductDetail = (productId: string) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const subscription = productRepository
            .observeById(productId)
            .subscribe((result) => {
                setProduct(result);
                setIsLoading(false);
            });

        return () => subscription.unsubscribe();
    }, [productId]);

    return { product, isLoading };
};
