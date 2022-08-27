import { Button, Flex, Stack, Text, useToast } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { api } from '../services/apiClient'
import Link from 'next/link'

import { Input } from '../components/Form/Input'

type ForGotFormData = {
    password: string
    password_confirmation: string
}

const resetFormSchema = yup.object().shape({
    password: yup
        .string()
        .required('A Senha é obrigatória')
        .matches(
            /^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            'Precisa: no mínimo 6 caracteres; conter letras maiúsculas, minúsculas, números e caracteres especiais.'
        ),
    password_confirmation: yup
        .string()
        .required()
        .oneOf([yup.ref('password'), ''], 'As senhas não conferem'),
})

export default function Reset() {
    const router = useRouter()
    const { token } = router.query
    const toast = useToast()

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(resetFormSchema),
    })

    const { errors } = formState

    const handleReset: SubmitHandler<ForGotFormData> = async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 2000))

        if (!token) {
            toast({
                status: 'error',
                title: 'Erro',
                description: 'O link para criar uma nova senha não é válido.',
                duration: 5000,
                isClosable: true,
            })
            return
        }
        const { password } = values

        try {
            const response = await api.post('reset', {
                token,
                password,
            })

            if (response.status === 200) {
                toast({
                    status: 'success',
                    title: 'Sucesso!',
                    description: 'Senha criada com sucesso!',
                    duration: 5000,
                    isClosable: true,
                })
            }
        } catch (err) {
            if (!!err.isAxiosError && !err.response) {
                toast({
                    status: 'error',
                    title: 'Erro na conexão',
                    description:
                        'Você está sem acesso à internet ou o servidor está off-line.',
                    duration: 5000,
                    isClosable: true,
                })
            }

            if (err.response && err.response.status === 429) {
                toast({
                    status: 'error',
                    title: 'Opsss!',
                    description:
                        'Você excedeu o limite de requisições para o servidor.',
                    duration: 5000,
                    isClosable: true,
                })
                return
            }

            if (err.response && err.response.status === 400) {
                const { message } = Array.isArray(err.response.data)
                    ? err.response.data[0]
                    : err.response.data
                toast({
                    status: 'error',
                    title: message,
                })
                return
            }
        }
    }

    return (
        <Flex w="100vw" h="100vh" align="center" justify="center">
            <Flex
                as="form"
                width="100%"
                maxWidth={360}
                borderWidth={1}
                p="8"
                borderRadius={8}
                flexDir="column"
                onSubmit={handleSubmit(handleReset)}
            >
                <Text
                    letterSpacing="tight"
                    lineHeight="normal"
                    fontSize={['2xl', '3xl']}
                    mb="8"
                    fontWeight="extrabold"
                    maxW={430}
                >
                    Recuperar acesso
                </Text>
                <Stack spacing="4">
                    <Input
                        name="password"
                        type="password"
                        label="Nova Senha"
                        error={errors.password}
                        {...register('password')}
                    />
                    <Input
                        name="password_confirmation"
                        type="password"
                        label="Confirmar Senha"
                        error={errors.password_confirmation}
                        {...register('password_confirmation')}
                    />
                </Stack>

                <Button type="submit" mt="6" isLoading={formState.isSubmitting}>
                    Salvar
                </Button>
                <Link href="/forgot">Esqueci minha senha</Link>
            </Flex>
        </Flex>
    )
}