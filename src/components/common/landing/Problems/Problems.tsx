import React from 'react'

import { Brain, Tornado, Battery } from 'lucide-react'

import GlassCard from '@/components/ui/GlassCard/GlassCard'
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader'

import styles from './Problems.module.scss'

const Problems: React.FC = () => {
  const arrowsColor = '#9FE2BF'
  const arrowsColorNeon = '#89CFF0'

  return (
    <section id="problems" className={styles.problems}>
      <div className="container">
        <SectionHeader subtitle="Проблематика" title="С чем работаем" />

        <div className={styles.cardsGrid}>
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
        </div>

        <div
          className={styles.bottomContent}
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <div className={styles.arrowsWrapper}>
            <svg
              className={styles.arrowLeft}
              width="332"
              height="152"
              viewBox="0 0 332 152"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.89778 0.205569C1.47946 -0.108365 0.783181 -0.0569685 0.342608 0.320366C-0.097966 0.697701 -0.116002 1.25809 0.302323 1.57202L1.10005 0.888794L1.89778 0.205569ZM330.756 146.642C331.277 146.342 331.446 145.784 331.133 145.395L326.037 139.067C325.724 138.678 325.049 138.607 324.528 138.907C324.007 139.207 323.838 139.765 324.151 140.154L328.68 145.779L321.135 150.127C320.614 150.428 320.446 150.986 320.758 151.374C321.071 151.762 321.747 151.834 322.268 151.534L330.756 146.642ZM1.10005 0.888794L0.302323 1.57202C23.0501 18.6432 37.5769 34.38 50.947 48.8843C64.3131 63.3841 76.5498 76.6844 94.6747 88.7594C130.943 112.922 190.635 132.085 329.923 146.82L330.19 145.939L330.456 145.057C191.251 130.331 132.027 111.211 96.1885 87.3352C78.2598 75.391 66.1452 62.2332 52.7661 47.7192C39.3911 33.2097 24.7788 17.3768 1.89778 0.205569L1.10005 0.888794Z"
                fill={arrowsColor}
              />
            </svg>

            <div className={styles.breathingText}>
              <div className={styles.arrowDown}>
                <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
                  <path
                    d="M20 0 L 20 50"
                    stroke={arrowsColor}
                    strokeWidth="2"
                  />
                  <path
                    d="M10 40 L 20 50 L 30 40"
                    stroke={arrowsColor}
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3
                style={
                  {
                    '--arrowsColorNeon': arrowsColorNeon,
                  } as React.CSSProperties
                }
              >
                Дыхание!
              </h3>
              <p>
                Это как раз тот инструментарий, который помогает контроллировать
                реакцию организма безопасным способом
              </p>
            </div>

            <svg
              className={styles.arrowRight}
              width="332"
              height="152"
              viewBox="0 0 332 152"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M329.394 0.205137C329.813 -0.109072 330.508 -0.0565019 330.946 0.322555C331.384 0.701611 331.4 1.26361 330.981 1.57782L330.188 0.891479L329.394 0.205137ZM0.530446 146.646C0.0114265 146.345 -0.155228 145.785 0.158212 145.396L5.26602 139.053C5.57946 138.664 6.2543 138.593 6.77332 138.895C7.29234 139.196 7.459 139.756 7.14556 140.145L2.60528 145.783L10.1234 150.151C10.6424 150.453 10.8091 151.013 10.4957 151.402C10.1822 151.791 9.50737 151.862 8.98836 151.56L0.530446 146.646ZM330.188 0.891479L330.981 1.57782C308.202 18.663 293.634 34.4182 280.226 48.9396C266.822 63.4565 254.55 76.7724 236.407 88.8553C200.103 113.034 140.442 132.183 1.36119 146.826L1.09798 145.942L0.834771 145.057C139.834 130.423 199.027 111.317 234.902 87.4249C252.848 75.4726 264.998 62.2994 278.415 47.7683C291.828 33.2417 306.482 17.3903 329.394 0.205137L330.188 0.891479Z"
                fill={arrowsColor}
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Problems
