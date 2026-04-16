/* eslint-disable @typescript-eslint/no-explicit-any */

import { CONFIG } from './config';

export type ConsoleMethod = keyof Pick<Console, 'log' | 'info' | 'warn' | 'error' | 'debug'>;

export const safeExecute = <T>(fn: () => T, fallback?: T): T => {
  try {
    return fn();
  } catch {
    return fallback as T;
  }
};

export const originalConsole: Partial<Record<ConsoleMethod, (...args: any[]) => void>> = (() => {
  const methods: ConsoleMethod[] = ['log', 'info', 'warn', 'error', 'debug'];
  return methods.reduce((acc, method) => {
    // eslint-disable-next-line no-console
    const fn = console[method] as unknown;
    acc[method] =
      typeof fn === 'function' ? (fn as (...args: any[]) => void).bind(console) : undefined;
    return acc;
  }, {} as Partial<Record<ConsoleMethod, (...args: any[]) => void>>);
})();

export const safeConsoleCall = (method: ConsoleMethod, ...args: any[]): void => {
  safeExecute(() => {
    const target = originalConsole[method];
    if (target) {
      target(...args);
    }
  });
};

export const safeStringify = (value: any): string => {
  if (value === undefined || value === null) {
    return String(value);
  }

  if (typeof value === 'object') {
    try {
      const seen = new WeakSet<object>();
      return JSON.stringify(
        value,
        (_key, val) => {
          if (typeof val === 'function' || val === undefined) {
            return '[Function]';
          }
          if (typeof val === 'object' && val !== null) {
            if (seen.has(val as object)) {
              return '[Circular]';
            }
            seen.add(val as object);
          }
          return val;
        },
        2,
      );
    } catch {
      return safeExecute(() => String(value), '[无法序列化的对象]');
    }
  }

  return String(value);
};

export const formatLogMessage = (...args: any[]): string => args.map(safeStringify).join(' ');

export const getStringByteSize = (value: string): number => {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(value).length;
  }

  let size = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    size += char > 127 ? 3 : 1;
  }
  return size;
};

export const isFormDataInstance = (value: any): boolean =>
  typeof FormData !== 'undefined' && value instanceof FormData;

export const isBlobInstance = (value: any): boolean =>
  typeof Blob !== 'undefined' && value instanceof Blob;

export const isFileInstance = (value: any): boolean =>
  typeof File !== 'undefined' && value instanceof File;

export const truncateString = (value: any): any => {
  if (typeof value !== 'string') {
    return value;
  }

  if (value.length <= CONFIG.MAX_PAYLOAD_PREVIEW_LENGTH) {
    return value;
  }

  return `${value.slice(0, CONFIG.MAX_PAYLOAD_PREVIEW_LENGTH)}... [truncated ${
    value.length - CONFIG.MAX_PAYLOAD_PREVIEW_LENGTH
  } chars]`;
};

export const normalizeHeaders = (
  headers: Record<string, any> | undefined | null,
): Record<string, string> => {
  if (!headers || typeof headers !== 'object') {
    return {};
  }

  return Object.keys(headers).reduce((acc, key) => {
    const value = headers[key];
    if (value === undefined || value === null) {
      return acc;
    }

    acc[String(key)] = Array.isArray(value)
      ? value.map((item) => String(item)).join(', ')
      : String(value);
    return acc;
  }, {} as Record<string, string>);
};

export const serializePayloadPreview = (value: any): any => {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === 'string') {
    return truncateString(value);
  }

  if (isFormDataInstance(value)) {
    return '[FormData]';
  }

  if (isBlobInstance(value)) {
    return `[${value.constructor.name}]`;
  }

  if (value instanceof ArrayBuffer) {
    return '[ArrayBuffer]';
  }

  if (typeof value === 'object') {
    const serialized = truncateString(safeStringify(value));

    try {
      return JSON.parse(serialized);
    } catch {
      return serialized;
    }
  }

  return value;
};
