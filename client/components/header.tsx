"use client"

import { useEffect, useState } from 'react'

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const saved = window.localStorage.getItem('theme')
    const initial = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark'
      : 'light'
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    window.localStorage.setItem('theme', next)
  }

  return (
    <header className="border-b border-border p-4 bg-background text-foreground flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">EventHub</h1>
      </div>
      <button
        onClick={toggleTheme}
        className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
      >
        {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
      </button>
    </header>
  )
}
