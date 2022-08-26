import { Box, SimpleGrid, Stack } from "@chakra-ui/react";
import { Layout } from "../components/Layout";

export default function Home() {
  return (
    <Layout title="Home">
      <Stack spacing={3} p={6}>
        <SimpleGrid columns={2} spacing={10}>
          <Box bg='gray.700' height='80px'></Box>
          <Box bg='gray.700' height='80px'></Box>
        </SimpleGrid>
      </Stack>
    </Layout>
  );
}
