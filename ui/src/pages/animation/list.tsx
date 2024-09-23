import { LySelect } from '@/components'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PlaybackPlatforms, Weekdays } from '@/lib/constants'
import { useDelete, useNavigation } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef, flexRender } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

export const AnimationList = () => {
	const { create, edit } = useNavigation()
	const { mutate: mutateDelete } = useDelete()

	const columns = useMemo<ColumnDef<any>[]>(
		() => [
			{ id: 'id', accessorKey: 'ID', header: 'ID' },
			{ id: 'name', accessorKey: 'Name', header: '动画' },
			{ id: 'production', accessorKey: 'Production', header: '制作' },
			{
				id: 'episode',
				accessorKey: 'Episode',
				header: '播放',
				cell: ({ row }) => (
					<a href={row.original.Link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
						{row.original.Episode}
					</a>
				)
			},
			{ id: 'publishTime', accessorKey: 'PublishTime', header: '更新时间' },
			{
				id: 'playbackPlatform',
				accessorKey: 'PlaybackPlatform',
				header: '平台',
				cell: ({ getValue }) => PlaybackPlatforms.find((p) => p.value === getValue())?.label ?? getValue()
			},
			{
				id: 'weeklyUpdateTime',
				accessorKey: 'WeeklyUpdateTime',
				header: '每周更新',
				cell: ({ row }) => {
					return row.original.WeeklyUpdateTime?.map((value: number) => Weekdays.find((weekday) => weekday.value === value)?.label ?? '').join(' ')
				}
			},
			{ id: 'rating', accessorKey: 'Rating', header: '评分' },
			{
				id: 'description',
				accessorKey: 'Description',
				header: '说明',
				cell: ({ getValue }) => (
					<TooltipProvider>
						<Tooltip delayDuration={200}>
							<TooltipTrigger>
								<div className="truncate max-w-[500px]">{getValue() as string}</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>{getValue() as string}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)
			},
			{
				id: 'actions',
				accessorKey: 'ID',
				header: 'Actions',
				cell: ({ getValue }) => (
					<div className="flex space-x-2">
						<Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 p-1" onClick={() => edit('animation', getValue() as string)}>
							<Pencil className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="text-red-600 hover:text-red-800 p-1"
							onClick={() => {
								if (window.confirm('确认删除？')) {
									mutateDelete({ resource: 'animation', id: getValue() as string })
								}
							}}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				)
			}
		],
		[]
	)

	const {
		getHeaderGroups,
		getRowModel,
		refineCore: { setFilters }
	} = useTable({
		columns,
		refineCoreProps: {
			pagination: { mode: 'off' },
			syncWithLocation: false
		}
	})

	return (
		<div className="w-[98%] mx-auto">
			<div className="mb-4 flex items-end justify-between">
				<div className="flex space-x-8">
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

				<Button onClick={() => create('animation')} size="sm" className="h-8 px-4 rounded bg-primary text-primary-foreground hover:bg-primary/60 transition-colors duration-200">
					Create
				</Button>
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						{getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="hover:bg-gray-100">
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="py-2">
										{flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{getRowModel().rows.map((row) => (
							<TableRow key={row.id} className="hover:bg-gray-50">
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className="py-2">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
