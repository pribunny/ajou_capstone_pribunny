import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
	host: '0.0.0.0', // ← 외부 접속 허용 (ALB 포함)
	port: 5173        // ← ALB가 포워딩할 포트와 일치
  }
})
