/**
 * Simulates websocket stream and updates component metrics every 3 seconds.
 */
import { useEffect } from 'react';
import { useComponentStore } from '@/stores/componentStore';

interface UseMockWebSocketProps {
  enabled?: boolean;
}

function randomDelta(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function useMockWebSocket(props: UseMockWebSocketProps = {}): void {
  const { enabled = true } = props;
  const components = useComponentStore((state) => state.components);
  const patchComponent = useComponentStore((state) => state.patchComponent);

  useEffect(() => {
    if (!enabled || components.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * components.length);
      const target = components[randomIndex];
      if (!target) {
        return;
      }

      patchComponent(target.componentId, {
        todayCalls: target.todayCalls + randomDelta(50, 300),
        healthScore: clamp(target.healthScore + randomDelta(-2, 2), 60, 100),
        successRate: clamp(Number((target.successRate + randomDelta(-3, 3) / 10).toFixed(1)), 70, 100),
      });
    }, 3000);

    return () => window.clearInterval(timer);
  }, [components, enabled, patchComponent]);
}
