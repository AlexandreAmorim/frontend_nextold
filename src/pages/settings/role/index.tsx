import {
  SimpleGrid,
  Button,
  FormControl,
  useToast,
  GridItem,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/Form/Input";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../../services/apiClient";
import { IPermission } from "../../../interface";
import { useRouter } from "next/router";
import { Layout } from "../../../components/Layout";
import { ControlledSelect } from "../../../components/Form/Controlled-select";

interface FormValues {
  name: string;
  alias: string;
  permission: IPermission[];
}

const defaultValues: FormValues = {
  name: "",
  alias: "",
  permission: []
};

const formSchema = yup.object().shape({
  name: yup.string().trim().required("Nome é obrigatório"),
  alias: yup.string().trim().required("Alias é obrigatório"),
  permission: yup
    .array()
    .required("Permissão é obrigatório")
    .min(1, "Mínimo uma permissão")
    .of(
      yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      })
    ),
});

export default function Role() {
  const colorMode = useColorModeValue("gray.50", "gray.900");
  const toast = useToast();
  const router = useRouter();
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const { register, handleSubmit, reset, formState, control } = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    defaultValues
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
      const _payload = {
        ...payload,
        permissions: payload.permission ? payload.permission.map((role: any) => role.value) : [],
      }
      const { status } = await api.post("roles", _payload);

      if (status === 201) {
        toast({
          title: "Sucesso",
          description: `Função criada com sucesso`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        reset(defaultValues);
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
            <ControlledSelect<FormValues, IPermission, true>
              isMulti
              instanceId="permission"
              name="permission"
              control={control}
              label="Permissões"
              options={permissions}
            />
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
