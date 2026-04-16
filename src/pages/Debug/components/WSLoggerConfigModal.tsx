import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';

import colors from '~/common/colors';
import createSingletonModalHook from '~/hooks/useSingletonModal';

export interface WSLoggerModalValues {
  wsEnabled: boolean;
  wsIp: string;
}

export interface WSLoggerModalOpenProps {
  initialWsEnabled?: boolean;
  initialWsIp?: string;
  onSave?: (values: WSLoggerModalValues) => void;
}

interface WSLoggerConfigModalProps extends WSLoggerModalOpenProps {
  isVisible: boolean;
  onClose: () => void;
}

const WSLoggerConfigModal: React.FC<WSLoggerConfigModalProps> = (props) => {
  const { isVisible, onClose, initialWsEnabled = false, initialWsIp = '', onSave } = props;

  const [wsEnabled, setWsEnabled] = useState(initialWsEnabled);
  const [wsIp, setWsIp] = useState(initialWsIp);

  return (
    <Modal
      hideModalContentWhileAnimating
      useNativeDriver
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
      <View style={styles.modalCard}>
        <Text style={styles.modalTitle}>WS Logger 配置</Text>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>启用</Text>
          <Switch
            thumbColor={wsEnabled ? colors.brandPrimary : '#FFFFFF'}
            trackColor={{ false: '#D1D5DB', true: colors.brandPrimaryLight }}
            value={wsEnabled}
            onValueChange={setWsEnabled}
          />
        </View>

        <View style={styles.formRowCol}>
          <Text style={styles.formLabel}>日志服务器 IP</Text>
          <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='numbers-and-punctuation'
            placeholder='例如:192.168.1.100'
            placeholderTextColor={colors.textGray}
            style={styles.input}
            value={wsIp}
            onChangeText={setWsIp}
          />
          <Text style={styles.hint}>真机调试通常需要填写开发机 IP；模拟器一般无需配置。</Text>
        </View>

        <View style={styles.modalActions}>
          <Pressable style={[styles.btn, styles.btnGhost]} onPress={onClose}>
            <Text style={[styles.btnText, styles.btnGhostText]}>取消</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => {
              onSave?.({ wsEnabled, wsIp });
              onClose();
            }}
          >
            <Text style={[styles.btnText, styles.btnPrimaryText]}>保存</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export const useWSLoggerModal =
  createSingletonModalHook<WSLoggerModalOpenProps>(WSLoggerConfigModal);

const styles = StyleSheet.create({
  modalCard: {
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 16,
  },
  modalTitle: {
    color: colors.textMain,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  formRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formRowCol: {
    marginTop: 12,
  },
  formLabel: {
    color: colors.textMain,
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    marginTop: 10,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    color: colors.textMain,
    backgroundColor: colors.white,
  },
  hint: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 10,
  },
  btn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  btnGhost: {
    backgroundColor: colors.pageBackground,
  },
  btnGhostText: {
    color: colors.textMain,
  },
  btnPrimary: {
    backgroundColor: colors.brandPrimary,
  },
  btnPrimaryText: {
    color: colors.white,
  },
});

export default WSLoggerConfigModal;
