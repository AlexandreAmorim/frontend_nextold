import { useState } from 'react'
import { api } from '../../services/apiClient'
import { withSSRAuth } from '../../utils/withSSRAuth'
import Link from 'next/link'

import { RiAddLine, RiSearch2Line } from 'react-icons/ri'
import { Pagination } from '../../components/Pagination'
import { queryClient } from '../../services/queryClient'
import { useUsers } from '../../services/hooks/useUsers'
import { Input } from '../../components/Form/Input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Layout } from '../../components/Layout'

import {
    Box,
    Flex,
    Icon,
    Spinner,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useBreakpointValue,
    Link as ChakraLink,
    Badge,
    Avatar,
    Button,
} from '@chakra-ui/react'


type SearchUsersFormData = {
    search: string
}

export default function Users() {
    const [page, setPage] = useState(1)
    const { register, handleSubmit } = useForm()
    const [searchQuery, setSearchQuery] = useState('')

    const { data, isLoading, isFetching, error } = useUsers(page, searchQuery)

    const handleSearchUsers: SubmitHandler<SearchUsersFormData> = async ({
        search,
    }) => {
        setPage(1)
        setSearchQuery(search)
    }

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    })

    async function handlePrefetchUser(userId: string) {
        await queryClient.prefetchQuery(
            ['user', userId],
            async () => {
                const response = await api.get(`users/${userId}`)

                return response.data
            },
            {
                staleTime: 1000 * 60 * 10, // 10 minutes
            }
        )
    }

    return (
        <Layout title="Usuarios">
            <Box p={['6', '8']} boxShadow="2xl" borderRadius={8} pb="4">
                <Flex mb="8" justify="space-between" align="center">
                    {!isLoading && isFetching && (
                        <Spinner size="sm" color="gray.500" ml="4" />
                    )}
                    <Flex
                        as="form"
                        onSubmit={handleSubmit(handleSearchUsers)}
                    >
                        <Input
                            name="search"
                            size="md"
                            placeholder="Buscar Usuário"
                            {...register('search')}
                        />

                        <Button
                            size="md"
                            mx="2"
                            bg="blue.500"
                            color="white"
                            disabled={isLoading}
                            isLoading={isLoading}
                            type="submit"
                        >
                            <Icon as={RiSearch2Line} fontSize="22" />
                        </Button>
                    </Flex>
                    <Link href="/users/create" passHref>
                        <Button
                            as="a"
                            size="md"
                            fontSize="md"
                            bg="blue.500"
                            color="white"
                            leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                        >
                            Novo
                        </Button>
                    </Link>
                </Flex>

                {isLoading ? (
                    <Flex justify="center">
                        <Spinner />
                    </Flex>
                ) : error ? (
                    <Flex justify="center">
                        <Text>Falha ao obter dados dos usuários.</Text>
                    </Flex>
                ) : (
                    <>
                        <Table size="sm">
                            <Thead>
                                <Tr>
                                    <Th>Avatar</Th>
                                    <Th>Usuário</Th>
                                    {isWideVersion && <Th>Email</Th>}
                                    {isWideVersion && <Th>Role</Th>}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data?.users.map((user) => {
                                    return (
                                        <Tr key={user.id}>
                                            <Td>
                                                <Avatar
                                                    size="md"
                                                    name={user?.name}
                                                    src={user?.avatar}
                                                />
                                            </Td>
                                            <Td>
                                                <Link
                                                    href={`/users/${user.id}`}
                                                    passHref
                                                >
                                                    <ChakraLink color="blue.500">
                                                        <Text fontWeight="bold">
                                                            {user.name}
                                                        </Text>
                                                    </ChakraLink>
                                                </Link>
                                            </Td>
                                            {isWideVersion && (
                                                <Td>
                                                    <Text>
                                                        {user.email}
                                                    </Text>
                                                </Td>
                                            )}
                                            {isWideVersion && (
                                                <Td>
                                                    {user.roles.map(
                                                        (role) =>
                                                            role.alias ===
                                                                'administrator' ? (
                                                                <Badge
                                                                    fontSize={[
                                                                        'sm',
                                                                        '12',
                                                                    ]}
                                                                    p={[
                                                                        '0.5',
                                                                        '0.5',
                                                                    ]}
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    colorScheme="purple"
                                                                >
                                                                    {
                                                                        role.name
                                                                    }
                                                                </Badge>
                                                            ) : (
                                                                <Badge
                                                                    fontSize={[
                                                                        'sm',
                                                                        '12',
                                                                    ]}
                                                                    p={[
                                                                        '0.5',
                                                                        '0.5',
                                                                    ]}
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    colorScheme="green"
                                                                >
                                                                    {
                                                                        role.name
                                                                    }
                                                                </Badge>
                                                            )
                                                    )}
                                                </Td>
                                            )}
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>

                        <Pagination
                            totalCountOfRegisters={data?.totalCount}
                            currentPage={page}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </Box>
        </Layout>
    )
}

export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        }
    },
    {
        roles: ['administrator'],
    }
)