import type { Speaker } from '../speaker-list/types';

/**
 * Stable id for whoever currently has speaking=true (main slot or a reply).
 * Changes when the meeting advances to another speaker or reply.
 */
export function getActiveSpeakingSessionId(speakers: Speaker[]): string | null {
  for (let i = 0; i < speakers.length; i++) {
    const s = speakers[i];
    if (s.speaking) {
      return `main-${i}-${s.number}`;
    }
    const replies = s.replies ?? [];
    for (let j = 0; j < replies.length; j++) {
      if (replies[j].speaking) {
        return `reply-${i}-${j}-${replies[j].number}`;
      }
    }
  }
  return null;
}
