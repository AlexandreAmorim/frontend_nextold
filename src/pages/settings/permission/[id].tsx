import {
  Flex,
  SimpleGrid,
  Button,
  FormControl,
  useToast,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { withSSRAuth } from "../../../utils/withSSRAuth";
import { setupAPIClient } from "../../../services/api";
import { Input } from "../../../components/Form/Input";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { api } from "../../../services/apiClient";
import { useRouter } from "next/router";
import { Layout } from "../../../components/Layout";

const formSchema = yup.object().shape({
  name: yup.string().trim().required("Nome é obrigatório"),
  alias: yup.string().trim().required("Alias é obrigatório"),
});

export default function EditPermission({ permissionData }: any) {
  const colorMode = useColorModeValue("gray.50", "gray.900");
  const toast = useToast();
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(formSchema),
  });

  const handlerEditPermission = useCallback(
    async (payload: any) => {
      const response = await api.put(`permissions/${payload.id}/edit`, payload);

      if (response.status === 201) {
        toast({
          title: "Sucesso",
          description: "Permissão editada com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        router.push("/settings");
      } else {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao editar a permissão",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
    [toast, router]
  );

  const { errors } = formState;
  return (
    <Layout title="Settings">
      <Flex
        as="form"
        borderRadius={8}
        bg={colorMode}
        ml={3}
        flexDirection="column"
        p={["6", "8"]}
        onSubmit={handleSubmit(handlerEditPermission)}
      >
        <Input
          type="hidden"
          name="id"
          defaultValue={permissionData.id}
          {...register("id")}
        />
        <SimpleGrid columns={2} columnGap={3} rowGap={6}>
          <GridItem colSpan={[2, 1]}>
            <FormControl>
              <Input
                label="Nome"
                name="name"
                {...register("name")}
                defaultValue={permissionData.name}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <FormControl>
              <Input
                label="Alias"
                name="alias"
                {...register("alias")}
                defaultValue={permissionData.alias}
              />
            </FormControl>
          </GridItem>
          <Link href={`/settings`} passHref>
            <Button>Cancel</Button>
          </Link>
          <Button colorScheme="blue" mr={3} type="submit">
            Salvar
          </Button>
        </SimpleGrid>
      </Flex>
    </Layout>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { id } = ctx.params;
    const api = setupAPIClient(ctx);

    const permissionDataResponse = await api.get(`permissions/${id}`);
    if (!permissionDataResponse.data) {
      return {
        redirect: {
          destination: "/settings",
          permanent: false,
        },
      };
    }

    return {
      props: {
        permissionData: permissionDataResponse.data,
      },
    };
  },
  {
    roles: ["administrator"],
  }
);
