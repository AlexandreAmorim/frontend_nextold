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
import { useForm, Controller } from "react-hook-form";
import { Input } from "../../../components/Form/Input";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../../services/apiClient";
import { IPermission } from "../../../interface";

import { Select as SelectChakra } from "chakra-react-select";
import { useRouter } from "next/router";
import { Layout } from "../../../components/Layout";

const formSchema = yup.object().shape({
  name: yup.string().trim().required("Nome é obrigatório"),
  alias: yup.string().trim().required("Alias é obrigatório"),
});

export default function Role() {
  const colorMode = useColorModeValue("gray.50", "gray.900");
  const toast = useToast();
  const router = useRouter();
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const { register, handleSubmit, reset, formState, control } = useForm({
    resolver: yupResolver(formSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function loadPermissions() {
      const response = await api.get("/permissions");
      const rolesAp = response.data.map((permission: IPermission) => ({
        value: permission.id,
        label: permission.name,
      }));
      setPermissions(rolesAp);
    }
    loadPermissions();
  }, []);

  const handlerRolePermission = useCallback(
    async (payload: any) => {
      const { status } = await api.post("roles", payload);
      if (status === 201) {
        toast({
          title: "Sucesso",
          description: `Função criada com sucesso`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        reset();
        router.push("/settings");
      }
    },
    [toast, reset, router]
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
        onSubmit={handleSubmit(handlerRolePermission)}
      >
        <SimpleGrid columns={2} columnGap={3} rowGap={6}>
          <GridItem colSpan={[2, 1]}>
            <FormControl>
              <Input label="Nome" {...register("name")} error={errors.name} />
            </FormControl>
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <FormControl>
              <Input
                label="Alias"
                placeholder="ex: user"
                error={errors.alias}
                {...register("alias")}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isInvalid={!!errors.permissions}>
              <FormLabel htmlFor="permissions">Permissões</FormLabel>
              <Controller
                control={control}
                name="permissions"
                defaultValue={permissions.map((c: any) => c.value)}
                render={({ field: { onChange, value, ref } }) => (
                  <SelectChakra
                    inputId="permissions"
                    ref={ref}
                    value={permissions.filter((c: any) =>
                      value.includes(c.value)
                    )}
                    onChange={(val) => onChange(val.map((c: any) => c.value))}
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
