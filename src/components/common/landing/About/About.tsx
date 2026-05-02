'use client'

import React from 'react'

import aboutMeImg from '@/assets/images/landing/about-me.jpeg'
import { motion } from 'framer-motion'
import Image from 'next/image'

import { AnimatedButton } from '@/components/ui/AnimatedButton/AnimatedButton'
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader'

import { useScrollTo } from '@/hooks/useScrollTo'

import styles from './About.module.scss'

const About: React.FC = () => {
  const scrollTo = useScrollTo()

  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeader subtitle="Специалист" title="Обо мне" />
        </motion.div>

        <div className={styles.contentBlock}>
          <motion.div
            className={styles.imageWrapper}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src={aboutMeImg}
              alt="Ольга Карелина"
              className={styles.aboutImage}
              placeholder="blur"
            />
          </motion.div>

          <motion.div
            className={styles.textContent}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3>
              <span className={styles.accentText}>Ольга Карелина</span>
              <br />
              дипломированный эксперт по дыханию
            </h3>

            <p>
              Применяю интегративный подход: Соединяю современные научные данные
              с проверенными древними практиками. Как{' '}
              <button
                className={styles.inlineLink}
                onClick={() => scrollTo('contacts')}
              >
                инструктору
              </button>
              , мне важно...
            </p>

            <p>
              Сторонник быстрых результатов: Мои клиенты чувствуют эффект уже
              после первой сессии — снижение тревоги, ясность ума, прилив сил. У
              вас уже появится желание остановится, присмотреться прислушаться к
              окружающему (условно) миру.
            </p>

            <p>
              С меня практично и применимо: Учу техникам, которые можно легко
              встроить в любой ритм жизни — от 3-х минут утром до 30- минутной
              перезагрузки в течение дня.
              <br />С Вас дисциплина! Ленивые вы жопы! 🤣
            </p>
          </motion.div>
        </div>

        <motion.div
          className={styles.actionArea}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <AnimatedButton
            onClick={(e) => {
              e.preventDefault()
              scrollTo('contacts')
            }}
          >
            Записаться
          </AnimatedButton>
        </motion.div>
      </div>
    </section>
  )
}

export default About
