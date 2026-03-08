/**
 * Realtime connection status indicator.
 */

export interface RealTimeIndicatorProps {
  text?: string;
  connected?: boolean;
  compact?: boolean;
}

export function RealTimeIndicator(props: RealTimeIndicatorProps): JSX.Element {
  const { text = '实时连接中', connected = true, compact = false } = props;

  return (
    <div
      className={
        compact
          ? 'flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-slate-950 px-3 py-1.5 text-[11px] font-medium text-white shadow-[0_12px_24px_rgba(15,23,42,0.14)]'
          : 'flex items-center gap-2 rounded-full border border-slate-200/60 bg-slate-950 px-4 py-2 text-xs font-medium text-white shadow-[0_18px_34px_rgba(15,23,42,0.18)]'
      }
    >
      <span className={`relative inline-flex ${compact ? 'h-2 w-2' : 'h-2.5 w-2.5'} rounded-full ${connected ? 'bg-emerald-400' : 'bg-rose-500'}`}>
        {connected ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" /> : null}
      </span>
      <span>{text}</span>
    </div>
  );
}
