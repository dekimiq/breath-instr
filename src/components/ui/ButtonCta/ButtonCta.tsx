import React from 'react'

import { motion } from 'framer-motion'

import styles from '@/components/ui/ButtonCta/ButtonCta.module.scss'

interface ButtonProps {
  href?: string
  className?: string
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export default function ButtonCta({
  href,
  className,
  children,
  onClick,
}: ButtonProps) {
  return (
    <motion.a
      href={href}
      className={`${styles.btnCtaPrimary} ${className || ''} ${'btn'}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  )
}
