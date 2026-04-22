import React from 'react'

import { LucideIcon } from 'lucide-react'

import styles from './GlassCard.module.scss'

interface GlassCardProps {
  title: string
  description: string
  Icon: LucideIcon
  delay?: string
  glowColor?: 'blue' | 'orange' | 'red'
  className?: string
}

const GlassCard: React.FC<GlassCardProps> = ({
  title,
  description,
  Icon,
  delay = '0',
  glowColor = 'blue',
  className = '',
}) => {
  return (
    <div
      className={`${styles.glassCardWrapper} ${className} glass-card-wrapper`}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div className={`${styles.glassCard} ${styles[glowColor]} glass-card`}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Icon size={32} />
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <p
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  )
}

export default GlassCard
