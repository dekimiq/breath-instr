'use client'

import React from 'react'

import Link from 'next/link'

import ButtonCta from '@/components/ui/ButtonCta/ButtonCta'

import { useScrollTo } from '@/hooks/useScrollTo'

import { NAV_LINKS } from './constants'
import styles from './Header.module.scss'
import { MobileMenu } from './MobileMenu'
import { Navigation } from './Navigation'

export const Header: React.FC = () => {
  const scrollTo = useScrollTo()

  return (
    <header className={styles.header}>
      <div className={styles.glassContainer}>
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logo}>
            <span>Дыхание - жизнь</span>
          </Link>
        </div>

        <Navigation links={NAV_LINKS} />

        <div className={styles.ctaWrapper}>
          <ButtonCta
            href="#contacts"
            className={styles.headerBtn}
            onClick={(e) => {
              e.preventDefault()
              scrollTo('contacts')
            }}
          >
            Записаться
          </ButtonCta>
        </div>

        <MobileMenu links={NAV_LINKS} />
      </div>
    </header>
  )
}
