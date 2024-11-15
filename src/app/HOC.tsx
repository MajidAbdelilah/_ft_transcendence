'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface AuthProps {
  children: React.ReactNode
}

function LoadingLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F0F1FF]">
      <div className="w-16 h-16 border-4 border-[#B8BEFF] border-t-[#8A8EFF] rounded-full animate-spin"></div>
    </div>
  )
}

export function AuthProvider({ children }: AuthProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie
      
      if (!token) {
        await router.replace('/login')
      } else {
        setIsAuthorized(true)  
      }
      
      setTimeout(() => setIsLoading(false), 500)
    }

    checkAuth()
  }, [router, pathname])

  if (isLoading) {
    return <LoadingLayout />
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function ProtectedRoute(props: P) {
    return (
      <AuthProvider>
        <WrappedComponent {...props} />
      </AuthProvider>
    )
  }
}

// Add this logout utility function
export const logout = (router: any) => {
  localStorage.removeItem('token')
  localStorage.removeItem('lastRoute')
  router.replace('/login')
}

export default withAuth