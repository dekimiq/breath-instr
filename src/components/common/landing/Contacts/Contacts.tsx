'use client'

import React from 'react'

import { motion } from 'framer-motion'

import styles from '@/components/common/landing/Contacts/Contacts.module.scss'
import { ContactButton } from '@/components/ui/ContactButton/ContactButton'
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader'

export const Contacts: React.FC = () => {
  return (
    <section id="contacts" className={styles.contacts}>
      <div className={styles.container}>
        <SectionHeader
          subtitle="Контакты"
          title="Как связаться и изменить свою жизнь"
        />

        <motion.div
          className={styles.buttonsContainer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <ContactButton
            href="#"
            title="Телеграм канал с полезной информацией"
          />
          <ContactButton href="#" title="Личная консультация по вопросам" />
          <ContactButton
            href="#"
            title="Попробовать дышать вместе - записаться"
          />
        </motion.div>
      </div>
    </section>
  )
}
