import React from 'react';
import { render } from '../../renderWithProviders';
import { FormField } from '@shared/components/FormField';
import { useForm } from 'react-hook-form';

const TestForm: React.FC<{ defaultValues?: any }> = ({ defaultValues = { name: '' } }) => {
    const { control } = useForm({ defaultValues });
    return <FormField control={control} name="name" label="Name" placeholder="Enter name" />;
};

const NumericForm: React.FC = () => {
    const { control } = useForm({ defaultValues: { price: 0 } });
    return <FormField control={control} name="price" label="Price" keyboardType="numeric" />;
};

describe('FormField', () => {
    it('should render with label', () => {
        const { getAllByText } = render(<TestForm />);
        expect(getAllByText('Name').length).toBeGreaterThanOrEqual(1);
    });

    it('should render with value', () => {
        const { getByDisplayValue } = render(<TestForm defaultValues={{ name: 'Test' }} />);
        expect(getByDisplayValue('Test')).toBeTruthy();
    });

    it('should render numeric field', () => {
        render(<NumericForm />);
    });
});
