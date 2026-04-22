import React from 'react'

import { Activity, Brain, Dna, Wind, Sparkles } from 'lucide-react'

import GlassCard from '@/components/ui/GlassCard/GlassCard'
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader'

import styles from './Mechanisms.module.scss'

const Mechanisms: React.FC = () => {
  return (
    <section id="mechanisms" className={styles.mechanisms}>
      <div className="container">
        <SectionHeader
          subtitle="Механизмы работы"
          title="На что у нас есть возможность повлиять через дыхание"
        />

        <div className={styles.cardsGrid}>
          <GlassCard
            title="Вегетативная нервная система"
            description="Напрямую переключать симпатический отдел (стресс, трата энергии) на парасимпатический (восстановление, накопление энергии) или обратно."
            Icon={Activity}
            delay="0"
            glowColor="orange"
            className={styles.sideCard}
          />

          <GlassCard
            title="Головной мозг"
            description="Осознанно работать с активностью мозга, особенно с участками, отвечающими за эмоции (миндалевидное тело), внимание (префронтальная кора) и автоматическую регуляцию тела (гипоталамус и ствол мозга) + запускать процессы нейропластичности."
            Icon={Brain}
            delay="200"
            glowColor="blue"
            className={styles.centerCard}
          />

          <GlassCard
            title="Гормональная система"
            description="Напрямую регулировать выброс гормонов стресса (кортизола), также стимулировать выработку окситоцина (гормона спокойствия и доверия) и мелатонина (гормона сна), и можем влиять на уровень дофамина и серотонина, связанных с мотивацией и настроением."
            Icon={Dna}
            delay="400"
            glowColor="red"
            className={styles.sideCard}
          />

          <GlassCard
            title="Диафрагма"
            description="Улучшать лимфоток, «массажировать» печень, желудок, кишечник — улучшая пищеварение и детоксикацию, усиливать приток крови к сердцу и мозгу, снижать внутрибрюшное давление и тонус мышц-антагонистов (например, мышц шеи и плеч, которые часто напрягаются при поверхностном дыхании)"
            Icon={Wind}
            delay="600"
            glowColor="blue"
          />

          <GlassCard
            title="А так же"
            description="<b>Влиять на Кислотно-щелочной баланс (pH крови)<br/>Активировать блуждающий нерв</b><br/><br/>Помимо этого дыхание дает возможность работать с психологическими установками, блоками и ограничениями; наладить контакт с телом и проработать страх, стыд или вину."
            Icon={Sparkles}
            delay="800"
            glowColor="orange"
          />
        </div>
      </div>
    </section>
  )
}

export default Mechanisms
