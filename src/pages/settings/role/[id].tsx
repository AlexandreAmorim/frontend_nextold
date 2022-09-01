import {
  Box,
  SimpleGrid,
  Button,
  FormControl,
  useToast,
  GridItem,
  FormLabel,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { withSSRAuth } from "../../../utils/withSSRAuth";
import { setupAPIClient } from "../../../services/api";
import { Input } from "../../../components/Form/Input";
import { useForm, Controller } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../../services/apiClient";
import { IPermission } from "../../../interface";
import { useRouter } from "next/router";
import { Select as SelectChakra } from "chakra-react-select";
import { Layout } from "../../../components/Layout";

const formSchema = yup.object().shape({
  name: yup.string().trim().required("Nome é obrigatório"),
  alias: yup.string().trim().required("Alias é obrigatório"),
});

export default function EditRole({ roleData }: any) {
  const colorMode = useColorModeValue("gray.50", "gray.900");
  const toast = useToast();
  const router = useRouter();
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const { register, handleSubmit, formState, control } = useForm({
    resolver: yupResolver(formSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function loadPermissions(): Promise<void> {
      const response = await api.get("/permissions");
      const permissionsAp = response.data.map((permission: IPermission) => ({
        value: permission.id,
        label: permission.name,
      }));
      setPermissions(permissionsAp);
    }
    loadPermissions();
  }, []);

  const handlerEditRole = useCallback(
    async (payload: any) => {
      const response = await api.put(`roles/${payload.id}/edit`, payload);

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

  return (
    <Layout title="Settings">
      <Flex
        as="form"
        borderRadius={8}
        bg={colorMode}
        ml={3}
        flexDirection="column"
        p={["6", "8"]}
        onSubmit={handleSubmit(handlerEditRole)}
      >
        <Input
          type="hidden"
          name="id"
          defaultValue={roleData.id}
          {...register("id")}
        />
        <SimpleGrid columns={2} columnGap={3} rowGap={6}>
          <GridItem colSpan={[2, 1]}>
            <FormControl>
              <Input
                label="Nome"
                name="name"
                {...register("name")}
                defaultValue={roleData.name}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <FormControl>
              <Input
                label="Alias"
                name="alias"
                {...register("alias")}
                defaultValue={roleData.alias}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isInvalid={!!errors.permissions}>
              <FormLabel htmlFor="permissions">Permissões</FormLabel>
              <Controller
                control={control}
                defaultValue={roleData.permissions}
                name="permissions"
                render={({ field: { onChange, value, ref } }) => (
                  <SelectChakra
                    chakraStyles={{
                      container: () => ({
                        background: useColorModeValue("white", "gray.900")
                      })
                    }}
                    instanceId="permissions"
                    ref={ref}
                    value={permissions.filter((c: any) =>
                      value.includes(c.value)
                    )}
                    onChange={(val: any) => onChange(val.map((c: any) => c.value))}
                    options={permissions}
                    isMulti
                  />
                )}
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

    const roleDataResponse = await api.get(`roles/${id}`);
    if (!roleDataResponse.data) {
      return {
        redirect: {
          destination: "/settings",
          permanent: false,
        },
      };
    }

    return {
      props: {
        roleData: roleDataResponse.data,
      },
    };
  },
  {
    roles: ["administrator"],
  }
);
