import {
  Badge,
  Box,
  Divider,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { setupAPIClient } from "../../../../services/api";
import { withSSRAuth } from "../../../../utils/withSSRAuth";
import { useEffect, useState } from "react";
import { api } from "../../../../services/apiClient";
import { IOption, IActing } from "../../../../interface";
import { useRouter } from "next/router";
import { Layout } from "../../../../components/Layout";

interface IPlanningPageProps {
  planningData: {
    id: string;
    budget_action: string;
    nature_expense: string;
    component: string;
    size: string;
    justification: string;
    coordinates: {
      id: string;
      name: string;
      strategic: {
        id: string;
        name: string;
        acting: {
          id: string;
          name: string;
        };
      };
    };
    consolidates: {
      id: string;
      name: string;
    };
    addresses: {
      name: string;
    };
  };
}

export default function DetailPlanning({ planningData }: IPlanningPageProps) {
  const [consolidate, setConsolidate] = useState<IOption[]>([]);
  const colorMode = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    async function loadConsolidates() {
      const { status, data } = await api.get("consolidates");
      if (status === 200) {
        const consolidateOp = data.map((consolidate: IActing) => ({
          value: consolidate.id,
          label: consolidate.name,
        }));
        setConsolidate(consolidateOp);
      }
    }
    loadConsolidates();
  }, []);

  return (
    <Layout title="Emendas Parlamentares">
      <Box borderRadius={8} p={["6", "8"]} ml={3} bg={colorMode}>
        <Box
          border="1px"
          borderRadius="lg"
          borderColor="green.200"
          p={2}
          mb={4}
        >
          <Heading size="sm">
            Secretária: {planningData.coordinates.strategic.acting.name}
          </Heading>
          <Heading size="sm">
            Programas Estratégicos: {planningData.coordinates.strategic.name}
          </Heading>
          <Heading size="sm">
            Ações Coordenadas: {planningData.coordinates.name}
          </Heading>
          <Divider my="2" />
          <SimpleGrid columns={2} columnGap={3}>
            <Text>Ação Orçamentária: {planningData.budget_action}</Text>
            <Text>Natureza de Despeza: {planningData.nature_expense}</Text>
            <Text>Porte: {planningData.size}</Text>
            <Text>Componente: {planningData.component}</Text>
            <Text>Justificativa: {planningData.justification}</Text>
          </SimpleGrid>
          <Divider my="2" />
          <SimpleGrid columns={2} columnGap={3}>
            <Text>Endereço: {planningData.addresses.name}</Text>
            <Text>
              Situação:{" "}
              {planningData.consolidates.name === "ABERTO" ? (
                <Badge colorScheme="green">
                  <Heading size="sm">{planningData.consolidates.name}</Heading>
                </Badge>
              ) : (
                <Badge colorScheme="purple">
                  <Heading size="sm">{planningData.consolidates.name}</Heading>
                </Badge>
              )}
            </Text>
          </SimpleGrid>
        </Box>
      </Box>
    </Layout>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { id } = ctx.params;

    const api = setupAPIClient(ctx);

    const planningData = await api.get(`plannings/${id}`);
    if (!planningData.data) {
      return {
        redirect: {
          destination: "/planning",
          permanent: false,
        },
      };
    }

    return {
      props: {
        planningData: planningData.data,
      },
    };
  },
  {
    roles: ["administrator"],
  }
);
