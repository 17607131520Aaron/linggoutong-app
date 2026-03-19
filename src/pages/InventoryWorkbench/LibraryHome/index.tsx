import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';

import CustomButton from '~/components/CustomButton';
import { SafeAreaWrapper } from '~/components/SafeAreaWrapper';

import type { FC } from 'react';

const LibraryHome: FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  return (
    <SafeAreaWrapper>
      <Text>库管工作台-首页</Text>
      <View>
        <CustomButton
          title='去登录页面'
          onPress={() => {
            navigation.navigate('Login');
          }}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default LibraryHome;
