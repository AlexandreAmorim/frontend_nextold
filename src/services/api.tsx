import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'
import { AuthTokenError } from '../errors/AuthTokenError'

import { createStandaloneToast } from '@chakra-ui/toast'

const { toast } = createStandaloneToast()

let isRefreshing = false
let failedRequestsQueue = []

type CodeErrorResponse = {
    code: string
}

export function setupAPIClient(ctx = undefined) {
    let cookies = parseCookies(ctx)

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API,
        headers: {
            Authorization: `Bearer ${cookies['nextauth.token']}`,
        },
    })

    api.interceptors.response.use(
        (response) => {
            return response
        },
        (error: AxiosError) => {
            if (!!error.isAxiosError && !error.response) {
                toast({
                    status: 'error',
                    title: 'Erro na conexão',
                    description:
                        'Você está sem acesso à internet ou o servidor está off-line.',
                    duration: 5000,
                    isClosable: true,
                })
                return true
            }

            if (error.response.status === 401) {
                const dd = error.response.data as CodeErrorResponse
                if (dd?.code === 'token.expired') {
                    // renovar o token
                    cookies = parseCookies(ctx)

                    const { 'nextauth.refresh_token': token } = cookies
                    const originalConfig = error.config

                    if (!isRefreshing) {
                        isRefreshing = true

                        api.post('refresh-token', {
                            token,
                        })
                            .then((response) => {
                                const { token } = response.data

                                setCookie(ctx, 'nextauth.token', token, {
                                    // tratar/setar/destruir pelo lado do browser - NOME DO COOKIE - valor do token - opções do token
                                    maxAge: 60 * 60 * 24 * 30, // 30 dias
                                    path: '/', // Quais caminhos da app vão ter acesso
                                })
                                setCookie(
                                    ctx,
                                    'nextauth.refresh_token',
                                    response.data.refresh_token,
                                    {
                                        maxAge: 60 * 60 * 24 * 30,
                                        path: '/',
                                    }
                                )

                                api.defaults.headers[
                                    'Authorization'
                                ] = `Bearer ${token}`

                                failedRequestsQueue.forEach((request) =>
                                    request.onSuccess(token)
                                )
                                failedRequestsQueue = []
                            })
                            .catch((err) => {
                                failedRequestsQueue.forEach((request) =>
                                    request.onFailure(err)
                                )
                                failedRequestsQueue = []

                                if (typeof window === 'undefined') {
                                    signOut()
                                }
                            })
                            .finally(() => {
                                isRefreshing = false
                            })
                    }
                    return new Promise((resolve, reject) => {
                        failedRequestsQueue.push({
                            onSuccess: (token: string) => {
                                originalConfig.headers[
                                    'Authorization'
                                ] = `Bearer ${token}`

                                resolve(api(originalConfig))
                            },
                            onFailure: (err: AxiosError) => {
                                reject(err)
                            },
                        })
                    })
                } else {
                    if (typeof window === 'undefined') {
                        signOut()
                    } else {
                        return Promise.reject(new AuthTokenError())
                    }
                }
            }
            if (error.response.status === 403) {
                toast({
                    title: 'Sem permissão.',
                    description:
                        'Você tentou acessar um recurso o qual não possui permissão.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }

            if (error.response.status === 429) {
                toast({
                    status: 'error',
                    title: 'Atenção',
                    description:
                        'Você está fazendo muitas requisições para o servidor.',
                    duration: 5000,
                    isClosable: true,
                })
            }

            return Promise.reject(error)
        }
    )

    return api
}