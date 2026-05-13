import React from 'react'
import ReactMarkdown from 'react-markdown'

import remarkGfm from 'remark-gfm'

import styles from '../Chat.module.scss'
import { Message } from '../types'

interface ChatMessageProps {
  message: Message
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isTyping = message.role === 'assistant' && !message.content

  return (
    <div
      className={`${styles.message} ${styles[message.role]}`}
      aria-live={isTyping ? 'polite' : 'off'}
      aria-label={isTyping ? 'Думаю' : undefined}
    >
      <div className={styles.messageContent}>
        {isTyping ? (
          <div className={styles.typing}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : message.role === 'assistant' ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        ) : (
          message.content
        )}
      </div>
    </div>
  )
}
