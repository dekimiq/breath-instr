'use client'

import React, { useSyncExternalStore } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

import { useConsentStore } from '@/store/consent'

import styles from './ConsentBanner.module.scss'

export const ConsentBanner = () => {
  const setConsent = useConsentStore((state) => state.setConsent)
  const hasAccepted = useSyncExternalStore(
    useConsentStore.subscribe,
    () => useConsentStore.getState().hasAccepted,
    () => null
  )

  if (hasAccepted !== null) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        className={styles.banner}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className={styles.content}>
          <p>
            Для защиты от абуза и стабильной работы чата с ИИ мы обрабатываем
            технические данные (IP-адрес). Это необходимое условие использования
            сервиса. Нажимая «Принимаю», вы соглашаетесь с Пользовательским
            соглашением и Политикой конфиденциальности.
          </p>
          <div className={styles.links}>
            <Link href="/privacy-policy">
              Подробнее в Политике конфиденциальности
            </Link>
            <Link href="/user-agreement">
              Условия Пользовательского соглашения
            </Link>
          </div>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.declineBtn}
            onClick={() => setConsent(false)}
          >
            Не принимаю
          </button>
          <button
            type="button"
            className={styles.acceptBtn}
            onClick={() => setConsent(true)}
          >
            Принимаю
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
