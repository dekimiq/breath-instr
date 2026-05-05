'use client'

import { useState } from 'react'

import styles from '@/app/(admin)/login/Login.module.scss'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/ui/Input/Input'


export default function LoginPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      })

      if (res.ok) {
        router.push('/management-portal')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Ошибка входа')
      }
    } catch {
      setError('Что-то пошло не так')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h1>Management Portal</h1>
        {error && <p className={styles.error}>{error}</p>}
        <Input
          id="login"
          name="username"
          type="text"
          placeholder="Login"
          autoComplete="username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
