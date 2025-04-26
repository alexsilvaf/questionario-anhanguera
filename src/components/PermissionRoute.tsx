// src/components/PermissionRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface PermissionRouteProps {
  required: string
  children: React.ReactNode
}

export default function PermissionRoute({ required, children }: PermissionRouteProps) {
  const { loggedUser, isLoading } = useAuth()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  const has = (required.length == 0) || loggedUser?.authorities?.some(a => a.authority.includes(required))

  return has
    ? <>{children}</>
    : <Navigate to="/404" replace />
}
