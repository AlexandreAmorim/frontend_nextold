import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { api } from "../apiClient";
import { IRole } from "../../interface";

type GetRolesResponse = {
  roles: IRole[];
};

export async function getRoles(
  page: number,
  searchQuery?: string
): Promise<GetRolesResponse> {
  const { data } = await api.get("roles", {
    params: {
      page,
      query: searchQuery,
    },
  });

  const roles = data.map((role: IRole) => {
    return {
      id: role.id,
      name: role.name,
      alias: role.alias,
    };
  });

  return roles;
}

export function useRoles(
  page: number,
  searchQuery?: string,
  options?: UseQueryOptions
) {
  return useQuery(
    ["roles", page, searchQuery],
    () => getRoles(page, searchQuery),
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
      ...options,
    }
  ) as UseQueryResult<GetRolesResponse, unknown>;
}
