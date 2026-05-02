'use client'

import { useRef } from 'react'

import heroBg from '@/assets/images/landing/hero-bg.jpg'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

import styles from '@/components/common/landing/Hero/Hero.module.scss'
import ButtonCta from '@/components/ui/ButtonCta/ButtonCta'

import { useScrollTo } from '@/hooks/useScrollTo'

const textsPage = {
  title: 'Дыхание как технология восстановления и управления',
  desc: 'Это единственная функция тела, работающая автоматически, но доступная и для осознанного управления.',
}

const MotionImage = motion(Image)

export default function Hero() {
  const scrollTo = useScrollTo()
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section ref={container} className={styles.hero} id="hero">
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          dangerouslySetInnerHTML={{ __html: textsPage.title }}
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {textsPage.desc}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <ButtonCta
            href="#contacts"
            className={styles.btnToBottom}
            onClick={(e) => {
              e.preventDefault()
              scrollTo('contacts')
            }}
          >
            Начать дышать правильно
          </ButtonCta>
        </motion.div>
      </motion.div>

      <div className={styles.parallaxWrapper}>
        <MotionImage
          style={{ y, scale: 1.1 }}
          src={heroBg}
          alt="Визуализация легких человека"
          priority
          fill
          className={styles.backgroundImage}
        />
      </div>
    </section>
  )
}
