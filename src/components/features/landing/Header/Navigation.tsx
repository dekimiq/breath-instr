'use client'

import React from 'react'

import styles from '@/components/features/landing/Header/Navigation.module.scss'

import { useScrollTo } from '@/hooks/useScrollTo'

interface Link {
  href: string
  label: string
}

interface NavigationProps {
  links: Link[]
}

export const Navigation: React.FC<NavigationProps> = ({ links }) => {
  const scrollTo = useScrollTo()

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    scrollTo(href)
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
