import { type ReactNode } from 'react'

interface KbdProps {
  children: ReactNode
}

export function Kbd({ children }: KbdProps) {
  return (
    <kbd
      className="inline-flex items-center justify-center min-w-[1.75rem] h-[1.625rem] px-2 py-0.5 text-xs font-semibold rounded
                 bg-shironeri dark:bg-kogecha
                 text-sumi dark:text-kinari
                 border-[1.5px] border-ginnezu dark:border-kincha/60
                 shadow-[0_2px_0_0_rgba(0,0,0,0.08)] dark:shadow-[0_2px_0_0_rgba(199,128,45,0.2)]"
      style={{
        fontFamily: 'var(--font-mincho)',
        letterSpacing: '0.02em'
      }}
    >
      {children}
    </kbd>
  )
}