import type { DataProvider } from '@refinedev/core'
import simpleRestProvider from '@refinedev/simple-rest'

const baseDataProvider = simpleRestProvider('http://localhost:3000/api/v1')

const dataProvider: DataProvider = {
	...baseDataProvider,
	getList: async ({ resource, pagination, filters, sorters, meta }) => {
		const response = await baseDataProvider.getList({
			resource,
			pagination,
			filters,
			sorters,
			meta
		})
		return {
			data: response.data.data.items,
			total: response.data.data.total
		}
	}
}

export default dataProvider
