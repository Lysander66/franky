import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export const Analytics = () => {
	return (
		<div className="container mx-auto p-4 max-w-3xl">
			<ScrollArea className="h-[calc(100vh-2rem)] pr-4">
				{/* <h1 className="text-3xl font-bold mt-6 mb-4">主标题：项目概览</h1> */}
				<h2 className="text-2xl font-semibold mt-6 mb-3">
					<a href="https://ui.shadcn.com/" className="text-blue-600 hover:underline">
						1. shadcn/ui
					</a>
				</h2>
				<p className="text-lg mb-4">Beautifully designed components that you can copy and paste into your apps.</p>

				<h2 className="text-2xl font-semibold mt-6 mb-3">
					<a href="https://refine.dev/docs/#what-is-refine" className="text-blue-600 hover:underline">
						2. Refine
					</a>
				</h2>
				<p className="text-lg mb-4">A React Framework for building internal tools, admin panels, dashboards & B2B apps with unmatched flexibility.</p>

				<h2 className="text-2xl font-semibold mt-6 mb-3">
					<a href="https://v0.dev/" className="text-blue-600 hover:underline">
						3. v0
					</a>
				</h2>
				<p className="text-lg mb-4">Chat with v0. Generate UI with simple text prompts. Copy, paste, ship.</p>

				<h2 className="text-2xl font-semibold mt-6 mb-3">
					<a href="" className="text-blue-600 hover:underline">
						4. Others
					</a>
				</h2>
				<p>
					<a href="https://www.anthropic.com/news/claude-3-5-sonnet">Claude 3.5 Sonnet</a>
				</p>
				<p>OpenAI o1</p>
				<p>
					<a href="https://www.cursor.com/">Cursor</a>
				</p>
				<p>Copilot</p>
				<p>
					<a href="https://www.reweb.so/">Reweb</a>
				</p>

				{/* <h3 className="text-xl font-medium mt-4 mb-2">2.1 Cursor</h3>
				<p className="text-lg mb-4">页面设计简洁明了，专注于内容的呈现，避免了不必要的视觉干扰。</p>
				<h3 className="text-xl font-medium mt-4 mb-2">2.2 Copilot</h3>
				<p className="text-lg mb-4">使用 Tailwind CSS 实现响应式设计，确保在各种设备上都有良好的显示效果。</p> */}

				<Separator className="my-6" />
				<h2 className="text-2xl font-semibold mt-6 mb-3">
					<a href="#conclusion" className="text-blue-600 hover:underline">
						5. 当前看法
					</a>
				</h2>
				<h3 className="text-xl font-medium mt-4 mb-2">CRUD，前端、后端</h3>
				<h3 className="text-xl font-medium mt-4 mb-2">常见的，正则表达式、shell脚本</h3>
				<p>音视频流媒体</p>
				<p>爬虫逆向（web逆向 app逆向）</p>
			</ScrollArea>
		</div>
	)
}
