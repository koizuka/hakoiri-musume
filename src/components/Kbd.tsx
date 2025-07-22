import { type ReactNode } from 'react'

interface KbdProps {
  children: ReactNode
}

export function Kbd({ children }: KbdProps) {
  return (
    <kbd className="inline-flex items-center justify-center px-2 py-1 min-w-[2rem] h-7 font-mono text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-[0_2px_0_0_rgba(0,0,0,0.1)] dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:shadow-[0_2px_0_0_rgba(255,255,255,0.1)]">
      {children}
    </kbd>
  )
}