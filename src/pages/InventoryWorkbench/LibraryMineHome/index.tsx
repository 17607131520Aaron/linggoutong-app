import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';

import CustomButton from '~/components/CustomButton';
import { SafeAreaWrapper } from '~/components/SafeAreaWrapper';

const LibraryMineHome: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  return (
    <SafeAreaWrapper style={{}}>
      <Text>库管工作台-我的</Text>
      <CustomButton
        title='关于 App'
        onPress={() => {
          navigation.navigate('About');
        }}
      />
    </SafeAreaWrapper>
  );
};

export default LibraryMineHome;
