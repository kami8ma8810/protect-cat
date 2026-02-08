import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  STATE_CONFIGS,
  getNextState,
  getStateDuration,
} from '@/lib/cat/cat-behavior';
import type { CatState } from '@/types/cat';

describe('cat-behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('STATE_CONFIGS', () => {
    it('5つの状態が定義されている', () => {
      const states: CatState[] = [
        'idle',
        'walking',
        'sitting',
        'sleeping',
        'turning',
      ];
      states.forEach((state) => {
        expect(STATE_CONFIGS[state]).toBeDefined();
      });
    });

    it('各状態の遷移確率の合計が1になる', () => {
      const states = Object.keys(STATE_CONFIGS) as CatState[];
      states.forEach((state) => {
        const total = STATE_CONFIGS[state].transitions.reduce(
          (sum, t) => sum + t.probability,
          0
        );
        expect(total).toBeCloseTo(1, 2);
      });
    });

    it('turningの持続時間が最も短い', () => {
      expect(STATE_CONFIGS.turning.duration.max).toBeLessThan(
        STATE_CONFIGS.idle.duration.min
      );
    });

    it('sleepingの持続時間が最も長い', () => {
      expect(STATE_CONFIGS.sleeping.duration.max).toBeGreaterThan(
        STATE_CONFIGS.walking.duration.max
      );
    });
  });

  describe('getNextState', () => {
    it('idleからの遷移先が有効な状態を返す', () => {
      const validTargets = STATE_CONFIGS.idle.transitions.map((t) => t.to);
      const next = getNextState('idle');
      expect(validTargets).toContain(next);
    });

    it('walkingからの遷移先が有効な状態を返す', () => {
      const validTargets = STATE_CONFIGS.walking.transitions.map((t) => t.to);
      const next = getNextState('walking');
      expect(validTargets).toContain(next);
    });

    it('Math.randomが0の場合、最初の遷移先を返す', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const next = getNextState('idle');
      expect(next).toBe(STATE_CONFIGS.idle.transitions[0]!.to);
    });

    it('Math.randomが0.999の場合、最後の遷移先を返す', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999);
      const next = getNextState('idle');
      const lastTransition =
        STATE_CONFIGS.idle.transitions[
          STATE_CONFIGS.idle.transitions.length - 1
        ]!;
      expect(next).toBe(lastTransition.to);
    });
  });

  describe('getStateDuration', () => {
    it('各状態の持続時間が範囲内に収まる', () => {
      const states = Object.keys(STATE_CONFIGS) as CatState[];
      states.forEach((state) => {
        const config = STATE_CONFIGS[state];
        for (let i = 0; i < 20; i++) {
          const duration = getStateDuration(state);
          expect(duration).toBeGreaterThanOrEqual(config.duration.min);
          expect(duration).toBeLessThanOrEqual(config.duration.max);
        }
      });
    });
  });
});
