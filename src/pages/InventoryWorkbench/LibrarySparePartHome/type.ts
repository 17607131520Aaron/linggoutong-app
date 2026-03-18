// 按钮操作类型（联合类型约束）
type ActionType = '调整物料' | '驳回' | '通过' | '通过_disabled';

interface Product {
  id: string;
  title: string;
  sku: string;
  price: string;
  stock?: string; // 机构库存 (可选)
  qty: number;
  image: string;
}

interface TodoItem {
  id: string;
  applicant: string;
  time: string;
  orderType: '工单' | '非工单';
  orderId: string;
  isWorkOrder: boolean;
  items: Product[];
  actions: ActionType[];
}

interface TabItem {
  key: string;
  label: string;
  count: number;
}

export type { ActionType, Product, TabItem, TodoItem };
