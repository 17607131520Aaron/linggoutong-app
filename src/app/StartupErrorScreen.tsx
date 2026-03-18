import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '~/common/colors';

interface StartupErrorScreenProps {
  onRetry: () => void;
}

const StartupErrorScreen: React.FC<StartupErrorScreenProps> = ({ onRetry }): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LingGo</Text>
      <Text style={styles.message}>进入应用时遇到一点问题，请重试</Text>
      <TouchableOpacity activeOpacity={0.85} style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>重新进入</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  button: {
    minWidth: 132,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.brandPrimary,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});

export default StartupErrorScreen;
