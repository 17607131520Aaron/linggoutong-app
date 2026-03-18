import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';

const StartupScreen: React.FC = (): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle='dark-content' />
      <View style={styles.brandBlock}>
        <Text style={styles.title}>LingGo</Text>
        <Text style={styles.subtitle}>正在进入应用，请稍候</Text>
      </View>
      <ActivityIndicator color={colors.brandPrimary} size='large' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default StartupScreen;
