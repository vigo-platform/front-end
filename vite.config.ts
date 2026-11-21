import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiTarget = env.VITE_API_BASE_URL

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: env.VITE_BASE_APPLICATION_SERVER,
      port: Number(env.VITE_BASE_APPLICATION_PORT) || 5173,
      proxy: /^https?:\/\//i.test(apiTarget ?? '') ? {
        '/api/': {
          target: apiTarget,
          changeOrigin: true,
          configure(proxy) {
            proxy.on('proxyReq', (outgoing, incoming) => {
              const { origin, host } = incoming.headers
              if (origin === 'http://' + host || origin === 'https://' + host) {
                outgoing.setHeader('Origin', new URL(apiTarget).origin)
              }
            })
          },
        },
      } : undefined,
    },
  }
})
