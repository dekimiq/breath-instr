import React from 'react'

import styles from './SectionHeader.module.scss'

interface SectionHeaderProps {
  subtitle: string
  title: string
  className?: string
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  subtitle,
  title,
  className,
}) => {
  return (
    <div
      className={`${styles.sectionHeader} ${className || ''}`}
      data-aos="fade-up"
    >
      <span className={styles.subtitle}>{subtitle}</span>
      <h2 className={styles.title}>{title}</h2>
    </div>
  )
}

export default SectionHeader
