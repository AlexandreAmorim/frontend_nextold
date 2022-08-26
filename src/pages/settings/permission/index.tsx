import {
    Box,
    SimpleGrid,
    Button,
    FormControl,
    useToast,
    GridItem,
} from '@chakra-ui/react'
import Link from 'next/link'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Input } from '../../../components/Form/Input'
import { useCallback } from 'react'
import { api } from '../../../services/apiClient'
import { Layout } from '../../../components/Layout'

const formSchema = yup.object().shape({
    name: yup.string().trim().required('Nome é obrigatório'),
    alias: yup.string().trim().required('Alias é obrigatório'),
})

export default function Permission() {
    const toast = useToast()
    const { register, handleSubmit, reset, formState } = useForm({
        resolver: yupResolver(formSchema),
    })

    const { errors } = formState

    const handlerCreatePermission = useCallback(
        async (payload: any) => {
            const { status } = await api.post('permissions', payload)
            if (status === 201) {
                toast({
                    title: 'Sucesso',
                    description: `Permissão criada com sucesso`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                reset()
            }
        },
        [reset, toast]
    )

    return (
        <Layout title="Settings">
            <Box
                as="form"
                borderRadius={8}
                boxShadow="2xl"
                p={['6', '8']}
                onSubmit={handleSubmit(handlerCreatePermission)}
            >
                <SimpleGrid columns={2} columnGap={3} rowGap={6}>
                    <GridItem colSpan={[2, 1]}>
                        <FormControl>
                            <Input
                                label="Nome"
                                error={errors.name}
                                {...register('name')}
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={[2, 1]}>
                        <FormControl>
                            <Input
                                label="Alias"
                                error={errors.alias}
                                placeholder="ex: user.list"
                                {...register('alias')}
                            />
                        </FormControl>
                    </GridItem>
                    <Link href={`/settings`} passHref>
                        <Button>Cancel</Button>
                    </Link>
                    <Button colorScheme="blue" mr={3} type="submit">
                        Salvar
                    </Button>
                </SimpleGrid>
            </Box>
        </Layout>
    )
}