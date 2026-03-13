import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';

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
    backgroundColor: colors.orange,
  },
});

export default HomePage;
