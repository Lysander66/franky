import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PlaybackPlatforms, Weekdays } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useNavigation } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { format, parse } from 'date-fns'
import { ArrowLeft, CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const AnimationEdit = () => {
	const { goBack } = useNavigation()

	const {
		refineCore: { onFinish, query },
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	} = useForm()

	const formData = query?.data?.data

	const [date, setDate] = useState<Date | undefined>(undefined)
	const [weeklyUpdate, setWeeklyUpdate] = useState<number[]>([])

	useEffect(() => {
		if (formData) {
			// Set form values
			setValue('ID', formData.ID)
			setValue('Name', formData.Name)
			setValue('Link', formData.Link)
			setValue('Episode', formData.Episode)
			setValue('Studio', formData.Studio)
			setValue('PlaybackPlatform', formData.PlaybackPlatform)
			setValue('Novel', formData.Novel)
			setValue('EventId', formData.EventId)
			setValue('Description', formData.Description)
			setValue('Rating', formData.Rating)

			// Set PublishTime
			if (formData.PublishTime) {
				const parsedDate = parse(formData.PublishTime, 'yyyy-MM-dd', new Date())
				setDate(parsedDate)
				setValue('PublishTime', parsedDate)
			}

			// Set WeeklyUpdateTime
			if (Array.isArray(formData.WeeklyUpdateTime)) {
				setWeeklyUpdate(formData.WeeklyUpdateTime)
				setValue('WeeklyUpdateTime', formData.WeeklyUpdateTime)
			}
		}
	}, [formData, setValue])

	const onSubmit = (data: any) => {
		onFinish({
			...data,
			PublishTime: date ? format(date, 'yyyy-MM-dd') : undefined,
			WeeklyUpdateTime: weeklyUpdate,
			Rating: Number.parseFloat(data.Rating),
			Episode: Number.parseInt(data.Episode, 10)
		})
	}

	const handleSelectAll = () => {
		setWeeklyUpdate(weeklyUpdate.length === Weekdays.length ? [] : Weekdays.map((day) => day.value))
	}

	const handleWeeklyUpdateChange = (dayValue: number) => {
		setWeeklyUpdate((prev) => (prev.includes(dayValue) ? prev.filter((d) => d !== dayValue) : [...prev, dayValue].sort((a, b) => a - b)))
	}

	return (
		<div className="w-full max-w-7xl mx-auto p-4">
			<div className="flex items-center mb-4">
				<Button variant="ghost" className="mr-2" onClick={() => goBack()}>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back
				</Button>
				<h1 className="text-2xl font-bold">Edit Animation</h1>
			</div>

			<Card>
				<CardContent className="pt-6">
					<form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="ID">ID</Label>
							<Input {...register('ID')} readOnly id="ID" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="Name">动画</Label>
							<Input {...register('Name', { required: '请输入名称' })} id="Name" />
							{errors.Name && <span className="text-red-500 text-sm">{errors.Name.message as string}</span>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="Novel">小说</Label>
							<Input {...register('Novel')} id="Novel" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="PlaybackPlatform">平台</Label>
							<Select value={watch('PlaybackPlatform')} onValueChange={(value) => setValue('PlaybackPlatform', value)}>
								<SelectTrigger id="PlaybackPlatform">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{PlaybackPlatforms.map((platform) => (
										<SelectItem key={platform.value} value={platform.value}>
											{platform.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>更新时间</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{date ? format(date, 'yyyy/MM/dd') : <span>选择日期</span>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={date}
										onSelect={(newDate) => {
											setDate(newDate)
											setValue('PublishTime', newDate)
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div className="space-y-2">
							<Label>每周更新</Label>
							<div className="flex flex-wrap gap-2">
								<div className="flex items-center space-x-2">
									<Checkbox id="selectAll" checked={weeklyUpdate.length === Weekdays.length} onCheckedChange={handleSelectAll} />
									<label htmlFor="selectAll" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
										全选
									</label>
								</div>
								{Weekdays.map((day) => (
									<div key={day.value} className="flex items-center space-x-2">
										<Checkbox id={`day-${day.value}`} checked={weeklyUpdate.includes(day.value)} onCheckedChange={() => handleWeeklyUpdateChange(day.value)} />
										<label htmlFor={`day-${day.value}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
											{day.label}
										</label>
									</div>
								))}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="Studio">制作</Label>
							<Input {...register('Studio')} id="Studio" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="Rating">评分</Label>
							<Input
								{...register('Rating', {
									min: 0,
									max: 10,
									valueAsNumber: true
								})}
								id="Rating"
								type="number"
								min="0"
								max="10"
								step="0.1"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="EventId">EventId</Label>
							<Input {...register('EventId')} id="EventId" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="Episode">Episode</Label>
							<Input
								{...register('Episode', {
									min: 1,
									valueAsNumber: true
								})}
								id="Episode"
								type="number"
								min="1"
								step="1"
							/>
						</div>

						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="Link">播放链接</Label>
							<Input {...register('Link')} id="Link" />
						</div>

						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="Description">说明</Label>
							<Textarea {...register('Description')} id="Description" className="h-40 transition-all duration-200 ease-in-out" />
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex justify-end space-x-4">
					<Button onClick={handleSubmit(onSubmit)}> Save </Button>
				</CardFooter>
			</Card>
		</div>
	)
}
