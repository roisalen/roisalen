import { describe, it, expect } from 'vitest';
import { getActiveSpeakingSessionId } from './speakingSession';
import type { Speaker } from '../speaker-list/types';

describe('getActiveSpeakingSessionId', () => {
  it('returns null when nobody is speaking', () => {
    const list: Speaker[] = [
      {
        id: 1,
        name: 'A',
        number: '1',
        group: 'G',
        speaking: false,
      },
    ];
    expect(getActiveSpeakingSessionId(list)).toBeNull();
  });

  it('returns id for main speaker', () => {
    const list: Speaker[] = [
      {
        id: 1,
        name: 'A',
        number: '42',
        group: 'G',
        speaking: true,
      },
    ];
    expect(getActiveSpeakingSessionId(list)).toBe('main-0-42');
  });

  it('returns id for speaking reply', () => {
    const list: Speaker[] = [
      {
        id: 1,
        name: 'A',
        number: '1',
        group: 'G',
        speaking: false,
        replies: [
          {
            number: '2',
            name: 'B',
            group: 'G',
            speaking: false,
          },
          {
            number: '3',
            name: 'C',
            group: 'G',
            speaking: true,
          },
        ],
      },
    ];
    expect(getActiveSpeakingSessionId(list)).toBe('reply-0-1-3');
  });
});
