export default function Downloader() {
  return (
<div className="relative mx-auto my-6 w-2/4 max-w-3xl">
	<div
		style={{backgroundColor: 'rgba(158, 158, 158, 0.3)'}}
		className="relative flex w-full flex-col rounded-lg border-0 shadow-lg outline-none focus:outline-none"
	>
		<form >
			<div className="relative flex-auto p-6">
				<label className="form-control w-full max-w-xs">
					<div className="label">
						<span className="label-text"></span>
					</div>
					<select  className="select select-bordered">
						<option value={0}> 直连 </option>
						<option value={1}> 代理 </option>
					</select>
				</label>

				<label className="form-control w-full max-w-xs">
					<div className="label">
						<span className="label-text">协程数</span>
					</div>
					<input
						type="number"
						min="1"
						max="50"
						className="input input-bordered w-full"
					/>
				</label>

				<label className="form-control w-full max-w-xs">
					<div className="label">
						<span className="label-text">目录</span>
					</div>
					<input type="text" className="input input-bordered w-full" />
				</label>

				<label className="form-control w-full max-w-xs">
					<div className="label">
						<span className="label-text">文件名</span>
					</div>
					<input  type="text" className="input input-bordered w-full" />
				</label>

				<label className="form-control w-full">
					<div className="label">
						<span className="label-text">URL</span>
					</div>
					<input
						required
						type="text"
						className="input input-bordered w-full"
					/>
				</label>

				<label className="form-control">
					<div className="label">
						<span className="label-text">Headers</span>
					</div>
					<textarea
						className="textarea textarea-bordered h-48"
					/>
				</label>
			</div>
			<div
				className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6"
			>
				<button className="btn btn-primary">Download</button>
			</div>
		</form>
	</div>
</div>
  )
}