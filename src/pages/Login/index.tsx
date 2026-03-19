import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import { type FC, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import CustomButton from '~/components/CustomButton';
import { SafeAreaWrapper } from '~/components/SafeAreaWrapper';

import { uiColors } from './constants';

interface LoginFieldErrors {
  account?: string;
  password?: string;
}

const LoginPage: FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<LoginFieldErrors>({});

  const glowAnim = useMemo(() => new Animated.Value(0), []);
  const gridAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 6800,
        useNativeDriver: true,
      }),
    );
    const gridLoop = Animated.loop(
      Animated.timing(gridAnim, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: true,
      }),
    );
    glowLoop.start();
    gridLoop.start();
    return () => {
      glowLoop.stop();
      gridLoop.stop();
    };
  }, [glowAnim, gridAnim]);

  const canSubmit = useMemo(() => {
    return account.trim().length > 0 && password.length >= 6 && !submitting;
  }, [account, password, submitting]);

  const validate = (): LoginFieldErrors => {
    const next: LoginFieldErrors = {};
    if (!account.trim()) next.account = '请输入手机号 / 邮箱 / 工号';
    if (!password) next.password = '请输入密码';
    if (password && password.length < 6) next.password = '密码至少 6 位';
    return next;
  };

  const handleLogin = (): void => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setTimeout(() => {
      Alert.alert('登录成功', '欢迎回来。');
      navigation.goBack();
      setSubmitting(false);
    }, 650);
  };

  const glow1TranslateX = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [-40, 30] });
  const glow1TranslateY = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [10, -20] });
  const glow2TranslateX = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [20, -30] });
  const glow2TranslateY = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 25] });
  const gridTranslateY = gridAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -28] });

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <View style={styles.root}>
        <View style={styles.bgBase} />
        <View pointerEvents='none' style={styles.bgNoise} />

        <Animated.View
          pointerEvents='none'
          style={[
            styles.grid,
            {
              transform: [{ translateY: gridTranslateY }],
            },
          ]}
        />

        <Animated.View
          pointerEvents='none'
          style={[
            styles.glowBallCyan,
            {
              transform: [{ translateX: glow1TranslateX }, { translateY: glow1TranslateY }],
            },
          ]}
        />
        <Animated.View
          pointerEvents='none'
          style={[
            styles.glowBallPurple,
            {
              transform: [{ translateX: glow2TranslateX }, { translateY: glow2TranslateY }],
            },
          ]}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <Text style={styles.brandLine}>LINGGOUTONG</Text>
              <Text style={styles.title}>AI 智能登录</Text>
              <Text style={styles.subtitle}>安全 · 快速 · 低打扰</Text>
            </View>

            <View style={styles.card}>
              <View pointerEvents='none' style={styles.cardTopGlow} />
              <Text style={styles.cardTitle}>欢迎回来</Text>

              <View style={styles.field}>
                <Text style={styles.label}>账号</Text>
                <TextInput
                  autoCapitalize='none'
                  autoCorrect={false}
                  keyboardType='email-address'
                  placeholder='手机号 / 邮箱 / 工号'
                  placeholderTextColor={uiColors.white35}
                  returnKeyType='next'
                  style={[styles.input, errors.account && styles.inputError]}
                  value={account}
                  onChangeText={(v) => {
                    setAccount(v);
                    if (errors.account) setErrors((prev) => ({ ...prev, account: undefined }));
                  }}
                />
                {!!errors.account && <Text style={styles.errorText}>{errors.account}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>密码</Text>
                <TextInput
                  secureTextEntry
                  autoCapitalize='none'
                  placeholder='输入密码'
                  placeholderTextColor={uiColors.white35}
                  returnKeyType='done'
                  style={[styles.input, errors.password && styles.inputError]}
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  onSubmitEditing={handleLogin}
                />
                {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.actions}>
                <CustomButton
                  disabled={!canSubmit}
                  style={[styles.loginButton, !canSubmit && styles.loginButtonDisabled]}
                  title={submitting ? '登录中...' : '登录'}
                  onPress={handleLogin}
                />

                <View style={styles.linkRow}>
                  <Pressable
                    hitSlop={8}
                    onPress={() => {
                      Alert.alert('忘记密码', '请联系管理员或使用短信找回流程（待接入）。');
                    }}
                  >
                    <Text style={styles.linkText}>忘记密码</Text>
                  </Pressable>

                  <View style={styles.linkDivider} />

                  <Pressable
                    hitSlop={8}
                    onPress={() => {
                      navigation.navigate('Register');
                    }}
                  >
                    <Text style={styles.linkText}>去注册</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                登录即代表你同意 <Text style={styles.footerLink}>用户协议</Text> 与{' '}
                <Text style={styles.footerLink}>隐私政策</Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: {
    flex: 1,
    backgroundColor: uiColors.bg1,
  },
  bgBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: uiColors.bg1,
  },
  bgNoise: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
    backgroundColor: uiColors.transparent,
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
    backgroundColor: uiColors.transparent,
    transform: [{ translateY: 0 }],
  },
  glowBallCyan: {
    position: 'absolute',
    top: -90,
    left: -70,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: uiColors.neonCyan,
    opacity: 0.14,
  },
  glowBallPurple: {
    position: 'absolute',
    bottom: -120,
    right: -90,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: uiColors.neonPurple,
    opacity: 0.16,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 22,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 18,
  },
  brandLine: {
    color: uiColors.white60,
    letterSpacing: 3.2,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '800',
    color: uiColors.white85,
  },
  subtitle: {
    marginTop: 8,
    color: uiColors.white66,
    fontSize: 13,
  },
  card: {
    marginTop: 10,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: uiColors.white14,
    backgroundColor: uiColors.cardBg,
    shadowColor: uiColors.glowPurple,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    elevation: 6,
    overflow: 'hidden',
  },
  cardTopGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    height: 2,
    backgroundColor: uiColors.neonCyan,
    opacity: 0.45,
  },
  cardTitle: {
    color: uiColors.white85,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    color: uiColors.white66,
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: uiColors.white85,
    backgroundColor: uiColors.fieldBg,
    borderWidth: 1,
    borderColor: uiColors.white10,
  },
  inputError: {
    borderColor: uiColors.errorRed,
  },
  errorText: {
    marginTop: 8,
    color: uiColors.errorRed,
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    marginTop: 8,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: uiColors.primary,
    shadowColor: uiColors.glowPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: uiColors.buttonDisabled1,
  },
  linkRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: uiColors.linkBlue,
    fontSize: 13,
    fontWeight: '700',
  },
  linkDivider: {
    width: 1,
    height: 12,
    backgroundColor: uiColors.white22,
    marginHorizontal: 12,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    color: uiColors.white55,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: uiColors.white75,
    fontWeight: '700',
  },
});

export default LoginPage;
