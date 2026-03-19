import colors from '~/common/colors';

import type { TabItem, TodoItem } from './type';

export const COLORS = {
  primary: colors.brandPrimary,
  primaryLight: colors.brandPrimaryLight,
  bgBlue: colors.surfaceHeader,
  bgLightBlue: colors.surfaceHeaderLight,
  bgGray: colors.pageBackground,
  white: colors.white,
  textMain: colors.textMain,
  textSub: colors.textSecondary,
  textGray: colors.textGray,
  border: colors.borderLight,
  orange: colors.accentOrange,
  red: colors.danger,
  purple: colors.accentPurple,
  tagBlueBg: colors.tagBlueBg,
  tagOrangeBg: colors.tagOrangeBg,
} as const;

export const TABS: TabItem[] = [
  { key: 'missing', label: '缺料待处理', count: 3 },
  { key: 'inbound', label: '待入库', count: 3 },
  { key: 'outbound', label: '待出库', count: 2 },
  { key: 'dispatch', label: '物料待派发', count: 3 },
];

export const MOCK_DATA: TodoItem[] = [
  {
    id: '1',
    applicant: '欧阳倩倩',
    time: '06-10 12:00申请',
    orderType: '工单',
    orderId: '#6908',
    isWorkOrder: true,
    items: [
      {
        id: 'i1',
        title: '导向片-24*2400-方头双孔-201不锈钢小米智能门锁 E10-碳素黑-标配',
        sku: 'C0354758789089',
        price: '¥20.00',
        qty: 2,
        image: 'https://via.placeholder.com/80',
      },
      {
        id: 'i2',
        title: '电控主板-室内机',
        sku: 'C0354758789089',
        price: '¥20.00',
        qty: 2,
        image: 'https://via.placeholder.com/80',
      },
    ],
    actions: ['调整物料', '通过'],
  },
  {
    id: '2',
    applicant: '张强',
    time: '06-10 12:00申请',
    orderType: '非工单',
    orderId: '#7022',
    isWorkOrder: false,
    items: [
      {
        id: 'i3',
        title: '导向片-24*2400-方头双孔-201不锈钢小米智能门锁 E10-碳素黑-标配',
        sku: 'C0354758789089',
        price: '¥20.00',
        stock: '机构库存 x2',
        qty: 5,
        image: 'https://via.placeholder.com/80',
      },
      {
        id: 'i4',
        title: '电池组件-小米米家电动滑板车1S',
        sku: 'C0354758789089',
        price: '¥20.00',
        stock: '机构库存 x5',
        qty: 2,
        image: 'https://via.placeholder.com/80',
      },
    ],
    actions: ['调整物料', '驳回', '通过_disabled'],
  },
];
