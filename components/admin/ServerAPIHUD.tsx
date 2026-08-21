import type { ServerStatus } from "@/lib/server-status";

export function ServerAPIHUD({ status }: { status: ServerStatus | null }) {
  const label = status ? (status.online ? "Online" : "Offline") : "Unreachable";
  const color = status?.online ? "var(--mc-success)" : "var(--mc-danger)";

  return (
    <div className="mc-panel pixel-corners-sm px-4 py-2.5 max-w-3xl mx-auto mb-4 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0">
          {status?.online && (
            <span
              className="absolute inline-flex h-full w-full animate-ping opacity-75"
              style={{ backgroundColor: color }}
            />
          )}
          <span
            className="relative inline-flex h-2 w-2"
            style={{ backgroundColor: color }}
          />
        </span>
        <span
          className="font-mc-sub text-[11px] tracking-widest uppercase"
          style={{ color }}
        >
          Riftscape API // {label}
        </span>
      </div>

      {status && (
        <div className="flex items-center gap-4 font-mc-body uppercase text-xs text-foreground/60">
          {status.service && <span className="truncate">{status.service}</span>}
          {typeof status.port === "number" && (
            <span>
              Port{" "}
              <span className="mc-chip inline-flex items-center justify-center min-w-[2.25rem] text-[10px] pixel-raised pixel-corners-sm font-mc-sub text-foreground px-2 py-1 shrink-0">
                {status.port}
              </span>
            </span>
          )}
          <span className="flex items-center gap-1 truncate">
            <span className="mc-chip inline-flex items-center justify-center min-w-[2.25rem] text-[10px] pixel-raised pixel-corners-sm font-mc-sub text-foreground px-2 py-1 shrink-0">
              {status.players.toLocaleString()}
            </span>{" "}
            online
          </span>
        </div>
      )}
    </div>
  );
}
