import { useEffect, useState } from 'react'
import { authConfigService } from '../services/auth-config.service'
import type { AuthConfig } from '../types/auth-config.types'

const DEFAULT_CONFIG: AuthConfig = {
  signup: {
    enabledChannels: [],
  },
  login: {
    enabledChannels: [],
  },
}

export function useAuthConfig() {
  const [config, setConfig] = useState<AuthConfig>(DEFAULT_CONFIG)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadConfig() {
      try {
        const response = await authConfigService.getConfig()

        if (isMounted) {
          setConfig(response.data)
          setError(null)
        }
      } catch {
        if (isMounted) {
          setError('Unable to load authentication settings.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadConfig()

    return () => {
      isMounted = false
    }
  }, [])

  return { config, isLoading, error }
}