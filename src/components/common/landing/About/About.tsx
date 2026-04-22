import React from 'react'

import aboutMeImg from '@/assets/images/landing/about-me.jpeg'
import Image from 'next/image'

import { AnimatedButton } from '@/components/ui/AnimatedButton/AnimatedButton'
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader'

import styles from './About.module.scss'

const About: React.FC = () => {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <SectionHeader subtitle="Специалист" title="Обо мне" />

        <div className={styles.contentBlock}>
          <div className={styles.imageWrapper} data-aos="fade-left">
            <Image
              src={aboutMeImg}
              alt="Ольга Карелина"
              className={styles.aboutImage}
              placeholder="blur"
            />
          </div>

          <div className={styles.textContent} data-aos="fade-right">
            <h3>
              <span className={styles.accentText}>Ольга Карелина</span>
              <br />
              дипломированный эксперт по дыханию
            </h3>
            {/* <p className={styles.subtitle}>Ваш шанс че-то там кого-то там</p> */}

            <p>
              Применяю интегративный подход: Соединяю современные научные данные
              с проверенными древними практиками.
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
          </div>
        </div>

        <div className={styles.actionArea} data-aos="fade-up">
          <a href="#contacts">
            <AnimatedButton>Записаться</AnimatedButton>
          </a>
        </div>
      </div>
    </section>
  )
}

export default About
