'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { X } from 'lucide-react'

import { useScrollTo } from '@/hooks/useScrollTo'

import styles from './MobileMenu.module.scss'

interface Link {
  href: string
  label: string
}

interface MobileMenuProps {
  links: Link[]
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false)
  const scrollTo = useScrollTo()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    closeMenu()

    setTimeout(() => {
      scrollTo(href)
    }, 300)
  }

  if (!mounted) return null

  return (
    <>
      <button
        className={`${styles.menuToggle} ${isOpen ? styles.active : ''}`}
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </button>

      {createPortal(
        <div className={`${styles.mobileMenu} ${isOpen ? styles.active : ''}`}>
          <button
            className={styles.closeButton}
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={32} color="#333" />
          </button>
          <nav className={styles.navMobile}>
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
        </div>,
        document.body
      )}
    </>
  )
}
