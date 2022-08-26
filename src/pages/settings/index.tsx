import {
    Box,
    Flex,
    Button,
    Text,
    Link as ChakraLink,
    Badge,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { api } from '../../services/apiClient'

import { withSSRAuth } from '../../utils/withSSRAuth'

interface IResult {
    id: number
    name: string
    alias: string
    permissions: Array<{
        id: number
        name: string
        alias: string
    }>
}

export default function Settings() {
    const [rolePermission, setRolePermission] = useState<IResult[]>([])

    useEffect(() => {
        async function loadRoles() {
            const response = await api.get('/roles')
            setRolePermission(response.data)
        }

        loadRoles()
    }, [])

    return (
        <Layout title="Settings">
            <Box borderRadius={8} boxShadow="2xl" p="8">
                <Flex mb="8" justify="flex-end" gap={2} align="center">
                    <Link href={`/settings/role`} passHref>
                        <Button as="a">Criar Função</Button>
                    </Link>
                    <Link href={`/settings/permission`} passHref>
                        <Button as="a">Criar Permissão</Button>
                    </Link>
                </Flex>
                <Flex flexDirection="column">
                    {rolePermission.map((rolepermission) => (
                        <Box
                            key={rolepermission.id}
                            w="100%"
                            borderRadius={8}
                            borderColor="gray.200"
                            borderWidth="1px"
                            p="2"
                            mb="2"
                        >
                            <Link
                                href={`/settings/role/${rolepermission.id}`}
                                passHref
                            >
                                <ChakraLink color="blue.500">
                                    <Text fontWeight="bold">
                                        {rolepermission.name}
                                    </Text>
                                </ChakraLink>
                            </Link>
                            <Flex
                                flexDir={['column', 'row']}
                                flexWrap="wrap"
                            >
                                {rolepermission.permissions.map(
                                    (permission) => (
                                        <Box key={permission.id} mx="1">
                                            <Link
                                                href={`/settings/permission/${permission.id}`}
                                                passHref
                                            >
                                                <ChakraLink color="blue.500">
                                                    <Flex
                                                        flexDir={[
                                                            'column',
                                                            'row',
                                                        ]}
                                                        flexWrap="wrap"
                                                    >
                                                        <Badge>
                                                            {
                                                                permission.name
                                                            }
                                                        </Badge>
                                                        -
                                                        <Text fontSize="0.8em">
                                                            [
                                                            {
                                                                permission.alias
                                                            }
                                                            ]
                                                        </Text>
                                                    </Flex>
                                                </ChakraLink>
                                            </Link>
                                        </Box>
                                    )
                                )}
                            </Flex>
                        </Box>
                    ))}
                </Flex>
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