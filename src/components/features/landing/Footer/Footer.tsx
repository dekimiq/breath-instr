import React from 'react'

import styles from '@/components/features/landing/Footer/Footer.module.scss'

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p>
          &copy; {new Date().getFullYear()} Breathing Instructor. All rights
          reserved.
        </p>
        <a
          href="/privacy-policy"
          target="_blank"
          className={styles.privacyLink}
        >
          Политика конфиденциальности
        </a>
      </div>
    </footer>
  )
}
