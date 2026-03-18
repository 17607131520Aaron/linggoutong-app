import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { COLORS } from '../constants';

import type { ActionType } from '../type';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

const ActionBtn: React.FC<{ type: ActionType }> = ({ type }) => {
  let btnStyle: StyleProp<ViewStyle> = styles.btnOutline;
  let textStyle: StyleProp<TextStyle> = styles.btnTextOutline;
  let label = type as string;

  switch (type) {
    case '通过':
      btnStyle = styles.btnPrimary;
      textStyle = styles.btnTextPrimary;
      break;
    case '驳回':
      btnStyle = styles.btnDanger;
      textStyle = styles.btnTextDanger;
      break;
    case '通过_disabled':
      btnStyle = styles.btnDisabled;
      textStyle = styles.btnTextPrimary;
      label = '通过';
      break;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={type.includes('disabled')}
      style={[styles.actionBtn, btnStyle]}
    >
      <Text style={[styles.actionBtnText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 13,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  btnTextOutline: {
    color: COLORS.textMain,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
  },
  btnTextPrimary: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  btnDanger: {
    borderWidth: 1,
    borderColor: COLORS.red,
    backgroundColor: COLORS.white,
  },
  btnTextDanger: {
    color: COLORS.red,
  },
  btnDisabled: {
    backgroundColor: COLORS.primaryLight,
  },
});

export default ActionBtn;
