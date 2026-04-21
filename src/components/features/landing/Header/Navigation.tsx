'use client'

import React from 'react'

import { SCROLL_OFFSET } from './constants'
import styles from './Navigation.module.scss'

interface Link {
  href: string
  label: string
}

interface NavigationProps {
  links: Link[]
}

export const Navigation: React.FC<NavigationProps> = ({ links }) => {
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)

    if (element) {
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - SCROLL_OFFSET

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <nav className={styles.navDesktop}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={(e) => handleScroll(e, link.href)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
