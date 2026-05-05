'use client'

import React, { useState, useRef, useEffect } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import styles from '@/components/ui/Select/Select.module.scss'

interface Option {
  id: string
  name: string
}

interface SelectProps {
  label?: string
  icon?: React.ReactNode
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const Select = ({
  label,
  icon,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.id === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={styles.selectWrapper} ref={containerRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.selectContainer} ${isOpen ? styles.isOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.currentValue}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={selectedOption ? styles.text : styles.placeholder}>
            {selectedOption ? selectedOption.name : placeholder}
          </span>
        </div>
        <span className={styles.arrow}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((option) => (
              <div
                key={option.id}
                className={`${styles.option} ${option.id === value ? styles.isSelected : ''}`}
                onClick={() => {
                  onChange(option.id)
                  setIsOpen(false)
                }}
              >
                {option.name}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
