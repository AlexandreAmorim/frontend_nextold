import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query'
import { api } from '../apiClient'
import { IPlanning } from '../../interfaces'

type GetPlanningsResponse = {
    totalCount: number
    plannings: IPlanning[]
}

export async function getPlannings(
    page: number,
    searchQuery?: string
): Promise<GetPlanningsResponse> {
    const { data } = await api.get('plannings', {
        params: {
            page,
            query: searchQuery,
        },
    })

    const totalCount = data.totalCount

    const plannings = data.data.map((planning: IPlanning) => {
        return {
            id: planning.id,
            consolidates: planning.consolidates,
            createdAt: new Date(planning.createdAt).toLocaleDateString(
                'pt-BR',
                {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }
            ),
        }
    })

    const response = {
        plannings,
        totalCount,
    }
    return response
}

export function usePlannings(
    page: number,
    searchQuery?: string,
    options?: UseQueryOptions
) {
    return useQuery(
        ['plannings', page, searchQuery],
        () => getPlannings(page, searchQuery),
        {
            staleTime: 1000 * 60 * 10, // 10 minutes
            ...options,
        }
    ) as UseQueryResult<GetPlanningsResponse, unknown>
}