import { useMemo } from 'react';
import RootSiblings from 'react-native-root-siblings';

import type { ComponentType, ReactNode } from 'react';

interface RootSiblingLike {
  update: (element: ReactNode) => void;
  destroy: () => void;
}

interface ModalControlProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ModalHookApi<P extends object> {
  open: (props: P) => string;
  // Keep compatibility with typo usage required by caller.
  opne: (props: P) => string;
  close: (id: string) => void;
  closeAll: () => void;
  destroy: (id: string) => void;
}

interface ActiveModal<P extends object> {
  id: string;
  props: P;
  visible: boolean;
  sibling: RootSiblingLike;
  timer: ReturnType<typeof setTimeout> | null;
}

const DEFAULT_CLOSE_DELAY = 260;

const createModalId = (): string => {
  return `modal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

export const createSingletonModalHook = <P extends object>(
  ModalComponent: ComponentType<P & ModalControlProps>,
  options?: {
    closeDelayMs?: number;
  },
): (() => ModalHookApi<P>) => {
  const activeModals = new Map<string, ActiveModal<P>>();
  const closeDelayMs = options?.closeDelayMs ?? DEFAULT_CLOSE_DELAY;

  const destroy = (id: string): void => {
    const item = activeModals.get(id);
    if (!item) {
      return;
    }

    if (item.timer) {
      clearTimeout(item.timer);
    }
    item.sibling.destroy();
    activeModals.delete(id);
  };

  const render = (id: string): ReactNode => {
    const item = activeModals.get(id);
    if (!item) {
      return null;
    }

    return (
      <ModalComponent
        {...item.props}
        isVisible={item.visible}
        onClose={() => {
          close(id);
        }}
      />
    );
  };

  const close = (id: string): void => {
    const item = activeModals.get(id);
    if (!item?.visible) {
      return;
    }

    item.visible = false;
    item.sibling.update(render(id));
    item.timer = setTimeout(() => {
      destroy(id);
    }, closeDelayMs);
  };

  const closeAll = (): void => {
    activeModals.forEach((_, id) => {
      close(id);
    });
  };

  const open = (props: P): string => {
    const id = createModalId();
    const sibling = new RootSiblings(null) as unknown as RootSiblingLike;

    activeModals.set(id, {
      id,
      props,
      visible: true,
      sibling,
      timer: null,
    });

    sibling.update(render(id));
    return id;
  };

  return function useSingletonModal(): ModalHookApi<P> {
    return useMemo(
      () => ({
        open,
        opne: open,
        close,
        closeAll,
        destroy,
      }),
      [],
    );
  };
};

export default createSingletonModalHook;
