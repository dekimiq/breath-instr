'use client'

import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

import styles from '@/components/common/landing/FAQ/FAQAccordion.module.scss'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'Какие техники дыхания используются для преодоления стресса?',
    answer:
      'Мы используем различные техники, включая диафрагмальное дыхание, квадратное дыхание и технику 4-7-8. Каждая из них подбирается индивидуально в зависимости от вашего состояния и целей.',
  },
  {
    question: 'Как быстро я почувствую результат?',
    answer:
      'Многие клиенты отмечают улучшение состояния уже после первой сессии. Однако для устойчивого результата рекомендуется регулярная практика в течение нескольких недель.',
  },
  {
    question: 'Нужно ли мне специальное оборудование?',
    answer:
      'Нет, для занятий дыхательными практиками вам не потребуется никакого специального оборудования. Достаточно удобной одежды и тихого места.',
  },
  {
    question:
      'Могу ли я заниматься, если у меня есть медицинские противопоказания?',
    answer:
      'Перед началом занятий мы обязательно проводим анкетирование. В случае серьезных заболеваний рекомендуется проконсультироваться с врачом. Мы адаптируем практику под ваши возможности.',
  },
]

export const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={styles.accordionWrapper}>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`${styles.accordionItem} ${openIndex === index ? styles.open : ''}`}
        >
          <button
            onClick={() => toggleItem(index)}
            className={styles.accordionHeader}
            aria-expanded={openIndex === index}
          >
            <span className={styles.question}>{faq.question}</span>
            <div className={styles.iconWrapper}>
              <motion.div
                initial={false}
                animate={{
                  opacity: openIndex === index ? 0 : 1,
                  rotate: openIndex === index ? 90 : 0,
                }}
                transition={{ duration: 0.2 }}
                className={styles.icon}
              >
                <Plus size={24} />
              </motion.div>
              <motion.div
                initial={false}
                animate={{
                  opacity: openIndex === index ? 1 : 0,
                  rotate: openIndex === index ? 0 : -90,
                }}
                transition={{ duration: 0.2 }}
                className={styles.icon}
              >
                <Minus size={24} />
              </motion.div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className={styles.accordionContent}>{faq.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
