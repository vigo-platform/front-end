import { useEffect, useState } from 'react'
import { authConfigService } from '../services/auth-config.service'
import { authService } from '../services/auth.service'
import type { AuthConfig } from '../types/auth-config.types'
import type { AuthSettings } from '../types/auth.types'

const DEFAULT_CONFIG: AuthConfig = {
  signup: { enabledChannels: [] },
  login: { enabledChannels: [] },
}

export function useAuthConfig() {
  const [config, setConfig] = useState<AuthConfig>(DEFAULT_CONFIG)
  const [settings, setSettings] = useState<AuthSettings | null>(null)
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
        if (isMounted) setError('Unable to load authentication options.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    async function loadSettings() {
      try {
        const response = await authService.getSettings()
        if (isMounted) setSettings(response.data)
      } catch {
        // Keep the local channel configuration available when the API is offline.
      }
    }

    void loadConfig()
    void loadSettings()

    return () => {
      isMounted = false
    }
  }, [])

  return { config, settings, isLoading, error }
}
