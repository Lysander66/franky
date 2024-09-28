import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import React, { useState } from 'react'

interface LySelectProps {
	label?: string
	id: string
	placeholder?: string
	defaultValue?: string
	options: { value: string; label: string }[]
	onValueChange: (value: string) => void
	onClear: () => void
}

export const LySelect: React.FC<LySelectProps> = ({ label, id, placeholder, defaultValue, options, onValueChange, onClear }) => {
	const [value, setValue] = useState<string>(defaultValue || '')

	const handleValueChange = (newValue: string) => {
		setValue(newValue)
		onValueChange(newValue)
	}

	const handleClear = () => {
		setValue('')
		onClear()
	}

	return (
		<div className="flex flex-col space-y-2">
			{label && <Label htmlFor={id}>{label}</Label>}
			<div className="relative">
				<Select value={value} onValueChange={handleValueChange}>
					<SelectTrigger id={id} className={`w-[120px] h-8 text-sm ${value ? '[&>svg]:hidden' : ''}`}>
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
					<SelectContent>
						{options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{value && (
					<Button variant="ghost" size="sm" className="absolute right-0 top-0 h-full" onClick={handleClear}>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>
		</div>
	)
}
