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
import { IOption } from "../../../../interface";
import { Layout } from "../../../../components/Layout";

interface IPlanningPageProps {
  planningData: {
    id: string;
    project: string,
    name: string,
    secretary: string,
    type_work: string,
    budget_action: string,
    nature_expense: string,
    component: string,
    size: string,
    justification: string,
    cnpj: string,
    parliamentary: string,
    proposed_value: string,
    date_proposed: string,
    createdAt: string,
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
      city: string;
      neighborhood: string;
    };
  };
}

const typeworkOptions = [
  { value: 1, label: "Construção" },
  { value: 2, label: "Ampliação" },
  { value: 3, label: "Reforma" },
];

const parliamentaryOptions = [
  { value: 1, label: "Alessandro Molon - PSB - Titular" },
  { value: 2, label: "Altineu Côrtes - PL - Titular" },
  { value: 3, label: "Carlos Jordy - PL - Titular" },
];

const budgetactionOptions = [
  { value: 1, label: "Ação I" },
  { value: 2, label: "Ação II" },
  { value: 3, label: "Ação III" },
];

const natureexpenseOptions = [
  { value: 1, label: "GND 3" },
  { value: 2, label: "GND 4" },
];

export default function DetailPlanning({ planningData }: IPlanningPageProps) {
  const colorMode = useColorModeValue("gray.50", "gray.900");

  const planning = {
    secretary: planningData?.coordinates?.strategic?.acting?.name,
    strategic: planningData?.coordinates?.strategic?.name,
    coordinates: planningData?.coordinates?.name,
    project: planningData?.project,
    secretaryEt: planningData?.secretary,
    cnpj: planningData?.cnpj,
    proposed_value: planningData?.proposed_value,

    date_proposed: new Date(planningData?.date_proposed).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),

    budget_action: budgetactionOptions.filter((p: IOption) => p.value === planningData?.budget_action),
    nature_expense: natureexpenseOptions.filter((p: IOption) => p.value === planningData?.nature_expense),
    parliamentary: parliamentaryOptions.filter((p: IOption) => p.value === planningData?.parliamentary),
    type_work: typeworkOptions.filter((p: IOption) => p.value === planningData?.type_work),
  }

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
            Secretária: {planning?.secretary}
          </Heading>
          <Heading size="sm">
            Programas Estratégicos: {planning?.strategic}
          </Heading>
          <Heading size="sm">
            Ações Coordenadas: {planning?.coordinates}
          </Heading>
          <Divider my="2" />
          <SimpleGrid columns={2} columnGap={3}>
            <Text>Nome do Projeto: {planning?.project}</Text>
            <Text>Secretaria: {planning?.secretary}</Text>
            <Text>Tipo de Obra: {planning?.type_work[0].label}</Text>
            <Text>Porte: {planningData?.size}</Text>
            <Text>Componente: {planningData?.component}</Text>
            <Text>Justificativa: {planningData?.justification}</Text>
          </SimpleGrid>
          <Divider my="2" />
          <SimpleGrid columns={2} columnGap={3}>
            <Text>Cnpj: {planning?.cnpj}</Text>
            <Text>Parlamentar: {planning?.parliamentary[0]?.label}</Text>
            <Text>Ação Orçamentária: {planning?.budget_action[0]?.label}</Text>
            <Text>Valor Proposta: {planning?.proposed_value}</Text>
            <Text>Data da Proposta: {planning?.date_proposed}</Text>
            <Text>Natureza de Resposta: {planning?.nature_expense[0]?.label}</Text>
          </SimpleGrid>
          <Divider my="2" />
          <SimpleGrid columns={1} >
            <Text>Endereço: {planningData?.addresses?.name} - {planningData?.addresses?.neighborhood}</Text>
            <Text>Bairro: {planningData?.addresses?.city}</Text>
          </SimpleGrid>
          <Divider my="2" />
          <SimpleGrid columns={2} columnGap={3}>
            <Text>
              Situação:{" "}
              {planningData?.consolidates?.name === "ABERTO" ? (
                <Badge colorScheme="green">
                  {planningData?.consolidates?.name}
                </Badge>
              ) : (
                <Badge colorScheme="purple">
                  {planningData?.consolidates?.name}
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
