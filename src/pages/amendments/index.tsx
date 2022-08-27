import { useState } from "react";
import { withSSRAuth } from "../../utils/withSSRAuth";
import Link from "next/link";
import { RiAddLine, RiSearch2Line, RiEdit2Line } from "react-icons/ri";
import { Pagination } from "../../components/Pagination";
import { usePlannings } from "../../services/hooks/usePlannings";
import { Input } from "../../components/Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Layout } from "../../components/Layout";
import {
  Box,
  Flex,
  Icon,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  Link as ChakraLink,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { Eye, PencilSimpleLine } from "phosphor-react";

type SearchPlanningFormData = {
  search: string;
};

export default function Amendments() {
  const colorMode = useColorModeValue("gray.50", "gray.900");
  const [page, setPage] = useState(1);
  const { register, handleSubmit } = useForm();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetching, error } = usePlannings(
    page,
    searchQuery
  );

  const handleSearchPlanning: SubmitHandler<SearchPlanningFormData> = async ({
    search,
  }) => {
    setPage(1);
    setSearchQuery(search);
  };

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Layout title="Plan.Orçamentário">
      <Flex
        borderRadius={8}
        bg={colorMode}
        p={["6", "8"]}
        ml={3}
        flexDirection="column"
      >
        <Flex mb="8" justify="space-between" align="center">
          {!isLoading && isFetching && (
            <Spinner size="sm" color="gray.500" ml="4" />
          )}

          <Flex as="form" onSubmit={handleSubmit(handleSearchPlanning)}>
            <Input
              name="search"
              size="md"
              placeholder="Buscar Planejamento"
              {...register("search")}
            />

            <Button
              size="md"
              mx="2"
              bg="blue.500"
              color="white"
              disabled={isLoading}
              isLoading={isLoading}
              type="submit"
            >
              <Icon as={RiSearch2Line} fontSize="22" />
            </Button>
          </Flex>
          <Link href="/amendments/create" passHref>
            <Button
              as="a"
              size="md"
              fontSize="md"
              bg="blue.500"
              color="white"
              leftIcon={<Icon as={RiAddLine} fontSize="20" />}
            >
              Novo
            </Button>
          </Link>
        </Flex>

        {isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : error ? (
          <Flex justify="center">
            <Text>Falha ao obter dados dos planejamentos.</Text>
          </Flex>
        ) : (
          <>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Cod</Th>
                  {isWideVersion && <Th>Status</Th>}
                  {isWideVersion && <Th>Data de Cadastro</Th>}
                  <Th align="center">Editar</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.plannings.map((planning) => {
                  const [ref] = planning.id.split("-");
                  return (
                    <Tr key={planning.id}>
                      <Td>
                        <Link
                          href={`/amendments/plannings/detail/${planning.id}`}
                          passHref
                        >
                          <ChakraLink color="green.500">
                            <Eye size={22} />
                          </ChakraLink>
                        </Link>
                      </Td>

                      <Td>
                        <Text size="md">{ref.toLocaleUpperCase()}</Text>
                      </Td>
                      {isWideVersion && (
                        <Td>
                          <Text>{planning.consolidates.name}</Text>
                        </Td>
                      )}
                      {isWideVersion && (
                        <Td>
                          <Text>{planning.createdAt}</Text>
                        </Td>
                      )}
                      <Td>
                        <Flex justifyContent="space-between">
                          <Link
                            href={`/amendments/plannings/${planning.id}`}
                            passHref
                          >
                            <ChakraLink color="blue.500">
                              <PencilSimpleLine size={22} />
                            </ChakraLink>
                          </Link>
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            <Pagination
              totalCountOfRegisters={data?.totalCount}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </Flex>
    </Layout>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ["administrator"],
  }
);
