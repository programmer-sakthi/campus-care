import { createRoot } from 'react-dom/client'
import '@repo/ui/globals.css'
import { RouterProvider } from 'react-router'
import { router } from './router.tsx'

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
