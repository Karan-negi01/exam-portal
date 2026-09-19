// Skorex mark: a checkmark whose long arm resolves into a rising trend-line
// ending in a data point — "certified" (check) + "score going up" in one stroke.
export function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skorexMarkGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6d4cf0" />
          <stop offset="100%" stopColor="#ff6a3d" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#skorexMarkGrad)" />
      <path
        d="M11 20.5L16.2 25.8L22 18.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.5 20L25.5 14.5L30.5 17.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <circle cx="30.5" cy="12.8" r="2.4" fill="white" />
    </svg>
  );
}

export default function Logo({ size = 36, wordmarkClassName, showWordmark = true }) {
  return (
    <>
      <LogoMark size={size} />
      {showWordmark && <span className={wordmarkClassName}>Skorex</span>}
    </>
  );
}
