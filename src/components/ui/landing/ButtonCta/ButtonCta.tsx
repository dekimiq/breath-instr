import React from 'react'

import { motion } from 'framer-motion'

import styles from '@/components/ui/landing/ButtonCta/ButtonCta.module.scss'

interface ButtonProps {
  href: string
  className?: string
  children: React.ReactNode
}

export default function ButtonCta({ href, className, children }: ButtonProps) {
  return (
    <motion.a
      href={href}
      className={`${styles.btnCtaPrimary} ${className || ''} ${'btn'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  )
}
