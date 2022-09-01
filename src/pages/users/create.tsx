import {
  Flex,
  Button,
  FormControl,
  FormLabel,
  GridItem,
  SimpleGrid,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { parseDate, validateCpf } from "../../utils";

import { Input } from "../../components/Form/Input";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { useEffect, useState } from "react";
import { IRole } from "../../interface";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { InputMasked } from "../../components/Form/InputMasked";

import { Select as SelectChakra } from "chakra-react-select";

import { AxiosError } from "axios";
import { Layout } from "../../components/Layout";

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
  sex: yup.string().required().typeError("Sexo é obrigatório"),
  active: yup.boolean().required().typeError("Ativo é obrigatório")
});

export default function CreateUser() {
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

  const createUser = useMutation(
    async (user: CreateUserFormData) => {
      const { data } = await api.post("users", {
        user: {
          ...user,
          created_at: new Date(),
        },
      });

      return data.user;
    },
    {
      onError: (err: AxiosError) => {
        toast({
          status: "error",
          title: "Erro ao criar usuário",
          description: "Ocorreu um erro ao criar o usuário",
          duration: 5000,
          isClosable: true,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );

  const handleCreateUser: SubmitHandler<any> = async (data) => {
    const _user = {
      ...data,
      date_birth: data.date_birth,
      tel: data.tel,
      document: data.document.replace(/\D/g, ""),
      registration: data.registration.replace(/\D/g, ""),
    };

    try {
      await createUser.mutateAsync(_user);

      toast({
        description: "Usuário criado sucesso",
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
        onSubmit={handleSubmit(handleCreateUser)}
      >
        <SimpleGrid columns={2} columnGap={3} rowGap={6}>
          <GridItem colSpan={2}>
            <Input
              name="name"
              error={errors.name}
              label="Nome Completo"
              {...register("name")}
            />
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <InputMasked
              mask="999.999.999-99"
              name="document"
              label="Cpf"
              error={errors.document}
              {...register("document")}
            />
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <InputMasked
              mask="99/99/9999"
              name="date_birth"
              label="Data de Nascimento"
              {...register("date_birth")}
            />
          </GridItem>
          <GridItem colSpan={2}>
            <Input
              name="email"
              label="Email"
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
              {...register("registration")}
            />
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <InputMasked
              mask="(99) 99999-9999"
              name="tel"
              label="Telefone"
              {...register("tel")}
            />
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <FormControl isInvalid={!!errors.sex}>
              <FormLabel htmlFor="sex">Sexo</FormLabel>
              <Controller
                control={control}
                defaultValue={sexoOptions.map((c) => c.value)}
                name="sex"
                render={({ field: { onChange, value, ref } }) => (
                  <SelectChakra
                    chakraStyles={{
                      control: (provided) => ({
                        ...provided,
                        background: useColorModeValue("white", "gray.900")
                      })
                    }}
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
                defaultValue={activeOptions.map((c) => c.value)}
                name="active"
                render={({ field: { onChange, value, ref } }) => (
                  <SelectChakra
                    chakraStyles={{
                      control: (provided) => ({
                        ...provided,
                        background: useColorModeValue("white", "gray.900")
                      })
                    }}
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
                defaultValue={roles.map((c: any) => c.value)}
                name="roles"
                render={({ field: { onChange, value, ref } }) => (
                  <SelectChakra
                    chakraStyles={{
                      control: (provided) => ({
                        ...provided,
                        background: useColorModeValue("white", "gray.900")
                      })
                    }}
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
    return {
      props: {},
    };
  },
  {
    roles: ["administrator"],
  }
);
