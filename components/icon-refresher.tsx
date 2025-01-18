'use client'

import { useEffect } from 'react'

export default function IconRefresher() {
  useEffect(() => {
    // Force favicon refresh
    const link: HTMLLinkElement = document.querySelector("link[rel~='icon']")!;
    if (link) {
      link.href = '/newicon.png?v=' + new Date().getTime();
    }
  }, [])

  return null
}

