// شعار الأمل والنور — شمس مشرقة فوق أمواج (إعادة رسم متجهي مستوحى من الشعار الأصلي)

export default function Logo({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  return (
    <svg
      viewBox="0 0 240 168"
      className={className}
      role="img"
      aria-label="شعار الأمل والنور"
    >
      <defs>
        <linearGradient id="alnoorSun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC93C" />
          <stop offset="0.55" stopColor="#F79A22" />
          <stop offset="1" stopColor="#F1831C" />
        </linearGradient>
      </defs>

      {/* أشعة الشمس */}
      <g fill="#F89C22">
        {rays.map((a) => (
          <polygon
            key={a}
            points="120,8 114,38 126,38"
            transform={`rotate(${a} 120 70)`}
          />
        ))}
      </g>

      {/* قرص الشمس */}
      <circle cx="120" cy="70" r="34" fill="url(#alnoorSun)" />

      {/* الأمواج */}
      <path
        d="M16,98 C56,82 86,114 120,98 C154,82 184,114 224,98 L224,112 C184,128 154,96 120,112 C86,128 56,96 16,112 Z"
        fill="#6BA6E0"
      />
      <path
        d="M16,112 C56,96 86,128 120,112 C154,96 184,128 224,112 L224,128 C184,144 154,112 120,128 C86,144 56,112 16,128 Z"
        fill="#2E6DB4"
      />
      <path
        d="M16,126 C56,110 86,142 120,126 C154,110 184,142 224,126 L224,142 C184,158 154,126 120,142 C86,158 56,126 16,142 Z"
        fill="#1C3F63"
      />
    </svg>
  );
}
