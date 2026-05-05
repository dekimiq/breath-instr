import React, { InputHTMLAttributes } from 'react'

import styles from '@/components/ui/Input/Input.module.scss'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
  error?: string
}

export const Input = ({
  label,
  icon,
  error,
  className,
  ...props
}: InputProps) => {
  return (
    <div className={`${styles.inputWrapper} ${className || ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.inputContainer} ${error ? styles.hasError : ''}`}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <input className={styles.input} {...props} />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}
