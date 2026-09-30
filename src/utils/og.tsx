import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };

export function renderOg(title: string, eyebrow: string) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: '#f8f9fc',
        color: '#161a2b',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', fontSize: 28, color: '#5b6274' }}>{eyebrow}</div>
      <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28 }}>
        <div style={{ width: 14, height: 14, borderRadius: 14, border: '3px solid #3b55d9' }} />
        Oussama Labrahmi
      </div>
    </div>,
    ogSize,
  );
}
