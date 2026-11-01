import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from 'react-bootstrap';

interface StopwatchProps {
  delay?: number;
  /**
   * When provided, the timer resets whenever this value changes.
   * Runs while non-null; stops and shows 0 when null.
   */
  activeSessionId?: string | null;
}

export const Stopwatch: React.FC<StopwatchProps> = ({
  delay = 1000,
  activeSessionId,
}) => {
  const [clock, setClock] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const offsetRef = useRef<number>(0);

  const update = useCallback(() => {
    const now = Date.now();
    const delta = now - offsetRef.current;
    offsetRef.current = now;
    setClock((prevClock) => prevClock + delta);
  }, []);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const start = () => {
    if (!intervalRef.current) {
      offsetRef.current = Date.now();
      intervalRef.current = setInterval(update, delay);
      setIsRunning(true);
    }
  };

  const stop = () => {
    stopInterval();
  };

  const reset = () => {
    stopInterval();
    setClock(0);
  };

  useEffect(() => {
    if (activeSessionId === undefined) {
      return;
    }

    stopInterval();
    setClock(0);

    if (activeSessionId === null) {
      return;
    }

    offsetRef.current = Date.now();
    intervalRef.current = setInterval(update, delay);
    setIsRunning(true);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeSessionId, delay, stopInterval, update]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins} m ${secs} s`;
  };

  const autoMode = activeSessionId !== undefined;

  return (
    <div className="stopwatch">
      <span className="time">{formatTime(clock)}</span>
      {!autoMode && (
        <>
          {!isRunning ? (
            <Button
              variant="link"
              onClick={start}
              className="control-button"
            >
              <span className="glyphicon glyphicon-play"></span>
            </Button>
          ) : (
            <Button
              variant="link"
              onClick={stop}
              className="control-button"
            >
              <span className="glyphicon glyphicon-stop"></span>
            </Button>
          )}
          <Button
            variant="link"
            onClick={reset}
            className="control-button"
          >
            <span className="glyphicon glyphicon-repeat"></span>
          </Button>
        </>
      )}
    </div>
  );
};
