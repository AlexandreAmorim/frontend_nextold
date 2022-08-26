import { IRole } from './index'

interface IUser {
    id: string
    name: string
    username: string
    document: string
    registration: string
    email: string
    tel: string
    sex: string
    date_birth: Date
    roles: IRole[]
    active: boolean
    avatar: string
    createdAt: string
}

export default IUser