import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';
import {
  Camera,
  type Code,
  type CodeScannerFrame,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

import colors from '~/common/colors';
import {
  checkPermission,
  isGranted,
  type PermissionStatus,
  requestCameraPermission,
} from '~/common/permissions';

interface ScanResult {
  value: string;
  type: string;
}

interface ScanCodeCameraProps {
  onScan: (result: ScanResult) => void;
  style?: StyleProp<ViewStyle>;
  scanInterval?: number;
  torchEnabled?: boolean;
}

const cameraPermission =
  Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
const frameBorderColor = 'rgba(255, 255, 255, 0.92)';
const transparentColor = 'transparent';
const scanFrameRatio = 0.72;

const ScanCodeCamera: React.FC<ScanCodeCameraProps> = ({
  onScan,
  style,
  scanInterval = 1500,
  torchEnabled = false,
}): React.JSX.Element => {
  const device = useCameraDevice('back');
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | null>(null);
  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 });
  const lastScannedRef = useRef<{ value: string; timestamp: number } | null>(null);

  const handleCheckPermission = useCallback(async () => {
    const status = await checkPermission(cameraPermission);

    if (!isGranted(status) && status !== 'blocked') {
      const nextStatus = await requestCameraPermission();
      setPermissionStatus(nextStatus);
      return;
    }

    setPermissionStatus(status);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleCheckPermission().catch(() => undefined);
    }, 0);

    return () => clearTimeout(timer);
  }, [handleCheckPermission]);

  const handleCodeScanned = useCallback(
    (value: string, type: string) => {
      const now = Date.now();
      const lastScanned = lastScannedRef.current;

      if (lastScanned?.value === value && now - (lastScanned.timestamp ?? 0) < scanInterval) {
        return;
      }

      lastScannedRef.current = { value, timestamp: now };
      onScan({ value, type });
    },
    [onScan, scanInterval],
  );

  const isCodeInScanFrame = useCallback(
    (code: Code, frame: CodeScannerFrame): boolean => {
      if (!code.frame || layoutSize.width <= 0 || layoutSize.height <= 0) {
        return false;
      }

      const previewWidth = frame.width || layoutSize.width;
      const previewHeight = frame.height || layoutSize.height;
      const scanFrameSize = Math.min(layoutSize.width, layoutSize.height) * scanFrameRatio;
      const scanFrameLeft = (layoutSize.width - scanFrameSize) / 2;
      const scanFrameTop = (layoutSize.height - scanFrameSize) / 2;
      const scaleX = layoutSize.width / previewWidth;
      const scaleY = layoutSize.height / previewHeight;
      const codeCenterX = (code.frame.x + code.frame.width / 2) * scaleX;
      const codeCenterY = (code.frame.y + code.frame.height / 2) * scaleY;

      return (
        codeCenterX >= scanFrameLeft &&
        codeCenterX <= scanFrameLeft + scanFrameSize &&
        codeCenterY >= scanFrameTop &&
        codeCenterY <= scanFrameTop + scanFrameSize
      );
    },
    [layoutSize.height, layoutSize.width],
  );

  const handleLayout = useCallback((event: LayoutChangeEvent): void => {
    const { height, width } = event.nativeEvent.layout;
    setLayoutSize((current) => {
      if (current.width === width && current.height === height) {
        return current;
      }

      return { width, height };
    });
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', 'code-39', 'upc-a', 'upc-e'],
    onCodeScanned: (codes, frame) => {
      const validCode = codes.find(
        (code) =>
          typeof code.value === 'string' && code.value.trim() && isCodeInScanFrame(code, frame),
      );

      if (!validCode?.value) {
        return;
      }

      handleCodeScanned(validCode.value, validCode.type);
    },
  });

  const cameraDevice =
    permissionStatus !== null && isGranted(permissionStatus) ? device : undefined;

  if (!cameraDevice) {
    return <View style={style} />;
  }

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Camera
        isActive
        codeScanner={codeScanner}
        device={cameraDevice}
        style={StyleSheet.absoluteFill}
        torch={torchEnabled && cameraDevice.hasTorch ? 'on' : 'off'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: colors.black,
    position: 'relative',
  },
});

export type { ScanResult };
export default ScanCodeCamera;
