/* eslint-disable @typescript-eslint/no-explicit-any */

import { DevSettings, NativeModules, Platform } from 'react-native';

import {
  CONFIG,
  DEFAULT_HOSTS,
  NATIVE_IP_METHODS,
  WS_READY_STATE_NAMES,
  WS_READY_STATES,
} from './config';
import {
  formatLogMessage,
  getStringByteSize,
  isBlobInstance,
  isFormDataInstance,
  normalizeHeaders,
  safeConsoleCall,
  safeExecute,
  serializePayloadPreview,
  truncateString,
} from './utils';

type Timer = ReturnType<typeof setTimeout>;

class IPAddressResolver {
  cachedIp: string | null;
  fetchPromise: Promise<string | null> | null;

  constructor() {
    this.cachedIp = null;
    this.fetchPromise = null;
  }

  getFromGlobalConfig(): string | null {
    const g = globalThis as any;
    if (!g) return null;
    return g.__LOG_SERVER_IP__ ?? g.__DEV_SERVER_IP__ ?? null;
  }

  getFromDevSettings(): string | null {
    return safeExecute(() => {
      const ip =
        DevSettings && (DevSettings as any).getIPAddress
          ? (DevSettings as any).getIPAddress()
          : null;
      return typeof ip === 'string' ? ip.trim() : null;
    }, null);
  }

  async getFromNativeModule(): Promise<string | null> {
    return safeExecute(async () => {
      const module =
        (NativeModules as any).NetworkUtilModule ?? (NativeModules as any).NetworkModule;
      if (!module) return null;

      for (const methodName of NATIVE_IP_METHODS) {
        if (module[methodName]) {
          try {
            const ip = await new Promise<string>((resolve, reject) => {
              try {
                module[methodName]((result: any) => {
                  let trimmed: string | null = null;
                  if (typeof result === 'string') {
                    trimmed = result.trim();
                  } else if (result) {
                    trimmed = String(result).trim();
                  }

                  if (trimmed) {
                    resolve(trimmed);
                    return;
                  }

                  reject(new Error('无法获取本地 IP'));
                });
              } catch (err) {
                reject(err);
              }
            });
            if (ip) return ip;
          } catch {
            // continue
          }
        }
      }
      return null;
    }, null);
  }

  getPlatformDefault(): string {
    return safeExecute(() => {
      if (Platform.OS === 'android') {
        return DEFAULT_HOSTS.ANDROID_EMULATOR;
      }
      return DEFAULT_HOSTS.IOS_SIMULATOR;
    }, DEFAULT_HOSTS.IOS_SIMULATOR);
  }

  async getLocalIpAddress(): Promise<string | null> {
    if (this.cachedIp) return this.cachedIp;
    if (this.fetchPromise) return this.fetchPromise;

    this.fetchPromise = (async () => {
      try {
        const devSettingsIp = this.getFromDevSettings();
        if (devSettingsIp) {
          this.cachedIp = devSettingsIp;
          safeConsoleCall('log', '[WS Logger] 从 DevSettings 获取到 IP:', this.cachedIp);
          return this.cachedIp;
        }

        const nativeIp = await this.getFromNativeModule();
        if (nativeIp) {
          this.cachedIp = nativeIp;
          safeConsoleCall('log', `[WS Logger] 从原生模块获取到本地 IP:`, this.cachedIp);
          return this.cachedIp;
        }
      } catch (error) {
        safeConsoleCall('debug', '[WS Logger] 获取本地 IP 失败（将使用默认策略）:', error);
      }

      return null;
    })();

    const result = await this.fetchPromise;
    this.fetchPromise = null;
    return result;
  }

  getDevServerHost(): string {
    const globalIp = this.getFromGlobalConfig();
    if (globalIp) return globalIp;

    const devSettingsIp = this.getFromDevSettings();
    if (devSettingsIp) return devSettingsIp;

    return this.getPlatformDefault();
  }
}

class WebSocketManager {
  ipResolver: IPAddressResolver;
  ws: WebSocket | null;
  connected: boolean;
  reconnecting: boolean;
  reconnectTimer: Timer | null;
  messageQueue: string[];
  connectPromise: Promise<void> | null;
  manuallyClosed: boolean;
  destroyed: boolean;

  constructor(ipResolver: IPAddressResolver) {
    this.ipResolver = ipResolver;
    this.ws = null;
    this.connected = false;
    this.reconnecting = false;
    this.reconnectTimer = null;
    this.messageQueue = [];
    this.connectPromise = null;
    this.manuallyClosed = false;
    this.destroyed = false;
  }

  buildWebSocketUrl(host: string): string {
    let wsHost = host;
    let port: number = CONFIG.LOG_SERVER_PORT;
    let parsedPort: number | null = null;

    if (typeof host === 'string') {
      const bracketPortMatch = host.match(/^\[([0-9a-fA-F:]+)\]:(\d+)$/);
      if (bracketPortMatch) {
        wsHost = `[${bracketPortMatch[1]}]`;
        parsedPort = Number(bracketPortMatch[2]);
      } else {
        const simplePortMatch = host.match(/^([^:]+):(\d+)$/);
        if (simplePortMatch) {
          wsHost = simplePortMatch[1];
          parsedPort = Number(simplePortMatch[2]);
        }
      }
    }

    if (parsedPort && Number.isFinite(parsedPort)) {
      port = parsedPort === CONFIG.METRO_PORT ? CONFIG.LOG_SERVER_PORT : parsedPort;
    }

    return `ws://${wsHost}:${port}/logs`;
  }

  async getWebSocketUrlAsync(): Promise<string> {
    const globalIp = this.ipResolver.getFromGlobalConfig();
    if (globalIp) {
      safeConsoleCall('log', '[WS Logger] 使用配置的日志服务器 IP:', globalIp);
      return this.buildWebSocketUrl(globalIp);
    }

    try {
      const localIp = await this.ipResolver.getLocalIpAddress();
      if (localIp) {
        safeConsoleCall('log', '[WS Logger] 使用自动获取的本地 IP:', localIp);
        return this.buildWebSocketUrl(localIp);
      }
    } catch {
      safeConsoleCall('debug', '[WS Logger] 自动获取本地 IP 失败，使用默认策略');
    }

    const devServerHost = this.ipResolver.getDevServerHost();
    if (!devServerHost) {
      try {
        const localIp = await this.ipResolver.getLocalIpAddress();
        if (localIp) {
          return this.buildWebSocketUrl(localIp);
        }
      } catch {
        // ignore
      }

      safeConsoleCall('warn', '[WS Logger] 无法获取开发服务器 IP，请设置 global.__LOG_SERVER_IP__');
      safeConsoleCall('warn', '[WS Logger] 示例: global.__LOG_SERVER_IP__ = "192.168.1.100"');
      return this.buildWebSocketUrl('<请配置IP>');
    }

    return this.buildWebSocketUrl(devServerHost);
  }

  getWebSocketUrl(): string {
    const globalIp = this.ipResolver.getFromGlobalConfig();
    if (globalIp) return this.buildWebSocketUrl(globalIp);
    if (this.ipResolver.cachedIp) return this.buildWebSocketUrl(this.ipResolver.cachedIp);
    const devServerHost = this.ipResolver.getDevServerHost();
    return this.buildWebSocketUrl(devServerHost || '<请配置IP>');
  }

  closeConnection(manuallyClosed = true): void {
    this.manuallyClosed = manuallyClosed;
    if (this.ws) {
      safeExecute(() => this.ws?.close());
      this.ws = null;
    }
    this.connected = false;
    this.connectPromise = null;
  }

  enqueueMessage(payload: string): void {
    if (this.messageQueue.length >= CONFIG.MAX_QUEUE_SIZE) {
      this.messageQueue.shift();
      safeConsoleCall(
        'warn',
        '[WS Logger] 日志队列已满，已丢弃最早的一条消息，当前上限:',
        CONFIG.MAX_QUEUE_SIZE,
      );
    }
    this.messageQueue.push(payload);
  }

  flushQueue(): void {
    if (!this.connected || !this.ws) return;
    while (this.messageQueue.length > 0) {
      const payload = this.messageQueue.shift();
      if (!payload) continue;
      try {
        this.ws.send(payload);
      } catch (error) {
        safeConsoleCall('debug', '[WS Logger] flushQueue 发送失败，重新入队:', error);
        this.messageQueue.unshift(payload);
        break;
      }
    }
  }

  send(payload: string): void {
    if (this.destroyed) return;
    if (!this.connected || !this.ws) {
      this.enqueueMessage(payload);
      if (!this.connectPromise && !this.reconnecting) {
        this.connect();
      }
      return;
    }

    try {
      this.ws.send(payload);
    } catch (error) {
      safeConsoleCall('debug', '[WS Logger] WebSocket send 失败，重新入队并重连:', error);
      this.enqueueMessage(payload);
      this.reconnect();
    }
  }

  connect(): Promise<void> {
    if (this.destroyed) return Promise.resolve();
    if (this.connectPromise) return this.connectPromise;

    this.manuallyClosed = false;
    this.connectPromise = (async () => {
      const url = await this.getWebSocketUrlAsync();

      return new Promise<void>((resolve) => {
        try {
          safeConsoleCall('log', '[WS Logger] 正在连接 WebSocket:', url);
          this.ws = new WebSocket(url);

          this.ws.onopen = () => {
            this.connected = true;
            this.reconnecting = false;
            safeConsoleCall('log', '[WS Logger] WebSocket 已连接');
            this.flushQueue();
            resolve();
          };

          this.ws.onclose = () => {
            this.connected = false;
            if (!this.manuallyClosed && !this.destroyed) {
              safeConsoleCall('warn', '[WS Logger] WebSocket 已关闭，准备重连');
              this.reconnect();
            }
            resolve();
          };

          this.ws.onerror = (event) => {
            const readyStateName = this.ws
              ? WS_READY_STATE_NAMES[this.ws.readyState] || 'UNKNOWN'
              : 'NO_WS';
            safeConsoleCall('debug', '[WS Logger] WebSocket 错误:', { readyStateName, event });
          };

          this.ws.onmessage = (event) => {
            // Server -> client messages are currently not required.
            safeConsoleCall('debug', '[WS Logger] 收到消息:', event?.data);
          };
        } catch (error) {
          safeConsoleCall('warn', '[WS Logger] WebSocket 创建失败，将重试:', error);
          this.connected = false;
          this.reconnect();
          resolve();
        } finally {
          this.connectPromise = null;
        }
      });
    })();

    return this.connectPromise;
  }

  reconnect(): void {
    if (this.destroyed) return;
    if (this.reconnecting) return;
    this.reconnecting = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.closeConnection(false);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnecting = false;
      this.connect();
    }, CONFIG.RECONNECT_DELAY);
  }

  cleanup(): void {
    this.destroyed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.closeConnection(true);
    this.messageQueue = [];
  }

  getStatus(): Record<string, any> {
    return {
      connected: this.connected,
      reconnecting: this.reconnecting,
      queueSize: this.messageQueue.length,
      readyState: this.ws ? this.ws.readyState : WS_READY_STATES.CLOSED,
      readyStateName: this.ws ? WS_READY_STATE_NAMES[this.ws.readyState] ?? 'UNKNOWN' : 'NO_WS',
      url: this.getWebSocketUrl(),
    };
  }
}

class ConsoleWrapper {
  wsManager: WebSocketManager;
  wrappedMethods: Record<string, (...args: any[]) => void> | null;
  baseConsole: Record<string, (...args: any[]) => void> | null;

  constructor(wsManager: WebSocketManager) {
    this.wsManager = wsManager;
    this.wrappedMethods = null;
    this.baseConsole = null;
  }

  createWrappedMethods(): Record<string, (...args: any[]) => void> {
    this.baseConsole ??= (() => {
      /* eslint-disable no-console */
      const base = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        debug: console.debug,
      };
      /* eslint-enable no-console */
      return base;
    })();

    const createWrapper = (level: string) => {
      return (...args: any[]) => {
        this.baseConsole?.[level]?.(...args);
        this.forwardLog(level, ...args);
      };
    };

    this.wrappedMethods = {
      log: createWrapper('log'),
      info: createWrapper('info'),
      warn: createWrapper('warn'),
      error: createWrapper('error'),
      debug: createWrapper('debug'),
    };

    return this.wrappedMethods;
  }

  forwardLog(level: string, ...args: any[]): void {
    if (!__DEV__) return;

    try {
      const message = truncateString(formatLogMessage(...args));
      const payload = JSON.stringify({
        type: 'js-log',
        level: level.toLowerCase(),
        message,
        timestamp: new Date().toISOString(),
        context: null,
      });
      this.wsManager.send(payload);
    } catch (error) {
      safeConsoleCall('error', '[WS Logger] 转发日志失败:', error);
    }
  }

  install(): void {
    if (!this.wrappedMethods) {
      this.createWrappedMethods();
    }
    Object.assign(console, this.wrappedMethods);
  }

  reinstallIfNeeded(): boolean {
    if (!this.wrappedMethods || !this.baseConsole) return false;

    const needsReinstall = Object.keys(this.wrappedMethods).some(
      (method) => (console as any)[method] !== this.wrappedMethods?.[method],
    );

    if (needsReinstall) {
      this.createWrappedMethods();
      this.install();
      safeConsoleCall('log', '[WS Logger] 检测到 console 被修改，已重新安装转发器');
      return true;
    }

    return false;
  }

  uninstall(): void {
    if (!this.baseConsole) return;
    Object.assign(console, this.baseConsole);
    this.wrappedMethods = null;
  }
}

class NetworkInterceptor {
  wsManager: WebSocketManager;
  requestMap: Map<string, any>;
  originalFetch: any;
  originalXHROpen: any;
  originalXHRSend: any;
  originalXHRSetRequestHeader: any;
  installed: boolean;

  constructor(wsManager: WebSocketManager) {
    this.wsManager = wsManager;
    this.requestMap = new Map();
    this.originalFetch = null;
    this.originalXHROpen = null;
    this.originalXHRSend = null;
    this.originalXHRSetRequestHeader = null;
    this.installed = false;
  }

  generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  parseUrl(url: string): { baseURL: string; originalUrl: string } {
    try {
      const parsed = new URL(url);
      return {
        baseURL: `${parsed.protocol}//${parsed.host}`,
        originalUrl: url,
      };
    } catch {
      return { baseURL: '', originalUrl: url };
    }
  }

  parseQueryParams(url: string): Record<string, string> {
    try {
      const parsed = new URL(url);
      const params: Record<string, string> = {};
      parsed.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return params;
    } catch {
      return {};
    }
  }

  getRequestSize(body: any): number {
    try {
      if (!body) return 0;
      if (typeof body === 'string') return getStringByteSize(body);
      if (isFormDataInstance(body)) return 0;
      if (isBlobInstance(body)) return (body as Blob).size || 0;
      if (body instanceof ArrayBuffer) return body.byteLength;
      if (typeof body === 'object') return getStringByteSize(JSON.stringify(body));
      return getStringByteSize(String(body));
    } catch {
      return 0;
    }
  }

  getResponseSize(data: any): number {
    try {
      if (data === undefined || data === null) return 0;
      if (typeof data === 'string') return getStringByteSize(data);
      if (typeof data === 'object') return getStringByteSize(JSON.stringify(data));
      return getStringByteSize(String(data));
    } catch {
      return 0;
    }
  }

  sendNetworkMessage(type: string, data: Record<string, any>): void {
    if (!__DEV__) return;

    try {
      const payload = JSON.stringify({
        type,
        data: {
          ...data,
          timestamp: new Date().toISOString(),
        },
      });

      this.wsManager.send(payload);
    } catch (error) {
      safeConsoleCall('error', '[WS Logger] 发送网络请求日志失败:', error);
    }
  }

  interceptFetch(): void {
    if (this.originalFetch) return;
    this.originalFetch = (globalThis as any).fetch;

    (globalThis as any).fetch = async (url: any, options: any = {}) => {
      const requestId = this.generateRequestId();
      const startTime = Date.now();

      let requestUrl = url;
      let requestOptions = options;
      let requestMethod = 'GET';
      const requestHeaders: Record<string, any> = {};
      let requestBody: any = null;
      let requestData: any = null;

      if (url && typeof url === 'object' && 'url' in url) {
        requestUrl = (url as any).url;
        requestMethod = (url as any).method ?? 'GET';

        if ((url as any).headers) {
          if ((url as any).headers instanceof Headers) {
            (url as any).headers.forEach((value: string, key: string) => {
              requestHeaders[key] = value;
            });
          } else if (typeof (url as any).headers === 'object') {
            Object.assign(requestHeaders, (url as any).headers);
          }
        }

        if ((url as any).body) {
          try {
            if (typeof (url as any).body === 'string') {
              requestBody = (url as any).body;
              try {
                requestData = JSON.parse((url as any).body);
              } catch {
                requestData = (url as any).body;
              }
            } else if (isFormDataInstance((url as any).body)) {
              requestBody = '[FormData]';
              requestData = '[FormData]';
            } else {
              requestBody = JSON.stringify((url as any).body);
              requestData = (url as any).body;
            }
          } catch {
            requestBody = String((url as any).body);
            requestData = requestBody;
          }
        }

        requestOptions = {
          method: (url as any).method,
          headers: (url as any).headers,
          body: (url as any).body,
          ...options,
        };
      } else {
        requestUrl = typeof url === 'string' ? url : url.toString();
        requestMethod = options.method ?? 'GET';
      }

      if (requestOptions.headers) {
        if (requestOptions.headers instanceof Headers) {
          requestOptions.headers.forEach((value: string, key: string) => {
            requestHeaders[key] = value;
          });
        } else if (typeof requestOptions.headers === 'object') {
          Object.assign(requestHeaders, requestOptions.headers);
        }
      }

      if (!requestBody && requestOptions.body) {
        try {
          if (typeof requestOptions.body === 'string') {
            requestBody = requestOptions.body;
            try {
              requestData = JSON.parse(requestOptions.body);
            } catch {
              requestData = requestOptions.body;
            }
          } else if (isFormDataInstance(requestOptions.body)) {
            requestBody = '[FormData]';
            requestData = '[FormData]';
          } else {
            requestBody = JSON.stringify(requestOptions.body);
            requestData = requestOptions.body;
          }
        } catch {
          requestBody = String(requestOptions.body);
          requestData = requestBody;
        }
      }

      const method = String(requestMethod).toUpperCase();
      const fullUrl = String(requestUrl);
      const urlInfo = this.parseUrl(fullUrl);
      const queryParams = this.parseQueryParams(fullUrl);
      const headers = normalizeHeaders(requestHeaders);
      const requestSize = this.getRequestSize(requestOptions.body ?? url?.body);

      const requestConfig: Record<string, any> = {};
      if (requestOptions.credentials !== undefined)
        requestConfig.credentials = requestOptions.credentials;
      if (requestOptions.mode !== undefined) requestConfig.mode = requestOptions.mode;
      if (requestOptions.cache !== undefined) requestConfig.cache = requestOptions.cache;
      if (requestOptions.redirect !== undefined) requestConfig.redirect = requestOptions.redirect;
      if (requestOptions.referrer !== undefined) requestConfig.referrer = requestOptions.referrer;
      if (requestOptions.referrerPolicy !== undefined)
        requestConfig.referrerPolicy = requestOptions.referrerPolicy;

      this.sendNetworkMessage('network-request', {
        id: requestId,
        method,
        url: fullUrl,
        headers,
        data: serializePayloadPreview(requestData),
        body: serializePayloadPreview(requestBody),
        params: method === 'GET' ? queryParams : undefined,
        startTime,
        type: 'fetch',
        baseURL: urlInfo.baseURL,
        originalUrl: urlInfo.originalUrl,
        requestSize,
        ...requestConfig,
      });

      this.requestMap.set(requestId, { startTime, method, url: fullUrl });

      try {
        const response = await this.originalFetch.call(globalThis, url, options);
        const endTime = Date.now();

        const responseClone = response.clone();
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value: string, key: string) => {
          responseHeaders[key] = value;
        });

        let responseData: any = null;
        let responseSize = 0;
        try {
          const contentType = response.headers.get('content-type') ?? '';
          if (contentType.includes('application/json')) {
            responseData = await responseClone.json();
            responseSize = this.getResponseSize(responseData);
          } else if (contentType.includes('text/')) {
            const text = await responseClone.text();
            responseData = text;
            responseSize = this.getResponseSize(text);
          } else {
            const blob = await responseClone.blob();
            responseSize = blob.size;
            responseData = '[Blob]';
          }
        } catch (error) {
          safeConsoleCall('debug', '[WS Logger] 读取响应体失败:', error);
          responseSize = 0;
        }

        this.sendNetworkMessage('network-response', {
          id: requestId,
          status: response.status,
          statusText: response.statusText,
          headers: normalizeHeaders(responseHeaders),
          data: serializePayloadPreview(responseData),
          endTime,
          size: responseSize,
        });

        this.requestMap.delete(requestId);
        return response;
      } catch (error) {
        const endTime = Date.now();
        const errorMessage = error instanceof Error ? error.message : String(error);

        this.sendNetworkMessage('network-error', { id: requestId, error: errorMessage, endTime });
        this.requestMap.delete(requestId);
        throw error;
      }
    };
  }

  interceptXMLHttpRequest(): void {
    if (typeof XMLHttpRequest === 'undefined') return;
    if (this.originalXHROpen) return;

    const generateRequestId = this.generateRequestId.bind(this);
    const sendNetworkMessage = this.sendNetworkMessage.bind(this);
    const parseUrl = this.parseUrl.bind(this);
    const parseQueryParams = this.parseQueryParams.bind(this);
    const getRequestSize = this.getRequestSize.bind(this);
    const getResponseSize = this.getResponseSize.bind(this);
    const { requestMap } = this;
    const OriginalXHR = XMLHttpRequest;

    this.originalXHROpen = OriginalXHR.prototype.open;
    const { originalXHROpen } = this;
    OriginalXHR.prototype.open = function (method: string, url: any, ...rest: any[]) {
      const requestId = generateRequestId();
      (this as any)._networkRequestId = requestId;
      (this as any)._networkMethod = method.toUpperCase();
      (this as any)._networkUrl = typeof url === 'string' ? url : url.toString();
      (this as any)._networkStartTime = Date.now();

      requestMap.set(requestId, {
        startTime: (this as any)._networkStartTime,
        method: (this as any)._networkMethod,
        url: (this as any)._networkUrl,
        xhr: this,
      });

      this.addEventListener('load', function () {
        const endTime = Date.now();

        const responseHeaders: Record<string, string> = {};
        const headerString = (this as any).getAllResponseHeaders?.() ?? '';
        headerString.split('\r\n').forEach((line: string) => {
          const parts = line.split(': ');
          if (parts.length === 2) {
            responseHeaders[parts[0].trim()] = parts[1].trim();
          }
        });

        let responseData: any = null;
        let responseSize = 0;
        try {
          const contentType = (this as any).getResponseHeader?.('content-type') ?? '';
          if (contentType.includes('application/json')) {
            try {
              responseData = JSON.parse((this as any).responseText);
            } catch {
              responseData = (this as any).responseText;
            }
          } else {
            responseData = (this as any).responseText;
          }
          responseSize = getResponseSize(responseData);
        } catch (error) {
          safeConsoleCall('debug', '[WS Logger] 读取 XHR 响应失败:', error);
        }

        sendNetworkMessage('network-response', {
          id: (this as any)._networkRequestId,
          status: (this as any).status,
          statusText: (this as any).statusText,
          headers: normalizeHeaders(responseHeaders),
          data: serializePayloadPreview(responseData),
          endTime,
          size: responseSize,
        });

        requestMap.delete((this as any)._networkRequestId);
      });

      this.addEventListener('error', function () {
        const endTime = Date.now();
        sendNetworkMessage('network-error', {
          id: (this as any)._networkRequestId,
          error: 'Network request failed',
          endTime,
        });
        requestMap.delete((this as any)._networkRequestId);
      });

      this.addEventListener('timeout', function () {
        const endTime = Date.now();
        sendNetworkMessage('network-error', {
          id: (this as any)._networkRequestId,
          error: 'Request timeout',
          endTime,
        });
        requestMap.delete((this as any)._networkRequestId);
      });

      return originalXHROpen.call(this, method, url, ...rest);
    };

    this.originalXHRSend = OriginalXHR.prototype.send;
    const { originalXHRSend } = this;
    OriginalXHR.prototype.send = function (data: any) {
      if ((this as any)._networkRequestId) {
        const urlInfo = parseUrl((this as any)._networkUrl);
        const queryParams = parseQueryParams((this as any)._networkUrl);

        const headers: Record<string, any> = {};
        if ((this as any)._requestHeaders) {
          Object.assign(headers, (this as any)._requestHeaders);
        }

        let requestBody: any = null;
        let requestData: any = null;
        if (data) {
          try {
            if (typeof data === 'string') {
              requestBody = data;
              try {
                requestData = JSON.parse(data);
              } catch {
                requestData = data;
              }
            } else if (isFormDataInstance(data)) {
              requestBody = '[FormData]';
              requestData = '[FormData]';
            } else if (isBlobInstance(data) || data instanceof ArrayBuffer) {
              requestBody = `[${data.constructor.name}]`;
              requestData = `[${data.constructor.name}]`;
            } else {
              requestBody = String(data);
              requestData = requestBody;
            }
          } catch {
            requestBody = String(data);
            requestData = requestBody;
          }
        }

        const requestSize = getRequestSize(data);
        const xhrConfig: Record<string, any> = {};
        if ((this as any).withCredentials !== undefined)
          xhrConfig.withCredentials = (this as any).withCredentials;
        if ((this as any).timeout !== undefined && (this as any).timeout > 0)
          xhrConfig.timeout = (this as any).timeout;
        if ((this as any).responseType !== undefined && (this as any).responseType !== '')
          xhrConfig.responseType = (this as any).responseType;

        sendNetworkMessage('network-request', {
          id: (this as any)._networkRequestId,
          method: (this as any)._networkMethod,
          url: (this as any)._networkUrl,
          headers: normalizeHeaders(headers),
          data: serializePayloadPreview(requestData),
          body: serializePayloadPreview(requestBody),
          params: (this as any)._networkMethod === 'GET' ? queryParams : undefined,
          startTime: (this as any)._networkStartTime,
          type: 'xhr',
          baseURL: urlInfo.baseURL,
          originalUrl: urlInfo.originalUrl,
          requestSize,
          ...xhrConfig,
        });
      }

      return originalXHRSend.call(this, data);
    };

    this.originalXHRSetRequestHeader = OriginalXHR.prototype.setRequestHeader;
    const { originalXHRSetRequestHeader } = this;
    OriginalXHR.prototype.setRequestHeader = function (header: string, value: any) {
      if (!(this as any)._requestHeaders) {
        (this as any)._requestHeaders = {};
      }
      (this as any)._requestHeaders[header] = value;
      return originalXHRSetRequestHeader.call(this, header, value);
    };
  }

  install(): void {
    if (!__DEV__) return;
    if (this.installed) return;
    this.interceptFetch();
    this.interceptXMLHttpRequest();
    this.installed = true;
    safeConsoleCall('log', '[WS Logger] 网络请求拦截器已安装');
  }

  uninstall(): void {
    if (!this.installed) return;

    if (this.originalFetch) {
      (globalThis as any).fetch = this.originalFetch;
      this.originalFetch = null;
    }

    if (this.originalXHROpen) {
      (XMLHttpRequest as any).prototype.open = this.originalXHROpen;
      this.originalXHROpen = null;
    }

    if (this.originalXHRSend) {
      (XMLHttpRequest as any).prototype.send = this.originalXHRSend;
      this.originalXHRSend = null;
    }

    if (this.originalXHRSetRequestHeader) {
      (XMLHttpRequest as any).prototype.setRequestHeader = this.originalXHRSetRequestHeader;
      this.originalXHRSetRequestHeader = null;
    }

    this.requestMap.clear();
    this.installed = false;
  }
}

class WSLogger {
  ipResolver: IPAddressResolver;
  wsManager: WebSocketManager;
  consoleWrapper: ConsoleWrapper;
  networkInterceptor: NetworkInterceptor;
  installed: boolean;
  reinstallInterval: ReturnType<typeof setInterval> | null;
  statusCheckTimer: Timer | null;

  constructor() {
    this.ipResolver = new IPAddressResolver();
    this.wsManager = new WebSocketManager(this.ipResolver);
    this.consoleWrapper = new ConsoleWrapper(this.wsManager);
    this.networkInterceptor = new NetworkInterceptor(this.wsManager);
    this.installed = false;
    this.reinstallInterval = null;
    this.statusCheckTimer = null;
  }

  install(): void {
    if (!__DEV__) return;
    if (this.installed) return;
    this.wsManager.destroyed = false;

    this.consoleWrapper.install();
    this.networkInterceptor.install();
    this.wsManager.connect();

    safeConsoleCall('log', '[WS Logger] 日志转发器已安装');
    safeConsoleCall('log', '[WS Logger] 网络请求拦截器已安装');

    const g = globalThis as any;
    if (g) {
      g.wsLoggerTest = () => this.sendTestLog();
      g.wsLoggerStatus = () => this.getStatus();
      safeConsoleCall(
        'log',
        '[WS Logger] 提示: 在控制台中可以调用 wsLoggerTest() 测试，或 wsLoggerStatus() 查看状态',
      );
    }

    this.statusCheckTimer = setTimeout(() => {
      this.statusCheckTimer = null;
      this.checkStatus();
    }, CONFIG.STATUS_CHECK_DELAY);

    this.reinstallInterval = setInterval(() => {
      if (!__DEV__) {
        this.cleanup();
        return;
      }
      this.consoleWrapper.reinstallIfNeeded();
    }, CONFIG.REINSTALL_CHECK_INTERVAL);

    if (g) {
      g._wsLoggerCleanup = () => this.cleanup();
    }

    this.installed = true;
  }

  checkStatus(): void {
    if (this.wsManager.connected) {
      safeConsoleCall('log', '[WS Logger] 测试: 转发器正常工作');
      return;
    }

    safeConsoleCall('warn', '[WS Logger] 警告: WebSocket 未连接，日志可能无法转发');
    safeConsoleCall(
      'warn',
      '[WS Logger] 提示: 检查日志服务器是否在运行，端口是否为',
      CONFIG.LOG_SERVER_PORT,
    );
    safeConsoleCall('warn', '[WS Logger] 提示: 连接地址:', this.wsManager.getWebSocketUrl());
    this.printPlatformInstructions();
  }

  printPlatformInstructions(): void {
    try {
      if (Platform.OS === 'android') {
        safeConsoleCall('warn', '[WS Logger] Android 配置说明:');
        safeConsoleCall('warn', '  - 模拟器: 自动使用 10.0.2.2（无需配置）');
        safeConsoleCall('warn', '  - 真机: 需要设置 global.__LOG_SERVER_IP__ = "你的开发机IP"');
        safeConsoleCall('warn', '  - 示例: global.__LOG_SERVER_IP__ = "192.168.1.100"');
        safeConsoleCall('warn', '  - 获取开发机IP: ifconfig | grep "inet " | grep -v 127.0.0.1');
      } else {
        safeConsoleCall('warn', '[WS Logger] iOS 配置说明:');
        safeConsoleCall('warn', '  - 模拟器: 自动使用 localhost（无需配置）');
        safeConsoleCall('warn', '  - 真机: 需要设置 global.__LOG_SERVER_IP__ = "你的开发机IP"');
      }
    } catch {
      safeConsoleCall(
        'warn',
        '[WS Logger] 提示: 如果使用真机，请设置 global.__LOG_SERVER_IP__ 为开发机的实际 IP 地址',
      );
    }
  }

  getStatus(): Record<string, any> {
    const status = {
      installed: this.installed,
      ...this.wsManager.getStatus(),
      devServerHost: this.ipResolver.getDevServerHost(),
      logServerPort: CONFIG.LOG_SERVER_PORT,
      metroPort: CONFIG.METRO_PORT,
    };
    safeConsoleCall('log', '[WS Logger] 状态:', JSON.stringify(status, null, 2));
    return status;
  }

  sendTestLog(): void {
    if (!__DEV__) {
      safeConsoleCall('log', '[WS Logger] 仅在开发环境可用');
      return;
    }

    /* eslint-disable no-console */
    console.log('[WS Logger] 这是一条测试日志消息');
    console.info('[WS Logger] 这是一条测试 info 消息');
    console.warn('[WS Logger] 这是一条测试 warn 消息');
    /* eslint-enable no-console */

    safeConsoleCall('log', '[WS Logger] 状态:', this.getStatus());
  }

  uninstall(): void {
    if (!this.installed) return;

    this.consoleWrapper.uninstall();
    this.networkInterceptor.uninstall();
    this.wsManager.cleanup();

    if (this.reinstallInterval) {
      clearInterval(this.reinstallInterval);
      this.reinstallInterval = null;
    }

    if (this.statusCheckTimer) {
      clearTimeout(this.statusCheckTimer);
      this.statusCheckTimer = null;
    }

    const g = globalThis as any;
    if (g) {
      delete g.wsLoggerTest;
      delete g.wsLoggerStatus;
      delete g._wsLoggerCleanup;
    }

    this.installed = false;
  }

  cleanup(): void {
    this.uninstall();
  }
}

let loggerInstance: WSLogger | null = null;

const getLoggerInstance = (): WSLogger => {
  loggerInstance ??= new WSLogger();
  return loggerInstance;
};

export const installWSLogger = (): void => {
  getLoggerInstance().install();
};

export const uninstallWSLogger = (): void => {
  if (loggerInstance) {
    loggerInstance.uninstall();
    loggerInstance = null;
  }
};

export const getWSLoggerStatus = (): Record<string, any> => {
  return getLoggerInstance().getStatus();
};

export const sendTestLog = (): void => {
  getLoggerInstance().sendTestLog();
};
