import { useToast } from '@chakra-ui/react'
import Router from 'next/router'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { createContext, ReactNode, useEffect, useState } from 'react'

import { api } from '../services/apiClient'

type User = {
    name: string
    email: string
    avatar: string
    permissions: string[]
    roles: string[]
}

type SignInCredentials = {
    email: string
    password: string
}

type AuthContextData = {
    signIn: (credentials: SignInCredentials) => Promise<void>
    signOut: () => void
    user: User
    isAuthenticated: boolean
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

let authChannel: BroadcastChannel

export function signOut() {
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refresh_token')

    authChannel.postMessage({ type: 'signOut' })

    Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
    const toast = useToast()
    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user

    useEffect(() => {
        authChannel = new BroadcastChannel('auth')

        authChannel.onmessage = (message) => {
            switch (message.data) {
                case 'signOut':
                    signOut()
                    break
                default:
                    break
            }
        }
    }, [])

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies()

        if (token) {
            api.get('users/me')
                .then((response) => {
                    const { name, email, avatar, permissions, roles } =
                        response.data

                    setUser({ name, email, avatar, permissions, roles })
                })
                .catch(() => {
                    signOut()
                })
        }
    }, [])

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post('signin', {
                email,
                password,
            })

            const { name, avatar, permissions, refresh_token, roles, token } =
                response.data

            setCookie(undefined, 'nextauth.token', token, {
                // tratar/setar/destruir pelo lado do browser - NOME DO COOKIE - valor do token - opções do token
                maxAge: 60 * 60 * 24 * 30, // 30 dias
                path: '/', // Quais caminhos da app vão ter acesso
            })
            setCookie(undefined, 'nextauth.refresh_token', refresh_token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
            })

            setUser({
                name,
                email,
                avatar,
                permissions,
                roles,
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            Router.push('/dashboard')
        } catch (err) {
            if (err.response.status === 404 || err.response.status === 400) {
                toast({
                    title: 'Erro de Autenticação.',
                    description: 'E-mail ou senha inválido.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        }
    }

    return (
        <AuthContext.Provider
            value={{ signIn, signOut, isAuthenticated, user }}
        >
            {children}
        </AuthContext.Provider>
    )
}