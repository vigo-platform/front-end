import { useEffect, useState } from 'react'
import { authConfigService } from '../services/auth-config.service'
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
          setSettings(response.settings)
          setError(null)
        }
      } catch {
        if (isMounted) {
          setConfig(DEFAULT_CONFIG)
          setSettings(null)
          setError('Unable to load authentication settings from the server.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadConfig()

    return () => {
      isMounted = false
    }
  }, [])

  return { config, settings, isLoading, error }
}
