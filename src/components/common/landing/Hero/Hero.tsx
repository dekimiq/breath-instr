'use client'

import { useRef } from 'react'

import heroBg from '@/assets/images/landing/hero-bg.png'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

import styles from '@/components/common/landing/Hero/Hero.module.scss'

const textsPage = {
  title: 'Дыхание как технология<br /> восстановления и управления',
  desc: 'Это единственная функция тела, работающая автоматически, но доступная и для осознанного управления.',
}

export default function Hero() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section ref={container} className={styles.hero}>
      <div className={styles.content}>
        <h1 dangerouslySetInnerHTML={{ __html: textsPage.title }} />
        <p>{textsPage.desc}</p>
      </div>

      <motion.div style={{ y, scale: 1.1 }} className={styles.parallaxWrapper}>
        <Image
          src={heroBg}
          alt="Визуализация легких человека"
          priority
          fill
          className={styles.backgroundImage}
        />
      </motion.div>
    </section>
  )
}
