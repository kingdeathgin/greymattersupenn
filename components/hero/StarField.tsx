/** Fixed positions keep the sky stable across server and client renders. */
export function StarField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 144 }, (_, index) => {
        const left = 3 + ((index * 37.7) % 94);
        const top = 5 + ((index * 23.3) % 89);
        const sparkle = index % 6 === 0;
        const size = sparkle ? 12 + (index % 3) * 4 : 1.5 + (index % 3) * 0.7;
        return (
          <svg
            key={index}
            viewBox="0 0 20 20"
            fill="currentColor"
            className="absolute"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, color: index % 4 === 0 ? "#FF85B7" : "#ffffff", opacity: 0.3 + (index % 5) * 0.14 }}
          >
            {sparkle ? <path d="M10 0 12 8 20 10 12 12 10 20 8 12 0 10 8 8Z" /> : <circle cx="10" cy="10" r="9" />}
          </svg>
        );
      })}
    </div>
  );
}
