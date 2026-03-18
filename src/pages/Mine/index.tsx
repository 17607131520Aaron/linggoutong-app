import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CustomButton from '~/components/CustomButton';

import type { InMemoryRecord } from '~/storage/structured/StructuredMemoryStorage';

export interface StudyRecord extends InMemoryRecord {
  userId: string;
  title: string;
  finishedAt: number;
}

const MinePages: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>我的 - 结构化存储示例</Text>
      <CustomButton
        style={styles.buttonSpacing}
        title='去登录页面'
        onPress={() => {
          navigation.navigate('Login');
        }}
      />
      <CustomButton
        style={styles.buttonSpacing}
        title='去注册页面'
        onPress={() => {
          navigation.navigate('Register');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonSpacing: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default MinePages;
