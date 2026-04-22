import React from 'react'

import styles from '@/components/ui/ContactButton/ContactButton.module.scss'

interface ContactButtonProps {
  href: string
  title: string
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  href,
  title,
}) => {
  return (
    <a href={href} className={styles.contactBtn}>
      <div className={styles.iconWrapper}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.6 3.6L2.4 11.1C1.1 11.6 1.1 12.3 2.2 12.6L7.1 14.1L18.5 7.1C19 6.8 19.5 6.9 19.1 7.3L9.9 15.5L9.8 15.6L9.5 19.8C9.8 19.8 10 19.7 10.1 19.5L12.5 17.2L17.4 20.8C18.3 21.3 19 21.1 19.2 20L22.4 4.8C22.7 3.5 21.9 3 21.6 3.6Z"
            fill="#0088cc"
          />
        </svg>
      </div>
      <span>{title}</span>
    </a>
  )
}
