import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useNavigation } from '@refinedev/core'
import { LucideIcon, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'

export interface MenuItemProps {
	icon: LucideIcon
	label: string
	path?: string
	children?: MenuItemProps[]
}

export const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, children, path }) => {
	const { push } = useNavigation()
	const [isOpen, setIsOpen] = React.useState(false)

	if (!children) {
		return (
			<Button variant="ghost" className="px-3 text-sm" onClick={() => push(path ?? '')}>
				<Icon className="h-4 w-4 mr-2" />
				{label}
			</Button>
		)
	}

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" className="px-3 text-sm" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
					<Icon className="h-4 w-4 mr-2" />
					{label}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-56" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
				<div className="grid gap-1">
					{children.map((item, index) => (
						<MenuItem key={index} {...item} />
					))}
				</div>
			</PopoverContent>
		</Popover>
	)
}

interface LayoutProps {
	children: React.ReactNode
	menuItems: MenuItemProps[]
	title: string
	logo?: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children, menuItems, title, logo }) => {
	const { push } = useNavigation()
	const { theme, setTheme } = useTheme()

	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="py-2 px-6 border-b">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-6">
						<Button variant="ghost" className="flex items-center space-x-2 p-0" onClick={() => push('/')}>
							{logo || <span className="text-2xl">🔥</span>}
							<h1 className="text-lg font-bold">{title}</h1>
						</Button>

						<nav className="flex items-center space-x-1">
							{menuItems.map((item) => (
								<MenuItem key={item.label} {...item} />
							))}
						</nav>
					</div>

					<Button variant="ghost" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="px-2">
						{theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
					</Button>
				</div>
			</header>

			<main className="px-6 mt-8">{children}</main>
		</div>
	)
}
