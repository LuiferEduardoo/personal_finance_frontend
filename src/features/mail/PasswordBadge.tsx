/** La contraseña del PDF es de solo escritura: solo se sabe si hay una guardada. */
export function PasswordBadge() {
  return (
    <span className="bg-surface-sunken text-ink-secondary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-3.5"
      >
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
      Contraseña configurada
    </span>
  )
}
