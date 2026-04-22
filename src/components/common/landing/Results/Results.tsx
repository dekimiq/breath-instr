'use client'

import React, { useRef } from 'react'

import resultsBg from '@/assets/images/landing/results-bg.png'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Brain, Smile, Zap } from 'lucide-react'
import Image from 'next/image'

import { AnimatedButton } from '@/components/ui/AnimatedButton/AnimatedButton'
import GlassCard from '@/components/ui/GlassCard/GlassCard'
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader'

import styles from './Results.module.scss'

const Results: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <section id="results" className={styles.results} ref={ref}>
      <div className="container">
        <div className={styles.headerWrapper}>
          <SectionHeader title="Что получите на выходе" subtitle="Результаты" />
        </div>
      </div>

      <div className={styles.parallaxWrapper}>
        <div className={styles.imageContainer}>
          <motion.div className={styles.motionWrapper} style={{ y }}>
            <Image
              src={resultsBg}
              alt="Results background"
              className={styles.bgImage}
              placeholder="blur"
              priority={false}
            />
          </motion.div>
          <div className={styles.imageOverlay}>
            <div className={styles.topBottomGradients} />
          </div>
        </div>

        <div className="container">
          <div className={styles.cardsGrid}>
            <GlassCard
              title="Контроль стресса"
              description="95% людей заметили снижение стресса за две недели практики."
              Icon={Brain}
              delay="0"
              glowColor="orange"
            />

            <GlassCard
              title="Эмоциональный баланс"
              description="Улучшение настроения и снижение тревожности благодаря регулярным занятиям."
              Icon={Smile}
              delay="200"
              glowColor="blue"
            />

            <GlassCard
              title="Энергия и тонус"
              description="Повышение уровня энергии и работоспособности в течение всего дня."
              Icon={Zap}
              delay="400"
              glowColor="blue"
            />
          </div>
        </div>
      </div>

      <div className="container">
        <div
          className={styles.ctaWrapper}
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <a href="#contacts">
            <AnimatedButton>Попробовать уже сейчас!</AnimatedButton>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Results
