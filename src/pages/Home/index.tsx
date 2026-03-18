import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface UserSettings {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
}

const HomePage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>首页</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomePage;
