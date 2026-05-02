import React from 'react'

import { Phone, Send } from 'lucide-react'

import styles from '../Chat.module.scss'

interface ContactBlockProps {
  reason: string
  onScrollToContacts?: () => void
}

export const ContactBlock: React.FC<ContactBlockProps> = ({
  reason,
  onScrollToContacts,
}) => (
  <div className={styles.contactBlock}>
    <p className={styles.blockReason}>{reason}</p>
    <div className={styles.contacts}>
      {onScrollToContacts && (
        <button
          className={`${styles.contactBtn} ${styles.primary}`}
          onClick={onScrollToContacts}
        >
          <Phone size={16} /> Перейти к контактам
        </button>
      )}
      <a
        href="https://t.me/breathing_expert"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.contactBtn} ${styles.telegram}`}
      >
        <Send size={16} /> Написать в Telegram
      </a>
    </div>
  </div>
)
