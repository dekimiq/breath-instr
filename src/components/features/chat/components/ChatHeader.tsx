import React from 'react'

import { X } from 'lucide-react'

import styles from '../Chat.module.scss'
import { Limits } from '../types'

interface ChatHeaderProps {
  limits: Limits | null
  isBlocked: boolean
  serviceUnavailable: boolean
  onClose: () => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  limits,
  isBlocked,
  serviceUnavailable,
  onClose,
}) => {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.headerInfo}>
        <h3>Ассистент</h3>
        {limits && !isBlocked && !serviceUnavailable && (
          <span
            className={`${styles.limitCounter} ${limits.remaining <= 1 ? styles.warning : ''}`}
          >
            Осталось вопросов: {limits.remaining}
          </span>
        )}
      </div>
      <button
        onClick={onClose}
        className={styles.closeBtn}
        aria-label="Закрыть чат"
      >
        <X size={20} />
      </button>
    </div>
  )
}
