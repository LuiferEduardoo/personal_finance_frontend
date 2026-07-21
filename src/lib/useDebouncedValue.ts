import { useEffect, useState } from 'react'

/**
 * Devuelve `value` con un retardo: solo se actualiza cuando deja de cambiar
 * durante `delay` ms. Evita disparar una búsqueda por cada tecla.
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
