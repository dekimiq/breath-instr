'use client'

import React, { useRef } from 'react'

import resultsBg from '@/assets/images/landing/results-bg.png'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Brain, Smile, Zap } from 'lucide-react'
import Image from 'next/image'

import { AnimatedButton } from '@/components/ui/AnimatedButton/AnimatedButton'
import GlassCard from '@/components/ui/GlassCard/GlassCard'
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader'

import { useScrollTo } from '@/hooks/useScrollTo'

import styles from './Results.module.scss'

const Results: React.FC = () => {
  const scrollTo = useScrollTo()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <section id="results" className={styles.results} ref={ref}>
      <div className="container">
        <motion.div
          className={styles.headerWrapper}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeader title="Что получите на выходе" subtitle="Результаты" />
        </motion.div>
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
          <motion.div
            className={styles.cardsGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
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
          </motion.div>
        </div>
      </div>

      <div className="container">
        <motion.div
          className={styles.ctaWrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnimatedButton
            onClick={(e) => {
              e.preventDefault()
              scrollTo('contacts')
            }}
          >
            Попробовать уже сейчас!
          </AnimatedButton>
        </motion.div>
      </div>
    </section>
  )
}

export default Results
