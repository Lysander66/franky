import { LySelect } from '@/components'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PlaybackPlatforms, Weekdays } from '@/lib/constants'
import { useDelete, useNavigation, useTable } from '@refinedev/core'
import { Pencil, Trash2 } from 'lucide-react'

export const AnimationList = () => {
	const { edit } = useNavigation()
	const { mutate: mutateDelete } = useDelete()

	const { tableQuery, setFilters } = useTable({
		pagination: { mode: 'off' },
		syncWithLocation: false
	})

	const data = tableQuery.data?.data || []

	return (
		<div className="w-[98%] mx-auto">
			<div className="mb-4 flex space-x-8">
				<LySelect
					label="平台"
					id="platform-select"
					placeholder="选择平台"
					options={PlaybackPlatforms}
					onValueChange={(value) => {
						setFilters([{ field: 'PlaybackPlatform', value, operator: 'eq' }])
					}}
					onClear={() => {
						setFilters([{ field: 'PlaybackPlatform', value: undefined, operator: 'eq' }])
					}}
				/>

				<LySelect
					label="每周更新"
					id="weekday-select"
					placeholder="选择星期"
					options={Weekdays.map((v) => ({ ...v, value: v.value.toString() }))}
					onValueChange={(value) => {
						setFilters([{ field: 'Weekday', value: Number.parseInt(value), operator: 'eq' }])
					}}
					onClear={() => {
						setFilters([{ field: 'Weekday', value: undefined, operator: 'eq' }])
					}}
				/>
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-gray-100">
							<TableHead className="py-2">ID</TableHead>
							<TableHead className="py-2">动画</TableHead>
							<TableHead className="py-2">制作</TableHead>
							<TableHead className="py-2">播放</TableHead>
							<TableHead className="py-2">更新时间</TableHead>
							<TableHead className="py-2">平台</TableHead>
							<TableHead className="py-2">每周更新</TableHead>
							<TableHead className="py-2">评分</TableHead>
							<TableHead className="py-2">说明</TableHead>
							<TableHead className="py-2">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{data.map((record: any) => (
							<TableRow key={record.ID} className="hover:bg-gray-50">
								<TableCell className="py-2">{record.ID}</TableCell>
								<TableCell className="py-2">{record.Name}</TableCell>
								<TableCell className="py-2">{record.Production}</TableCell>
								<TableCell className="py-2">
									<a href={record.Link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
										{record.Episode}
									</a>
								</TableCell>
								<TableCell className="py-2">{record.PublishTime}</TableCell>
								<TableCell className="py-2">{record.PlaybackPlatform}</TableCell>
								<TableCell className="py-2">{record.WeeklyUpdateTime?.map((value: number) => Weekdays.find((weekday) => weekday.value === value)?.label ?? '').join(' ')}</TableCell>
								<TableCell className="py-2">{record.Rating}</TableCell>
								<TableCell className="py-2">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<div className="truncate max-w-[150px]">{record.Description}</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>{record.Description}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</TableCell>
								<TableCell className="py-2 px-3 text-sm">
									<div className="flex space-x-2">
										<Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 p-1" onClick={() => edit('animation', record.ID)}>
											<Pencil className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="text-red-600 hover:text-red-800 p-1"
											onClick={() => {
												if (window.confirm('确认删除？')) {
													mutateDelete({ resource: 'animation', id: record.ID })
												}
											}}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
