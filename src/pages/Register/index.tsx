import { type FC } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import CustomButton from '~/components/CustomButton';
import { SafeAreaWrapper } from '~/components/SafeAreaWrapper';

import { uiColors } from './constants.ts';
import useRegister from './hooks/useRegister.ts';
import { useRegisterBackgroundAnimations } from './hooks/useRegisterBackgroundAnimations.ts';

const RegisterPage: FC = () => {
  const { glow1TranslateX, glow1TranslateY, glow2TranslateX, glow2TranslateY, gridTranslateY } =
    useRegisterBackgroundAnimations();
  const {
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
  } = useRegister();

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} style={styles.safeArea}>
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
          style={styles.flex}
        >
          <KeyboardAwareScrollView
            ref={scrollRef}
            enableOnAndroid
            contentContainerStyle={styles.content}
            extraScrollHeight={40}
            keyboardOpeningTime={0}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <Text style={styles.brandLine}>LINGGOUTONG</Text>
              <Text style={styles.title}>AI 智能注册</Text>
              <Text style={styles.subtitle}>快速创建账号 · 立即开始</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>创建账号</Text>

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
                  onChangeText={handleAccountChange}
                />
                {!!errors.account && <Text style={styles.errorText}>{errors.account}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>密码</Text>
                <TextInput
                  secureTextEntry
                  autoCapitalize='none'
                  placeholder='设置密码（至少 6 位）'
                  placeholderTextColor={uiColors.white35}
                  returnKeyType='next'
                  style={[styles.input, errors.password && styles.inputError]}
                  value={password}
                  onChangeText={handlePasswordChange}
                />
                {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>确认密码</Text>
                <TextInput
                  secureTextEntry
                  autoCapitalize='none'
                  placeholder='再次输入密码'
                  placeholderTextColor={uiColors.white35}
                  returnKeyType='done'
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  onSubmitEditing={handleRegister}
                />
                {!!errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>

              <View style={styles.actions}>
                <CustomButton
                  disabled={!canSubmit}
                  style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
                  title={submitting ? '注册中...' : '注册'}
                  onPress={handleRegister}
                />

                <View style={styles.linkRow}>
                  <Pressable hitSlop={8} onPress={navigateToLogin}>
                    <Text style={styles.linkText}>去登录</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                注册即代表你同意 <Text style={styles.footerLink}>用户协议</Text> 与{' '}
                <Text style={styles.footerLink}>隐私政策</Text>
              </Text>
            </View>
          </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: uiColors.bg1 },
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
    fontSize: 14,
  },
  card: {
    marginTop: 10,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: uiColors.white14,
    backgroundColor: uiColors.cardBg,
    shadowColor: uiColors.glowPurple,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    overflow: 'hidden',
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
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: uiColors.primary,
    shadowColor: uiColors.glowPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6,
  },
  primaryButtonDisabled: {
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

export default RegisterPage;
