import { FC } from 'react';

interface StopwatchProps {
  delay?: number;
  activeSessionId?: string | null;
}

export const Stopwatch: FC<StopwatchProps>;
