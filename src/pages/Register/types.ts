import type { MutableRefObject } from 'react';
import type { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type KeyboardAwareScrollViewInstance = KeyboardAwareScrollView | null;

export interface RegisterFieldErrors {
  account?: string;
  password?: string;
  confirmPassword?: string;
}

export interface UseRegisterReturn {
  scrollRef: MutableRefObject<KeyboardAwareScrollViewInstance>;
  errors: RegisterFieldErrors;
  account: string;
  handleAccountChange: (v: string) => void;
  password: string;
  handlePasswordChange: (v: string) => void;
  confirmPassword: string;
  handleConfirmPasswordChange: (v: string) => void;
  handleRegister: () => void;
  canSubmit: boolean;
  submitting: boolean;
  navigateToLogin: () => void;
}
