import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
	<React.StrictMode>
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<App />
			<Toaster />
		</ThemeProvider>
	</React.StrictMode>
)
