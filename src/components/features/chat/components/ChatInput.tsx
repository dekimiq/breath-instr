import React from 'react'

import { Send, AlertCircle } from 'lucide-react'

import styles from '../Chat.module.scss'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isLoading: boolean
  isBlocked: boolean
  serviceUnavailable: boolean
  validationError: string | null
  maxChars: number
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
  isBlocked,
  serviceUnavailable,
  validationError,
  maxChars,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className={styles.chatInputWrapper}>
      {validationError && (
        <div className={styles.validationError}>
          <AlertCircle size={14} />
          {validationError}
        </div>
      )}
      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder={isBlocked ? 'Чат ограничен' : 'Ваш вопрос...'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading || isBlocked || serviceUnavailable}
          maxLength={maxChars}
        />
        <button
          className={styles.sendBtn}
          onClick={onSend}
          disabled={
            isLoading || !value.trim() || isBlocked || serviceUnavailable
          }
          aria-label="Отправить"
        >
          <Send size={18} />
        </button>
      </div>
      <div
        style={{
          fontSize: '10px',
          textAlign: 'right',
          marginTop: '4px',
          opacity: 0.5,
        }}
      >
        {value.length} / {maxChars}
      </div>
    </div>
  )
}
