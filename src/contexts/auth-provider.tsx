import { useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/types/auth'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    // Simulate API call with better error handling
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Demo credentials validation
    if (email === 'demo@example.com' && password === 'demo123') {
      const mockUser: User = {
        id: '1',
        email,
        name: 'Demo User'
      }
      setUser(mockUser)
    } else {
      setIsLoading(false)
      throw new Error('Invalid credentials')
    }
    
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}