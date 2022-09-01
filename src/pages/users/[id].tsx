import {
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  SimpleGrid,
  useToast,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { formatDate, parseDate, validateCpf } from "../../utils";

import { Input } from "../../components/Form/Input";
import { api } from "../../services/apiClient";
import { setupAPIClient } from "../../services/api";
import { useEffect, useState } from "react";
import { IRole } from "../../interface";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { InputMasked } from "../../components/Form/InputMasked";

import { Select as SelectChakra } from "chakra-react-select";

import { AxiosError } from "axios";
import { queryClient } from "../../services/queryClient";
import { Layout } from "../../components/Layout";
import { chakraStyles } from "../../components/Form/SelectStyle";

interface CreateUserFormData {
  id: string;
  name: string;
  username: string;
  document: string;
  registration: string;
  email: string;
  tel: string;
  sex: string;
  date_birth: Date;
  roles: any[];
  active: boolean;
}

const sexoOptions = [
  { value: "masculino", label: "MASCULINO" },
  { value: "feminino", label: "FEMININO" },
];

const activeOptions = [
  { value: true, label: "ATIVO" },
  { value: false, label: "BLOQUEADO" },
];

const formSchema = yup.object().shape({
  name: yup.string().trim().required("Nome é obrigatório"),
  document: yup
    .string()
    .test("is-valid", "Insira um CPF válido", (value) =>
      validateCpf(value, true)
    ),
  date_birth: yup
    .string()
    .transform(parseDate)
    .typeError("Insira uma data válida"),
  email: yup
    .string()
    .trim()
    .required("E-mail obrigatório")
    .email("E-mail inválido"),
});

export default function EditUser({ userData }: any) {
  const colorMode = useColorModeValue("gray.50", "gray.900");
  const toast = useToast();
  const router = useRouter();
  const [roles, setRoles] = useState<IRole[]>([]);
  const { register, handleSubmit, formState, control } = useForm({
    resolver: yupResolver(formSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    async function loadRules(): Promise<void> {
      const response = await api.get("/roles");
      const rolesAp = response.data.map((role: IRole) => ({
        value: role.id,
        label: role.name,
      }));
      setRoles(rolesAp);
    }
    loadRules();
  }, []);

  const userEdit = useMutation(
    async (data: any) => {
      const response = await api.post(`users/${data.id}`, {
        user: { ...data },
      });
      response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
      onError: (error: AxiosError) => {
        toast({
          title: "Houve um erro ao editar usuário",
          status: "error",
          position: "top",
          duration: 3000,
        });
      },
    }
  );

  const handleEditUser: SubmitHandler<any> = async (data) => {
    const _user = {
      ...data,
      date_birth: data.date_birth,
      tel: data.tel,
      document: data.document.replace(/\D/g, ""),
      registration: data.registration.replace(/\D/g, ""),
    };

    try {
      await userEdit.mutateAsync(_user);

      toast({
        description: "Usuário editado sucesso",
        status: "success",
        position: "top",
      });

      router.push("/users");
    } catch {
      console.log("Error happened");
    }
  };

  return (
    <Layout title="Usuários">
      <Flex
        as="form"
        borderRadius={8}
        bg={colorMode}
        p={["6", "8"]}
        mb={2}
        ml={3}
        flexDirection="column"
        onSubmit={handleSubmit(handleEditUser)}
      >
        <SimpleGrid columns={2} columnGap={3} rowGap={6}>
          <Input
            type="hidden"
            name="id"
            defaultValue={userData.id}
            {...register("id")}
          />
          <GridItem colSpan={2}>
            <Input
              name="name"
              label="Nome Completo"
              defaultValue={userData.name}
              error={errors.name}
              {...register("name")}
            />
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <InputMasked
              mask="999.999.999-99"
              name="document"
              label="Cpf"
              defaultValue={userData.document}
              error={errors.document}
              {...register("document")}
            />
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <InputMasked
              mask="99/99/9999"
              name="date_birth"
              label="Data de Nascimento"
              defaultValue={formatDate(userData.date_birth)}
              error={errors.date_birth}
              {...register("date_birth")}
            />
          </GridItem>
          <GridItem colSpan={2}>
            <Input
              name="email"
              label="Email"
              defaultValue={userData.email}
              error={errors.email}
              {...register("email")}
              maxLength={100}
            />
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <InputMasked
              mask="999999"
              name="registration"
              label="Identidade"
              defaultValue={userData.registration}
              {...register("registration")}
            />
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <InputMasked
              mask="(99) 99999-9999"
              name="tel"
              label="Telefone"
              defaultValue={userData.tel}
              error={errors.tel}
              {...register("tel")}
            />
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <FormControl isInvalid={!!errors.sex}>
              <FormLabel htmlFor="sex">Sexo</FormLabel>
              <Controller
                control={control}
                defaultValue={userData.sex}
                name="sex"
                render={({ field: { onChange, value, ref } }) => (
                  <SelectChakra
                    chakraStyles={chakraStyles}
                    instanceId="sex"
                    ref={ref}
                    value={sexoOptions.find((c) => value === c.value)}
                    onChange={(val: any) => onChange(val.value)}
                    options={sexoOptions}
                  />
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <FormControl isInvalid={!!errors.active}>
              <FormLabel htmlFor="active">Status </FormLabel>
              <Controller
                control={control}
                defaultValue={userData.active}
                name="active"
                render={({ field: { onChange, value, ref } }) => (
                  <SelectChakra
                    chakraStyles={chakraStyles}
                    instanceId="active"
                    ref={ref}
                    value={activeOptions.find((c) => value === c.value)}
                    onChange={(val: any) => onChange(val.value)}
                    options={activeOptions}
                  />
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isInvalid={!!errors.roles}>
              <FormLabel htmlFor="roles">Função</FormLabel>
              <Controller
                control={control}
                defaultValue={userData.roles}
                name="roles"
                render={({ field: { onChange, value, ref } }) => (
                  <SelectChakra
                    chakraStyles={chakraStyles}
                    instanceId="roles"
                    ref={ref}
                    value={roles.filter((c: any) => value.includes(c.value))}
                    onChange={(val: any) => onChange(val.map((c: any) => c.value))}
                    options={roles}
                    isMulti
                  />
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <Button
              type="submit"
              w="full"
              bg="blue.500"
              color="white"
              _hover={{
                bg: "blue.600",
              }}
              isLoading={formState.isSubmitting}
            >
              Salvar
            </Button>
          </GridItem>
        </SimpleGrid>
      </Flex>
    </Layout>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { id } = ctx.params;

    const api = setupAPIClient(ctx);

    const userDataResponse = await api.get(`users/${id}`);
    if (!userDataResponse.data) {
      return {
        redirect: {
          destination: "/users",
          permanent: false,
        },
      };
    }

    return {
      props: {
        userData: userDataResponse.data,
      },
    };
  },
  {
    roles: ["administrator"],
  }
);
