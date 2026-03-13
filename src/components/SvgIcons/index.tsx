/**
 * SVG 图标组件统一管理
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * 图标通用属性
 */
export interface IIconProps {
  /** 图标颜色 */
  color?: string;
  /** 图标大小，默认 24 */
  size?: number;
}

/**
 * 返回箭头图标
 */
export const BackArrowIcon: React.FC<IIconProps> = ({ color = '#007AFF', size = 24 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M15 19l-7-7 7-7'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2.5}
    />
  </Svg>
);

/**
 * 搜索图标
 */
export const SearchIcon: React.FC<IIconProps> = ({ color = '#8E8E93', size = 20 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </Svg>
);

/**
 * 右箭头图标
 */
export const ChevronRightIcon: React.FC<IIconProps> = ({ color = '#C7C7CC', size = 24 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M9 5l7 7-7 7'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </Svg>
);

/**
 * 关闭图标
 */
export const CloseIcon: React.FC<IIconProps> = ({ color = '#000000', size = 24 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M18 6L6 18M6 6l12 12'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </Svg>
);

/**
 * 菜单图标（三条横线）
 */
export const MenuIcon: React.FC<IIconProps> = ({ color = '#000000', size = 24 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M4 6h16M4 12h16M4 18h16'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </Svg>
);

/**
 * 更多图标（三个点）
 */
export const MoreIcon: React.FC<IIconProps> = ({ color = '#000000', size = 24 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </Svg>
);

/**
 * 勾选图标
 */
export const CheckIcon: React.FC<IIconProps> = ({ color = '#34C759', size = 24 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M5 13l4 4L19 7'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </Svg>
);

/**
 * 加号图标
 */
export const PlusIcon: React.FC<IIconProps> = ({ color = '#007AFF', size = 24 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M12 5v14M5 12h14'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </Svg>
);

/**
 * 减号图标
 */
export const MinusIcon: React.FC<IIconProps> = ({ color = '#FF3B30', size = 24 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M5 12h14'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </Svg>
);

/**
 * 设置图标
 */
export const SettingsIcon: React.FC<IIconProps> = ({ color = '#8E8E93', size = 24 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M12 15a3 3 0 100-6 3 3 0 000 6z'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
    <Path
      d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </Svg>
);

/**
 * 扫码图标
 */
export const ScanIcon: React.FC<IIconProps> = ({ color = '#007AFF', size = 24 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 12h10'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </Svg>
);

/**
 * 手电筒图标
 */
export const FlashlightIcon: React.FC<IIconProps> = ({ color = '#007AFF', size = 24 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M9 2v6m6-6v6M9 8h6M5 10h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </Svg>
);

/**
 * 键盘/手动录入图标
 */
export const KeyboardIcon: React.FC<IIconProps> = ({ color = '#007AFF', size = 24 }) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M4 6h16M4 10h16M4 14h16M4 18h16'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
    />
  </Svg>
);
