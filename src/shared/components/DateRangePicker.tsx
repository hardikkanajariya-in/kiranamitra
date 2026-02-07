import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@core/constants';

interface DateRangePickerProps {
  from: Date;
  to: Date;
  onChange: (range: { from: Date; to: Date }) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  from,
  to,
  onChange,
}) => {
  const { t } = useTranslation('common');
  const [fromText, setFromText] = useState(dayjs(from).format(DATE_FORMAT));
  const [toText, setToText] = useState(dayjs(to).format(DATE_FORMAT));

  const parseAndUpdate = (fromStr: string, toStr: string) => {
    const parsedFrom = dayjs(fromStr, DATE_FORMAT);
    const parsedTo = dayjs(toStr, DATE_FORMAT);
    if (parsedFrom.isValid() && parsedTo.isValid()) {
      onChange({
        from: parsedFrom.startOf('day').toDate(),
        to: parsedTo.endOf('day').toDate(),
      });
    }
  };

  const handleQuickSelect = (days: number) => {
    const newFrom = dayjs().subtract(days, 'day').startOf('day');
    const newTo = dayjs().endOf('day');
    setFromText(newFrom.format(DATE_FORMAT));
    setToText(newTo.format(DATE_FORMAT));
    onChange({ from: newFrom.toDate(), to: newTo.toDate() });
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          label={t('from')}
          mode="outlined"
          value={fromText}
          onChangeText={(text) => {
            setFromText(text);
            parseAndUpdate(text, toText);
          }}
          style={styles.input}
          placeholder="DD/MM/YYYY"
          dense
        />
        <Text style={styles.separator}>→</Text>
        <TextInput
          label={t('to')}
          mode="outlined"
          value={toText}
          onChangeText={(text) => {
            setToText(text);
            parseAndUpdate(fromText, text);
          }}
          style={styles.input}
          placeholder="DD/MM/YYYY"
          dense
        />
      </View>
      <View style={styles.quickButtons}>
        <Button compact mode="outlined" onPress={() => handleQuickSelect(0)} style={styles.quickBtn}>
          {t('today')}
        </Button>
        <Button compact mode="outlined" onPress={() => handleQuickSelect(7)} style={styles.quickBtn}>
          {t('days', { count: 7 })}
        </Button>
        <Button compact mode="outlined" onPress={() => handleQuickSelect(30)} style={styles.quickBtn}>
          {t('days', { count: 30 })}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  separator: {
    marginHorizontal: 8,
    fontSize: 18,
  },
  quickButtons: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  quickBtn: {
    flex: 1,
  },
});
