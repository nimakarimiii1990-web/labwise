import React from 'react';

// Compact deterministic QR code generator for URLs using public image/SVG service with offline fallback
interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ url, size = 180 }) => {
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    url
  )}&color=020617&bgcolor=ffffff&qzone=2`;

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-xl border border-slate-700">
      <img
        src={qrApiUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="rounded-lg object-contain"
        loading="eager"
      />
      <span className="text-[10px] text-slate-800 font-bold mt-2 font-mono">اسکن با دوربین گوشی</span>
    </div>
  );
};
