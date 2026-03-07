/**
 * Animated number component with optional change highlight effect.
 */
import CountUp from 'react-countup';
import { useEffect, useRef, useState } from 'react';

export interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  highlightOnChange?: boolean;
}

export function AnimatedNumber(props: AnimatedNumberProps): JSX.Element {
  const {
    value,
    decimals = 0,
    prefix = '',
    suffix = '',
    duration = 0.8,
    className,
    highlightOnChange = true,
  } = props;

  const previousValueRef = useRef<number>(value);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (!highlightOnChange || previousValueRef.current === value) {
      previousValueRef.current = value;
      return;
    }

    setIsHighlighted(true);
    const timer = window.setTimeout(() => setIsHighlighted(false), 900);
    previousValueRef.current = value;

    return () => window.clearTimeout(timer);
  }, [highlightOnChange, value]);

  return (
    <span
      className={`rounded px-1 transition-colors duration-700 ${
        isHighlighted ? 'bg-amber-200/80' : 'bg-transparent'
      } ${className ?? ''}`}
    >
      <CountUp
        end={value}
        duration={duration}
        decimals={decimals}
        separator=","
        prefix={prefix}
        suffix={suffix}
      />
    </span>
  );
}
