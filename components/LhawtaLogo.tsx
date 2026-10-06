import React from "react";

type Props = {
  compact?: boolean;
  light?: boolean;
  className?: string;
};

export default function LhawtaLogo({ compact=false, light=false, className="" }: Props) {
  const ink = light ? "#ffffff" : "#0b0f16";

  return (
    <span className={["lhawta-logo", compact ? "lhawta-logo-compact" : "", className].filter(Boolean).join(" ")} aria-label="Lhawta">
      <svg className="lhawta-mark" viewBox="0 0 72 72" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="lhawtaBlue" x1="5" y1="4" x2="58" y2="66" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00B8FF"/>
            <stop offset=".48" stopColor="#006CFF"/>
            <stop offset="1" stopColor="#1238D8"/>
          </linearGradient>
          <linearGradient id="lhawtaDeep" x1="27" y1="8" x2="54" y2="55" gradientUnits="userSpaceOnUse">
            <stop stopColor="#161C27"/>
            <stop offset="1" stopColor="#05070B"/>
          </linearGradient>
        </defs>
        <path d="M12 12c0-3.3 2.7-6 6-6h12v39c0 4.4 3.6 8 8 8h26v12H31c-10.5 0-19-8.5-19-19V12Z" fill="url(#lhawtaBlue)"/>
        <path d="M31 17 43 24.5c3 1.9 4.8 5.2 4.8 8.7V47H40c-5 0-9-4-9-9V17Z" fill="url(#lhawtaDeep)"/>
        <path d="M27 48c3.7 7.4 9.2 11.2 16.4 11.2H64V53H38c-4.6 0-8.6-1.8-11-5Z" fill="#071325" opacity=".78"/>
      </svg>
      {!compact && (
        <span className="lhawta-wordmark" style={{color:ink}}>
          LHAWTA
        </span>
      )}
    </span>
  );
}
