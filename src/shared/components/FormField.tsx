import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  transformValue?: (text: string) => string;
  autoFocus?: boolean;
  maxLength?: number;
  error?: string;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  left,
  right,
  transformValue,
  autoFocus = false,
  maxLength,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <TextInput
            label={label}
            placeholder={placeholder}
            mode="outlined"
            value={String(value ?? '')}
            onBlur={onBlur}
            onChangeText={(text) => {
              const transformed = transformValue ? transformValue(text) : text;
              onChange(keyboardType === 'numeric' ? parseFloat(transformed) || 0 : transformed);
            }}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            numberOfLines={numberOfLines}
            disabled={disabled}
            error={!!error}
            left={left}
            right={right}
            style={multiline ? styles.multiline : undefined}
            autoFocus={autoFocus}
            maxLength={maxLength}
          />
          {error && (
            <HelperText type="error" visible={!!error}>
              {error.message}
            </HelperText>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  multiline: {
    minHeight: 80,
  },
});
