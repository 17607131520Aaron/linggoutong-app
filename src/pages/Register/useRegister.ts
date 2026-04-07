import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import { useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';

import type {
  KeyboardAwareScrollViewInstance,
  RegisterFieldErrors,
  UseRegisterReturn,
} from './types';

const useRegister = (): UseRegisterReturn => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<RegisterFieldErrors>({});

  const scrollRef = useRef<KeyboardAwareScrollViewInstance>(null);

  // useEffect(() => {
  //   const glowLoop = Animated.loop(
  //     Animated.timing(glowAnim, {
  //       toValue: 1,
  //       duration: 6800,
  //       useNativeDriver: true,
  //     }),
  //   );
  //   const gridLoop = Animated.loop(
  //     Animated.timing(gridAnim, {
  //       toValue: 1,
  //       duration: 12000,
  //       useNativeDriver: true,
  //     }),
  //   );
  //   glowLoop.start();
  //   gridLoop.start();
  //   return () => {
  //     glowLoop.stop();
  //     gridLoop.stop();
  //   };
  // }, [glowAnim, gridAnim]);

  const canSubmit = useMemo(() => {
    const ok =
      account.trim().length > 0 &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword;
    return ok && !submitting;
  }, [account, password, confirmPassword, submitting]);

  const validate = (): RegisterFieldErrors => {
    const next: RegisterFieldErrors = {};
    if (!account.trim()) next.account = '请输入手机号 / 邮箱 / 工号';
    if (!password) next.password = '请输入密码';
    if (password && password.length < 6) next.password = '密码至少 6 位';
    if (!confirmPassword) next.confirmPassword = '请再次输入密码';
    if (confirmPassword && confirmPassword.length < 6) next.confirmPassword = '密码至少 6 位';
    if (password && confirmPassword && password !== confirmPassword) {
      next.confirmPassword = '两次输入的密码不一致';
    }
    return next;
  };

  const navigateToLogin = (): void => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Login');
  };

  const handleRegister = (): void => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setTimeout(() => {
      Alert.alert('注册成功', '现在可以使用新账号登录。', [
        {
          text: '去登录',
          onPress: navigateToLogin,
        },
      ]);
      setSubmitting(false);
    }, 650);
  };

  const handleAccountChange = (v: string): void => {
    setAccount(v);
    if (errors.account) setErrors((prev) => ({ ...prev, account: undefined }));
  };

  const handlePasswordChange = (v: string): void => {
    setPassword(v);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
    if (errors.confirmPassword && confirmPassword && v === confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleConfirmPasswordChange = (v: string): void => {
    setConfirmPassword(v);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  return {
    scrollRef,
    errors,
    account,
    handleAccountChange,
    password,
    handlePasswordChange,
    confirmPassword,
    handleConfirmPasswordChange,
    handleRegister,
    canSubmit,
    submitting,
    navigateToLogin,
  };
};

export default useRegister;
