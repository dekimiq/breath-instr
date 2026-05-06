'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'

import styles from '@/app/(admin)/management-portal/ManagementPortal.module.scss'
import { useRouter } from 'next/navigation'
import remarkGfm from 'remark-gfm'

import { Input } from '@/components/ui/Input/Input'
import { Select } from '@/components/ui/Select/Select'

interface Setting {
  key: string
  value: unknown
  description: string | null
}

interface Model {
  id: string
  name: string
}

interface ApiSetting {
  key: string
  value: unknown
  description: string | null
}

export default function ManagementPortal() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [settings, setSettings] = useState<Setting[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [saving, setSaving] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const fetchModels = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/models')
      if (res.ok) {
        const data = await res.json()
        setModels(data)
      }
    } catch (err) {
      console.error('Ошибка получения моделей', err)
    }
  }, [])

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data: ApiSetting[] = await res.json()
        setSettings(data)
        setIsLoggedIn(true)
        fetchModels()
      } else if (res.status === 401) {
        setIsLoggedIn(false)
        router.push('/login')
      }
    } catch (err) {
      console.error('Ошибка получения настроек', err)
      setIsLoggedIn(false)
      router.push('/login')
    }
  }, [fetchModels, router])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      setIsLoggedIn(false)
      router.push('/login')
    } catch (err) {
      console.error('Ошибка выхода', err)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const wrappedSettings = settings.map((s) => {
        let value: unknown = s.value
        if (s.key === 'AI_IP_LIMIT' || s.key === 'AI_USAGE_RESET_DAYS') {
          value = Number(s.value)
        }
        return { ...s, value }
      })

      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wrappedSettings),
      })

      if (res.ok) {
        alert('Все настройки успешно сохранены!')
        fetchSettings()
      } else {
        const data = await res.json()
        alert(data.error || 'Не удалось сохранить настройки')
      }
    } catch {
      alert('Ошибка при сохранении настроек')
    } finally {
      setSaving(false)
    }
  }

  const updateLocalSetting = (key: string, value: unknown) => {
    setSettings((prev) => {
      const index = prev.findIndex((s) => s.key === key)
      if (index === -1) return prev
      const newSettings = [...prev]
      newSettings[index] = { ...newSettings[index], value }
      return newSettings
    })
  }

  const getSettingValue = (key: string) => {
    const setting = settings.find((s) => s.key === key)
    if (!setting) return ''
    if (typeof setting.value === 'string') return setting.value
    if (setting.value === null || setting.value === undefined) return ''
    return String(setting.value)
  }

  if (isLoggedIn === null) return null
  if (isLoggedIn === false) return null

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <div className={styles.logoText}>
            <h1>Админка</h1>
            <span>ПАНЕЛЬ УПРАВЛЕНИЯ</span>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Выйти
        </button>
      </header>

      <main className={styles.content}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
            КОНФИГУРАЦИЯ AI ДВИЖКА
          </div>
          <div className={styles.cardBody}>
            <div className={styles.row}>
              <Input
                label="API ТОКЕН / КЛЮЧ"
                placeholder="sk-..."
                value={getSettingValue('AI_API_KEY')}
                type="password"
                onChange={(e) => {
                  const val = e.target.value
                  setSettings((prev) =>
                    prev.map((s) =>
                      s.key === 'AI_API_KEY' ? { ...s, value: val } : s
                    )
                  )
                }}
                icon={
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3L15.5 7.5z" />
                  </svg>
                }
              />
              <Select
                label="МОДЕЛЬ AI"
                value={getSettingValue('AI_MODEL_NAME')}
                onChange={(val) => updateLocalSetting('AI_MODEL_NAME', val)}
                options={models.map((m) => ({ id: m.id, name: m.name }))}
                icon={
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                  </svg>
                }
              />
            </div>
            <Input
              label="BASE URL (API)"
              placeholder="https://openrouter.ai/api/v1"
              value={getSettingValue('AI_BASE_URL')}
              onChange={(e) =>
                updateLocalSetting('AI_BASE_URL', e.target.value)
              }
              icon={
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              }
            />
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            ЛИМИТЫ И БЕЗОПАСНОСТЬ
          </div>
          <div className={styles.cardBody}>
            <div className={styles.row}>
              <Input
                label="ОКНО СБОРА (ДНИ)"
                type="number"
                value={getSettingValue('AI_USAGE_RESET_DAYS')}
                onChange={(e) => {
                  const val =
                    e.target.value === '' ? '' : Number(e.target.value)
                  updateLocalSetting('AI_USAGE_RESET_DAYS', val)
                }}
                icon={
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
              />
              <Input
                label="ЗАПРОСОВ НА IP"
                type="number"
                value={getSettingValue('AI_IP_LIMIT')}
                onChange={(e) => {
                  const val =
                    e.target.value === '' ? '' : Number(e.target.value)
                  updateLocalSetting('AI_IP_LIMIT', val)
                }}
                icon={
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                }
              />
            </div>
            <div className={styles.row}>
              <span className={styles.hint}>
                Окно отслеживания для уникальных IP
              </span>
              <span className={styles.hint}>
                Максимум токенов/запросов за период
              </span>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            КОНФИГУРАЦИЯ СИСТЕМНОГО ПРОМПТА
          </div>
          <div className={styles.cardBody}>
            <div className={styles.markdownEditor}>
              <div className={styles.editorPane}>
                <label className={styles.fieldLabel}>РЕДАКТОР MARKDOWN</label>
                <textarea
                  ref={textareaRef}
                  value={getSettingValue('AI_PROMPT')}
                  onChange={(e) =>
                    updateLocalSetting('AI_PROMPT', e.target.value)
                  }
                  placeholder="Введите системный промпт здесь..."
                  onWheel={(e) => e.stopPropagation()}
                  data-lenis-prevent
                />
              </div>
              <div className={styles.previewPane}>
                <label className={styles.fieldLabel}>ПРЕДПРОСМОТР</label>
                <div
                  className={styles.previewContent}
                  ref={previewRef}
                  onWheel={(e) => e.stopPropagation()}
                  data-lenis-prevent
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {getSettingValue('AI_PROMPT')}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.actions}>
          <button
            className={styles.saveBtn}
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить все настройки'}
          </button>
        </div>
      </main>
    </div>
  )
}
