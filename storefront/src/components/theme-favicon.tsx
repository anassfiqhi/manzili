'use client'

import { useEffect } from 'react'

export default function ThemeFavicon() {
  useEffect(() => {
    function updateFavicon() {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      
      if (favicon) {
        favicon.href = isDark ? '/sweethome-white.ico' : '/sweethome-black.ico'
      }
    }

    // Update on mount
    updateFavicon()

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateFavicon)

    return () => {
      mediaQuery.removeEventListener('change', updateFavicon)
    }
  }, [])

  return null
}