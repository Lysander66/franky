import { Card, CardContent } from '@/components/ui/card'
import { Cloud, CloudDrizzle, CloudRain, Sun, Wind, Droplet, Gauge, Umbrella, AlertTriangle } from 'lucide-react'
import { useShow } from '@refinedev/core'

const getWeatherIcon = (code: number) => {
	switch (code) {
		case 0:
			return <Sun className="h-8 w-8" />
		case 1:
			return <Cloud className="h-8 w-8" />
		case 8:
			return <CloudDrizzle className="h-8 w-8" />
		case 10:
			return <CloudRain className="h-8 w-8" />
		default:
			return <Cloud className="h-8 w-8" />
	}
}

const WeatherIcon = ({ code, className }: { code: number; className?: string }) => {
	const Icon = getWeatherIcon(code)
	return <div className={`flex justify-center items-center ${className}`}>{Icon}</div>
}

const getWeekday = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('zh-CN', { weekday: 'short' })
}

export default function WeatherForecast() {
	const { query } = useShow({
		resource: 'weather',
		id: 59758
	})

	const { data } = query
	const record = data?.data.data

	return (
		<Card className="w-full max-w-6xl mx-auto bg-gradient-to-b from-blue-600 to-blue-400 text-white shadow-xl">
			<CardContent className="p-8">
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-5xl font-bold mb-2">{record?.location.name}</h1>
						<p className="text-xl opacity-80">{record?.location.path}</p>
					</div>
					<div className="text-right">
						<p className="text-7xl font-bold mb-2">{record?.now.temperature}°C</p>
						<p className="text-2xl">{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</p>
					</div>
				</div>

				<div className="grid grid-cols-5 gap-8 mb-8">
					<div className="flex items-center">
						<Wind className="mr-4 h-8 w-8" />
						<div>
							<p className="text-lg opacity-80">风向</p>
							<p className="text-xl font-semibold">{record?.now.windDirection}</p>
						</div>
					</div>
					<div className="flex items-center">
						<Droplet className="mr-4 h-8 w-8" />
						<div>
							<p className="text-lg opacity-80">相对湿度</p>
							<p className="text-xl font-semibold">{record?.now.humidity}%</p>
						</div>
					</div>
					<div className="flex items-center">
						<Wind className="mr-4 h-8 w-8" />
						<div>
							<p className="text-lg opacity-80">风速</p>
							<p className="text-xl font-semibold">{record?.now.windSpeed} m/s</p>
						</div>
					</div>
					<div className="flex items-center">
						<Gauge className="mr-4 h-8 w-8" />
						<div>
							<p className="text-lg opacity-80">气压</p>
							<p className="text-xl font-semibold">{record?.now.pressure}hpa</p>
						</div>
					</div>
					<div className="flex items-center">
						<Umbrella className="mr-4 h-8 w-8" />
						<div>
							<p className="text-lg opacity-80">降水量</p>
							<p className="text-xl font-semibold">{record?.now.precipitation} mm</p>
						</div>
					</div>
				</div>

				{record?.alarm.length > 0 && (
					<div className="mb-8 bg-red-500 bg-opacity-50 rounded-lg p-4 flex items-center">
						<AlertTriangle className="h-8 w-8 mr-4" />
						<div>
							<p className="font-bold text-lg mb-1">{record?.alarm[0].title}</p>
							<p className="text-sm">生效时间: {record?.alarm[0].effective}</p>
						</div>
					</div>
				)}

				<div className="grid grid-cols-7 gap-4">
					{record?.daily.map((day, index) => (
						<div key={index} className="text-center bg-blue-500 bg-opacity-30 rounded-lg p-4">
							<p className="font-bold text-lg mb-2">{index === 0 ? '今天' : getWeekday(day.date)}</p>
							<p className="text-sm mb-2">
								{day.date.split('/')[1]}/{day.date.split('/')[2]}
							</p>
							<WeatherIcon code={day.dayCode} className="mb-2" />
							<p className="text-lg mb-2">{day.dayText}</p>
							<p className="text-lg mb-2">
								{day.high}° / {day.high}°
							</p>
							<p className="text-sm">{day.dayWindDirection}</p>
							<p className="text-sm">{day.dayWindScale}</p>
						</div>
					))}
				</div>

				<p className="text-sm mt-4 text-right">最后更新: {record?.lastUpdate}</p>
			</CardContent>
		</Card>
	)
}
