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
        <div className={styles.links}>
          <a
            href="/privacy-policy"
            target="_blank"
            className={styles.privacyLink}
          >
            Политика конфиденциальности
          </a>
          <a
            href="/user-agreement"
            target="_blank"
            className={styles.privacyLink}
          >
            Пользовательское соглашение
          </a>
        </div>
      </div>
    </footer>
  )
}
