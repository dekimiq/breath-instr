'use client'

import React from 'react'

import arrowDown from '@/assets/images/landing/problems/arrow-down.svg'
import arrowLeft from '@/assets/images/landing/problems/arrow-left.svg'
import arrowRight from '@/assets/images/landing/problems/arrow-right.svg'
import { motion } from 'framer-motion'
import { Brain, Tornado, Battery } from 'lucide-react'
import Image from 'next/image'

import GlassCard from '@/components/ui/GlassCard/GlassCard'
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader'

import styles from './Problems.module.scss'

const Problems: React.FC = () => {
  return (
    <section id="problems" className={styles.problems}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeader subtitle="Проблематика" title="С чем работаем" />
        </motion.div>

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
            title="Стресс"
            description="Стресс — это не просто «плохое настроение», а мощная биологическая реакция, затрагивающая каждую клетку мозга и организма в целом."
            Icon={Brain}
            delay="0"
            glowColor="blue"
          />

          <GlassCard
            title="Эмоции"
            description="Негативный эмоциональный фон (подавленные эмоции, тревога) — это не черта характера, а дисфункциональное состояние вашей нервной системы, которое переписывает под себя всю вашу жизнь."
            Icon={Tornado}
            delay="200"
            glowColor="orange"
            className={styles.middleCard}
          />

          <GlassCard
            title="Энергия"
            description="Энергия заканчивается не от количества дел, а от внутреннего конфликта и как следствие наступает истощение — и психоэмоциональное, и физическое."
            Icon={Battery}
            delay="400"
            glowColor="red"
          />
        </motion.div>

        <motion.div
          className={styles.bottomContent}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className={styles.arrowsWrapper}>
            <Image src={arrowLeft} alt="" className={styles.arrowLeft} />

            <div className={styles.breathingText}>
              <div className={styles.arrowDown}>
                <Image src={arrowDown} alt="" className={styles.arrowDown} />
              </div>
              <h3>Дыхание!</h3>
              <p>
                Это как раз тот инструментарий, который помогает контроллировать
                реакцию организма безопасным способом
              </p>
            </div>

            <Image src={arrowRight} alt="" className={styles.arrowRight} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Problems
