import { useState, useEffect, useCallback } from 'react'

import { Message, Limits } from '../types'

const STORAGE_KEY = 'chat_history'

export const useChat = (_isOpen: boolean) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem(STORAGE_KEY)
      if (savedHistory) {
        try {
          return JSON.parse(savedHistory)
        } catch (e) {
          console.error('Failed to parse chat history', e)
        }
      }
    }
    return []
  })
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [maxChars, setMaxChars] = useState(128)
  const [limits, setLimits] = useState<Limits | null>(null)
  const [isBlocked, setIsBlocked] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [blockReason, setBlockReason] = useState<string | null>(null)
  const [serviceUnavailable, setServiceUnavailable] = useState(false)

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  const sendMessage = useCallback(async () => {
    const trimmedValue = inputValue.trim()
    if (!trimmedValue || isLoading || isBlocked || serviceUnavailable) return

    setValidationError(null)
    const userMessage: Message = { role: 'user', content: trimmedValue }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setServiceUnavailable(false)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-4),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        if (response.status === 429) {
          setIsBlocked(true)
          const reason =
            data.code === 'SESSION_LIMIT_REACHED'
              ? 'Рады что вы интересуетесь этой темой. Еще больше о дыхании и практиках вы можете узнать у инструктора!)'
              : 'Превышен лимит запросов. Пожалуйста, свяжитесь со мной напрямую для консультации.'
          setBlockReason(reason)
          return
        }

        if (response.status === 400) {
          setValidationError(data.error || 'Ошибка валидации')
          return
        }

        setServiceUnavailable(true)
        setBlockReason(
          data.error ||
            'В данный момент ассистент недоступен. Попробуйте позже или свяжитесь со мной напрямую.'
        )
        return
      }
      const headerMaxChars = response.headers.get('x-ai-max-chars')
      const headerLimitTotal = response.headers.get('x-ai-limit-total')
      const headerLimitRemaining = response.headers.get('x-ai-limit-remaining')

      if (headerMaxChars) setMaxChars(Number(headerMaxChars))
      if (headerLimitTotal && headerLimitRemaining) {
        setLimits({
          remaining: Number(headerLimitRemaining),
          total: Number(headerLimitTotal),
        })
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value, { stream: true })
            assistantMessage += chunk
            setMessages((prev) => {
              const newMessages = [...prev]
              newMessages[newMessages.length - 1].content = assistantMessage
              return newMessages
            })
          }

          if (!assistantMessage.trim()) {
            throw new Error('Получен пустой ответ от ассистента.')
          }
        } catch (streamError: unknown) {
          console.error('Stream reading error:', streamError)
          setServiceUnavailable(true)
          setBlockReason(
            'В данный момент ассистент недоступен. Попробуйте позже или свяжитесь со мной напрямую.'
          )
          setMessages((prev) =>
            prev.filter(
              (msg, idx) =>
                idx !== prev.length - 1 ||
                msg.content !== '' ||
                msg.role !== 'assistant'
            )
          )
        } finally {
          reader.releaseLock()
        }
      }
    } catch (error: unknown) {
      if (!isBlocked && !serviceUnavailable) {
        setServiceUnavailable(true)
        setBlockReason(
          error instanceof Error
            ? error.message
            : 'Ошибка при получении ответа.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, isBlocked, serviceUnavailable, messages])

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    limits,
    isBlocked,
    validationError,
    blockReason,
    serviceUnavailable,
    sendMessage,
    MAX_CHARS: maxChars,
  }
}
