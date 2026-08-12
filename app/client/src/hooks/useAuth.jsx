import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authService from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = checking, null = signed out
  const [error, setError] = useState('')

  useEffect(() => {
    // getSession() is async on the real backend (has to ask GET /auth/me
    // since the tokens live in HttpOnly cookies JS can't read directly) —
    // mock mode's version resolves synchronously-ish but is still awaited
    // the same way here so this effect doesn't care which mode is active.
    let alive = true
    authService.getSession().then((session) => {
      if (alive) setUser(session)
    })
    return () => { alive = false }
  }, [])

  // Kept for backward compatibility — nothing in the app currently calls
  // this directly anymore (LoginPage now uses the two-step OTP flow
  // below), but leaving it in case anything else references it.
  const login = useCallback(async (email, password) => {
    setError('')
    try {
      const session = await authService.login({ email, password })
      setUser(session)
      return true
    } catch (e) {
      setError(e.message || 'Unable to sign in.')
      return false
    }
  }, [])

  // Step 1: validate credentials + send the OTP. No session yet.
  const requestLoginOtp = useCallback(async (email, password) => {
    setError('')
    try {
      await authService.requestLoginOtp({ email, password })
      return true
    } catch (e) {
      setError(e.message || 'Unable to sign in.')
      return false
    }
  }, [])

  // Step 2: confirm the OTP, which creates the session (real backend also
  // sets the accessToken/refreshToken HttpOnly cookies as a side effect of
  // this call — nothing here needs to store them).
  const verifyLoginOtp = useCallback(async (email, password, otp) => {
    setError('')
    try {
      const session = await authService.verifyLoginOtp({ email, password, otp })
      setUser(session)
      return true
    } catch (e) {
      setError(e.message || 'Invalid or expired code.')
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, error, login, requestLoginOtp, verifyLoginOtp, logout, isChecking: user === undefined }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}