import { createRoot } from 'react-dom/client'
import '@repo/ui/globals.css'
import { RouterProvider } from 'react-router'
import {
  QueryClientProvider,
} from '@tanstack/react-query'
import { router } from './router.tsx'
import { queryClient } from './lib/trpc.ts'


createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
