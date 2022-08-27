import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query'
import { api } from '../apiClient'
import { IUser } from '../../interface'

type GetUsersResponse = {
    totalCount: number
    users: IUser[]
}

export async function getUsers(
    page: number,
    searchQuery?: string
): Promise<GetUsersResponse> {
    const { data } = await api.get('users', {
        params: {
            page,
            query: searchQuery,
        },
    })

    const totalCount = data.totalCount

    const users = data.data.map((user: IUser) => {
        return {
            id: user.id,
            name: user.name,
            document: user.document,
            email: user.email,
            roles: user.roles,
            avatar: user.avatar,
            createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
        }
    })

    const response = {
        users,
        totalCount,
    }
    return response
}

export function useUsers(
    page: number,
    searchQuery?: string,
    options?: UseQueryOptions
) {
    return useQuery(
        ['users', page, searchQuery],
        () => getUsers(page, searchQuery),
        {
            staleTime: 1000 * 60 * 10, // 10 minutes
            ...options,
        }
    ) as UseQueryResult<GetUsersResponse, unknown>
}