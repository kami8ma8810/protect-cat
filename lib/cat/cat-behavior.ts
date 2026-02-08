import type { CatState, StateConfig } from '@/types/cat';

/**
 * FSM状態設定
 * 各状態の持続時間と遷移確率を定義
 */
const STATE_CONFIGS: Record<CatState, StateConfig> = {
  idle: {
    duration: { min: 2000, max: 5000 },
    frameCount: 4,
    transitions: [
      { to: 'walking', probability: 0.5 },
      { to: 'sitting', probability: 0.3 },
      { to: 'sleeping', probability: 0.15 },
      { to: 'turning', probability: 0.05 },
    ],
  },
  walking: {
    duration: { min: 3000, max: 8000 },
    frameCount: 8,
    transitions: [
      { to: 'idle', probability: 0.4 },
      { to: 'turning', probability: 0.3 },
      { to: 'sitting', probability: 0.2 },
      { to: 'sleeping', probability: 0.1 },
    ],
  },
  sitting: {
    duration: { min: 3000, max: 10000 },
    frameCount: 6,
    transitions: [
      { to: 'idle', probability: 0.5 },
      { to: 'walking', probability: 0.3 },
      { to: 'sleeping', probability: 0.2 },
    ],
  },
  sleeping: {
    duration: { min: 10000, max: 30000 },
    frameCount: 4,
    transitions: [
      { to: 'idle', probability: 0.7 },
      { to: 'sitting', probability: 0.2 },
      { to: 'walking', probability: 0.1 },
    ],
  },
  turning: {
    duration: { min: 500, max: 800 },
    frameCount: 2,
    transitions: [
      { to: 'walking', probability: 0.9 },
      { to: 'idle', probability: 0.1 },
    ],
  },
};

/**
 * 現在の状態から確率的に次の状態を決定する
 */
function getNextState(currentState: CatState): CatState {
  const config = STATE_CONFIGS[currentState];
  const roll = Math.random();
  let cumulative = 0;

  for (const transition of config.transitions) {
    cumulative += transition.probability;
    if (roll < cumulative) {
      return transition.to;
    }
  }

  // フォールバック（浮動小数点誤差対策）
  return config.transitions[config.transitions.length - 1]!.to;
}

/**
 * 指定状態のランダムな持続時間（ミリ秒）を返す
 */
function getStateDuration(state: CatState): number {
  const config = STATE_CONFIGS[state];
  const { min, max } = config.duration;
  return min + Math.random() * (max - min);
}

export { STATE_CONFIGS, getNextState, getStateDuration };
