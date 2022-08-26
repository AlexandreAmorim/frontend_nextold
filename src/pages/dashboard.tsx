import { Box, SimpleGrid, Stack } from "@chakra-ui/react";
import { Layout } from "../components/Layout";

export default function Dashboard() {
    return (
        <Layout title="Dashboard">
            <Stack spacing={3} p={6}>
                <SimpleGrid columns={2} spacing={10}>
                    <Box bg='gray.200' height='80px'>
                        Dash
                    </Box>
                </SimpleGrid>
            </Stack>
        </Layout>
    );
}
