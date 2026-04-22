'use client'

import React, { useEffect } from 'react'

import { motion } from 'framer-motion'

import styles from '@/components/common/landing/FAQ/FAQ.module.scss'
import { FAQAccordion } from '@/components/common/landing/FAQ/FAQAccordion'
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader'

export const FAQ: React.FC = () => {
  useEffect(() => {
    const handleChatTrigger = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('chat-trigger')) {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('open-chat'))
      }
    }

    document.addEventListener('click', handleChatTrigger)
    return () => document.removeEventListener('click', handleChatTrigger)
  }, [])

  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.container}>
        <SectionHeader subtitle="FAQs" title="Ответы на вопросы" />

        <motion.div
          className={styles.introText}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p>
            Тут есть ответы на популярные вопросы, а если вашего вопроса нет -
            вы всегда можете задать его{' '}
            <a href="#contacts" className={styles.link}>
              инструктору
            </a>{' '}
            или{' '}
            <button className={`${styles.link} chat-trigger`}>
              ассистенту
            </button>
            !
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FAQAccordion />
        </motion.div>
      </div>
    </section>
  )
}
