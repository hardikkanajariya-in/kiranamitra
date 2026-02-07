import React from 'react';
import { Appbar } from 'react-native-paper';

interface Action {
  icon: string;
  onPress: () => void;
}

export interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  actions?: Action[];
  subtitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  onBack,
  showBack,
  actions = [],
  subtitle,
}) => {
  const showBackButton = showBack || !!onBack;
  return (
    <Appbar.Header elevated>
      {showBackButton && <Appbar.BackAction onPress={onBack} />}
      <Appbar.Content title={title} subtitle={subtitle} />
      {actions.map((action, index) => (
        <Appbar.Action
          key={`action-${index}`}
          icon={action.icon}
          onPress={action.onPress}
        />
      ))}
    </Appbar.Header>
  );
};
