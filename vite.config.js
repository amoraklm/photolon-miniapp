import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// توجه: اگر از GitHub Project Pages استفاده می‌کنی، مقدار base را به '/نام-مخزن/' تغییر بده.
export default defineConfig({
  plugins: [react()],
  base: ''
})