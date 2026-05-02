'use client'

import React, { useState, useRef, useEffect } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'

import { useScrollTo } from '@/hooks/useScrollTo'

import styles from './Chat.module.scss'
import { ChatHeader } from './components/ChatHeader'
import { ChatInput } from './components/ChatInput'
import { ChatMessage } from './components/ChatMessage'
import { ContactBlock } from './components/ContactBlock'
import { useChat } from './hooks/useChat'

const Chat: React.FC = () => {
  const scrollTo = useScrollTo()
  const [isOpen, setIsOpen] = useState(false)
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    limits,
    isBlocked,
    validationError,
    blockReason,
    serviceUnavailable,
    sendMessage,
    MAX_CHARS,
  } = useChat(isOpen)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  const toggleChat = () => setIsOpen(!isOpen)

  const scrollToContacts = () => {
    setIsOpen(false)
    scrollTo('contacts')
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isBlocked, serviceUnavailable, isOpen, isLoading])

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true)
    window.addEventListener('open-chat', handleOpenChat)
    return () => window.removeEventListener('open-chat', handleOpenChat)
  }, [])

  return (
    <div className={styles.chatWidget}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onWheel={(e) => e.stopPropagation()}
          >
            <ChatHeader
              limits={limits}
              isBlocked={isBlocked}
              serviceUnavailable={serviceUnavailable}
              onClose={toggleChat}
            />

            <div
              className={styles.chatMessages}
              onWheel={(e) => e.stopPropagation()}
            >
              {messages.length === 0 && !isBlocked && !serviceUnavailable && (
                <div className={styles.emptyState}>
                  <p>
                    Привет! Я помогу тебе разобраться в дыхании. Задай свой
                    вопрос!
                  </p>
                </div>
              )}

              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}

              {isLoading && !messages[messages.length - 1]?.content && (
                <div className={`${styles.message} ${styles.assistant}`}>
                  <div className={styles.typing}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              {(isBlocked || serviceUnavailable) && blockReason && (
                <div className={`${styles.message} ${styles.system}`}>
                  <ContactBlock
                    reason={blockReason}
                    onScrollToContacts={scrollToContacts}
                  />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={sendMessage}
              isLoading={isLoading}
              isBlocked={isBlocked}
              serviceUnavailable={serviceUnavailable}
              validationError={validationError}
              maxChars={MAX_CHARS}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className={styles.chatToggleBtn}
        onClick={toggleChat}
        aria-label={isOpen ? 'Закрыть чат' : 'Открыть чат'}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 1,
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  )
}

export default Chat
