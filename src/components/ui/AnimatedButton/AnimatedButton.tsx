'use client'

import React from 'react'

import { motion, MotionProps } from 'framer-motion'

import styles from './AnimatedButton.module.scss'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & MotionProps

export const AnimatedButton: React.FC<ButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.button
      className={`${styles.button} ${className || ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
