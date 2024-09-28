import { LySelect } from '@/components'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Apps } from '@/lib/constants'
import { useTable } from '@refinedev/react-table'
import { ColumnDef, flexRender } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useMemo } from 'react'

export const StreamList = () => {
	const columns = useMemo<ColumnDef<any>[]>(
		() => [
			{
				id: 'region',
				accessorKey: 'region',
				header: 'region',
				cell: ({ row }) => (
					<a href={`http://${row.original.ip}:8280/index/api/getMediaList?secret=`} target="_blank" className="text-blue-600 hover:underline">
						{row.original.region}
					</a>
				)
			},
			{
				id: 'stream',
				accessorKey: 'stream',
				header: 'local',
				cell: ({ row }) => (
					<a href={`/player?u=http://${row.original.ip}:8280/${row.original.app}/${row.original.stream}.live.flv`} target="_blank" className="hover:underline">
						{row.original.stream}
					</a>
				)
			},
			{
				id: 'alive_second',
				accessorKey: 'alive_second',
				header: 'alive',
				cell: ({ getValue }) => {
					const seconds = getValue() as number
					const minutes = Math.floor(seconds / 60)
					const remainingSeconds = seconds % 60
					return `${minutes}m ${remainingSeconds}s`
				}
			},
			{
				id: 'link',
				accessorKey: 'link',
				header: 'remote',
				cell: ({ row }) => (
					<a href={`http://ply.marzesport.cn/?url=${row.original.link}`} target="_blank" className="text-blue-600 hover:underline">
						{row.original.link ? 'play' : ''}
					</a>
				)
			},
			{ id: 'vcodec', accessorKey: 'vcodec', header: 'vcodec' },
			{
				id: 'resolution',
				accessorKey: 'resolution',
				header: 'resolution',
				cell: ({ row }) => `${row.original.width} x ${row.original.height}`
			},
			{
				id: 'bytes_speed',
				accessorKey: 'bytes_speed',
				header: 'bit rate',
				cell: ({ row }) => `${((row.original.bytes_speed * 8) / 1000 / 1000).toFixed(2)} Mbps`
			},
			{ id: 'publish_time', accessorKey: 'publish_time', header: 'publish time' },
			{ id: 'fps', accessorKey: 'fps', header: 'fps' },
			{
				id: 'sample_rate',
				accessorKey: 'sample_rate',
				header: 'sample',
				cell: ({ row }) => `${row.original.sample_rate} x ${row.original.sample_bit}`
			},
			{
				id: 'create_stamp',
				accessorKey: 'create_stamp',
				header: 'created at',
				cell: ({ getValue }) => {
					const timestamp = getValue() as number
					const validTimestamp = typeof timestamp === 'number' ? timestamp * 1000 : timestamp
					try {
						return format(new Date(validTimestamp), 'HH:mm:ss')
					} catch (error) {
						console.error('Invalid timestamp:', timestamp, error)
						return 'Invalid Date'
					}
				}
			},
			{
				id: 'origin_url',
				accessorKey: 'origin_url',
				header: 'url',
				cell: ({ getValue }) => (
					<TooltipProvider>
						<Tooltip delayDuration={200}>
							<TooltipTrigger>
								<div className="truncate max-w-[350px]">{getValue() as string}</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>{getValue() as string}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
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
			dataProviderName: 'streams',
			resource: 'live/mediaList',
			pagination: { mode: 'off' },
			syncWithLocation: false,
			filters: {
				initial: [
					{
						field: 'app',
						value: 'sport',
						operator: 'eq'
					}
				]
			}
		}
	})

	return (
		<div className="w-[98%] mx-auto">
			<div className="mb-4 flex items-end justify-between">
				<div className="flex space-x-8">
					<LySelect
						label="App"
						id="app-select"
						options={Apps}
						defaultValue="sport"
						onValueChange={(value) => {
							setFilters([{ field: 'app', value, operator: 'eq' }])
						}}
						onClear={() => {
							setFilters([{ field: 'app', value: undefined, operator: 'eq' }])
						}}
					/>
				</div>

				<div className="font-bold">Total: {getRowModel().rows.length}</div>
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
