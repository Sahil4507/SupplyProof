import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import os from 'os'

/**
 * Automatically determine the local IPv4 address on the active LAN/Wi-Fi adapter.
 * Used to ensure generated QR codes can be scanned and opened from mobile devices on the same Wi-Fi.
 */
function getLocalIP() {
  try {
    const interfaces = os.networkInterfaces()
    for (const devName in interfaces) {
      const iface = interfaces[devName]
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i]
        if (alias.family === 'IPv4' && !alias.internal && alias.address !== '127.0.0.1') {
          return alias.address
        }
      }
    }
  } catch (err) {
    console.warn('Could not determine LAN IP:', err)
  }
  return '192.168.1.4'
}

const localIP = getLocalIP()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Exposes Vite on 0.0.0.0 so phones on the same Wi-Fi can access the dev server
    port: 5173,
    strictPort: false
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  },
  define: {
    __LAN_IP__: JSON.stringify(localIP)
  }
})
