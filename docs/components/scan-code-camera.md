# ScanCodeCamera 扫码组件

## 能力说明

`src/components/ScanCodeCamera` 基于 `react-native-vision-camera`，封装了相机权限处理、扫码频率控制与扫码区域过滤。

## 可以做什么

- 扫描二维码与条形码
- 控制重复扫码间隔（`scanInterval`）
- 控制手电筒（`torchEnabled`）
- 仅在取景区域内触发扫描结果

## 如何使用

1. 提供 `onScan` 回调接收扫码结果
2. 按需传 `scanInterval`、`torchEnabled`
3. 可通过 `style` 控制预览区域尺寸

## 使用示例

```tsx
import ScanCodeCamera from '~/components/ScanCodeCamera';

<ScanCodeCamera
  scanInterval={1200}
  torchEnabled={false}
  style={{ height: 280, borderRadius: 12 }}
  onScan={({ value, type }) => {
    console.log('scan result', value, type);
  }}
/>;
```
