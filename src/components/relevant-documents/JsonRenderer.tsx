import React from "react";

export default function JsonRenderer({ data }: { data: any }) {
  const renderValue = (val: any): React.ReactNode => {
    if (Array.isArray(val)) {
      return (
        <ul className="ml-4 list-disc space-y-1 mt-1">
          {val.map((item, i) => (
            <li key={i}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof val === "object" && val !== null) {
      return (
        <div className="flex flex-col gap-1 ml-2 border-l border-primary/10 pl-2 mt-1">
          {Object.entries(val).map(([k, v]) => (
            <div key={k}>
              <span className="font-bold text-xs uppercase opacity-70">
                {k.replace(/_/g, " ")}:
              </span>{" "}
              <span className="text-sm">{renderValue(v)}</span>
            </div>
          ))}
        </div>
      );
    }
    return String(val);
  };

  const items = Array.isArray(data) ? data : [data];

  return (
    <div className="flex flex-col gap-4 w-full">
      {items.map((item, i) => (
        <div
          key={i}
          className="p-3 rounded-lg border border-primary/5 bg-primary/[0.02] flex flex-col gap-1.5"
        >
          {typeof item === "object" && item !== null ? (
            Object.entries(item).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary/60">
                  {key.replace(/_/g, " ")}
                </span>
                <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {renderValue(value)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm">{String(item)}</div>
          )}
        </div>
      ))}
    </div>
  );
}
