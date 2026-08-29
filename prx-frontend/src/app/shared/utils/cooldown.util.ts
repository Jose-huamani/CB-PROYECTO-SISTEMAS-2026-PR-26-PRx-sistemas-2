import { DestroyRef, signal } from '@angular/core';

export interface CooldownController {
  readonly value: () => number;
  readonly isActive: () => boolean;
  start: (seconds: number) => void;
  reset: () => void;
}

export function createCooldown(destroyRef: DestroyRef, storageKey?: string): CooldownController {
  const cooldown = signal(0);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const clear = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const loadFromStorage = () => {
    if (!storageKey) return;

    const stored = localStorage.getItem(storageKey);
    if (!stored) return;

    const expiresAt = Number(stored);
    const remaining = Math.floor((expiresAt - Date.now()) / 1000);

    if (remaining > 0) {
      start(remaining, false);
    } else {
      localStorage.removeItem(storageKey);
    }
  };

  destroyRef.onDestroy(() => {
    clear();
  });

  const start = (seconds: number, persist = true) => {
    clear();

    cooldown.set(seconds);

    if (persist && storageKey) {
      const expiresAt = Date.now() + seconds * 1000;
      localStorage.setItem(storageKey, String(expiresAt));
    }

    intervalId = setInterval(() => {
      const current = cooldown();

      if (current <= 1) {
        cooldown.set(0);
        clear();

        if (storageKey) {
          localStorage.removeItem(storageKey);
        }

        return;
      }

      cooldown.set(current - 1);
    }, 1000);
  };

  const reset = () => {
    clear();
    cooldown.set(0);

    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  loadFromStorage();

  return {
    value: () => cooldown(),
    isActive: () => cooldown() > 0,
    start,
    reset,
  };
}
