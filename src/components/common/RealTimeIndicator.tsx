/**
 * Realtime connection status indicator.
 */

export interface RealTimeIndicatorProps {
  text?: string;
  connected?: boolean;
}

export function RealTimeIndicator(props: RealTimeIndicatorProps): JSX.Element {
  const { text = '实时连接中', connected = true } = props;

  return (
    <div className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs text-white shadow-sm">
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-rose-500'}`}>
        {connected ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" /> : null}
      </span>
      <span>{text}</span>
    </div>
  );
}
