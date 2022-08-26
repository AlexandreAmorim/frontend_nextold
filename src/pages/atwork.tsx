import { Text } from '@chakra-ui/react'
import { withSSRAuth } from '../utils/withSSRAuth'
import { Layout } from '../components/Layout'

export default function Atwork() {
    return (
        <Layout title="Em Contrução">
            <Text fontSize="lg" mb="4">
                Em contrução
            </Text>
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
        roles: ['administrator', 'user'],
    }
)