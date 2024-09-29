// @ts-nocheck
import type { DataProvider } from '@refinedev/core'
import simpleRestProvider from '@refinedev/simple-rest'

const restProvider = (apiUrl: string): DataProvider => {
	const baseDataProvider = simpleRestProvider(apiUrl)

	return {
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
}

export default restProvider
