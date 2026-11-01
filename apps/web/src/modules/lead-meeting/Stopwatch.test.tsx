import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Stopwatch } from './Stopwatch';

describe('Stopwatch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('auto-starts when activeSessionId becomes non-null', () => {
    const { rerender } = render(
      <Stopwatch delay={1000} activeSessionId={null} />
    );
    expect(screen.getByText(/^0 m 0 s$/)).toBeInTheDocument();

    rerender(<Stopwatch delay={1000} activeSessionId="speaker-a" />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText(/^0 m 2 s$/)).toBeInTheDocument();
  });

  it('resets and restarts when activeSessionId changes', () => {
    const { rerender } = render(
      <Stopwatch delay={1000} activeSessionId="speaker-a" />
    );
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText(/^0 m 5 s$/)).toBeInTheDocument();

    rerender(<Stopwatch delay={1000} activeSessionId="speaker-b" />);
    expect(screen.getByText(/^0 m 0 s$/)).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText(/^0 m 1 s$/)).toBeInTheDocument();
  });

  it('stops when activeSessionId becomes null', () => {
    const { rerender } = render(
      <Stopwatch delay={1000} activeSessionId="speaker-a" />
    );
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText(/^0 m 3 s$/)).toBeInTheDocument();

    rerender(<Stopwatch delay={1000} activeSessionId={null} />);
    expect(screen.getByText(/^0 m 0 s$/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText(/^0 m 0 s$/)).toBeInTheDocument();
  });
});
