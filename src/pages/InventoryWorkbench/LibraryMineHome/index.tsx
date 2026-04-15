import { useNavigation, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CustomButton from '~/components/CustomButton';
import { SafeAreaWrapper } from '~/components/SafeAreaWrapper';

const LibraryMineHome: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>库管工作台-我的</Text>
        <CustomButton
          title='关于 App'
          onPress={() => {
            navigation.navigate('About');
          }}
        />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F5F6F8',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
    color: '#222222',
  },
});

export default LibraryMineHome;
