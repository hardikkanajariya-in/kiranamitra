import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

interface LoadingOverlayProps {
    visible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
    const theme = useTheme();

    if (!visible) {
        return null;
    }

    return (
        <View style={[styles.overlay, { backgroundColor: theme.colors.backdrop }]}>
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    card: {
        padding: 24,
        borderRadius: 12,
        elevation: 4,
    },
});
