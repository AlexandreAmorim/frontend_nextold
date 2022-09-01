import {
  Box,
  Button,
  Flex,
  FormLabel,
  GridItem,
  Heading,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useToast,
  FormControl,
  useColorModeValue,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { } from "@chakra-ui/react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { withSSRAuth } from "../../../utils/withSSRAuth";
import { useEffect, useState } from "react";
import { api } from "../../../services/apiClient";
import { IOption, IActing } from "../../../interface";
import { Input } from "../../../components/Form/Input";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { queryClient } from "../../../services/queryClient";
import { useRouter } from "next/router";
import { Layout } from "../../../components/Layout";
import { Select as SelectChakra } from "chakra-react-select";
import { InputMasked } from "../../../components/Form/InputMasked";
import { parseDate } from "../../../utils";
import { InputCurrency } from "../../../components/Form/InputCurrency";

const cityOptions = [
  { value: "Rio de Janeiro", label: "Rio de Janeiro" },
  { value: "São Gonçalo", label: "São Gonçalo" },
  { value: "Duque de Caxias", label: "Duque de Caxias" },
  { value: "Mesquita", label: "Mesquita" },
];

const sizeOptions = [
  { value: "Porte I", label: "Porte I" },
  { value: "Porte II", label: "Porte II" },
  { value: "Porte III", label: "Porte III" },
];

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

interface IPlanningPageProps {
  planningData: {
    id: string;
    type: string;
    secretary: string;
    type_work: string;
    component: string;
    size: string;
    justification: string;

    zip: string;
    neighborhood: string;
    city: string;
    cnes: string;
    establishment: string;

    party: string;
    parliamentary: string;
    budget_action: string;
    proposed_value: string;
    date_proposed: string;
    nature_expense: string;

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
  };
}

const formSchema = yup.object().shape({
  project: yup.string().required("Nome do projeto é obrigatório"),
  secretary: yup.number().required().typeError("Secretária é obrigatório"),
  typework: yup.number().required().typeError("Tipo de obra é obrigatório"),
  size: yup.string().required().typeError("Porte é obrigatório"),
  component: yup.string().trim().required("Componente é obrigatório"),
  zip: yup.string().trim().required("Cep é obrigatório"),
  establishment: yup
    .string()
    .trim()
    .required("Nome Estabelecimento é obrigatório"),
  nature_expense: yup.number().required("Natureza da Resposta é obrigatório"),
  proposed_value: yup.string().required("Valor é obrigatório"),
  date_proposed: yup
    .string()
    .transform(parseDate)
    .typeError("Insira uma data válida"),
});

export default function Planning() {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const [type, setType] = useState("UBS");
  const [acting, setActing] = useState<IOption[]>([]);
  const [coordinate, setCoordinate] = useState<any>([]);

  const colorMode = useColorModeValue("gray.50", "gray.900");
  const colorModeVm = useColorModeValue("white", "gray.900");

  const {
    handleSubmit,
    formState,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    async function loadActings() {
      const { status, data } = await api.get("actings");
      if (status === 200) {
        const actingOp = data.map((acting: IActing) => ({
          value: acting.id,
          label: acting.name,
        }));
        setActing(actingOp);
      }
    }
    loadActings();
  }, []);

  useEffect(() => {
    async function loadCoordinate() {
      const { status, data } = await api.get(`coordinates/${id}`);
      if (status === 200) {
        setCoordinate(data);
      }
    }
    loadCoordinate();
  }, [id]);

  const planningCreate = useMutation(
    async (data: any) => {
      const response = await api.post(`plannings`, {
        planning: { ...data },
      });
      response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("plannings");
      },
      onError: (error: AxiosError) => {
        console.log("ERRADO ", error.response.data);
        toast({
          title: "Houve um erro ao criar",
          status: "error",
          position: "top",
          duration: 3000,
        });
      },
    }
  );

  const handleCreatePlanning: SubmitHandler<any> = async (data) => {
    const _planning = {
      ...data,
      name: type,
      type_work: data.typework,
      coordinate_id: id,
      date_proposed: data.date_proposed,
    };

    console.log("PLANNING ", _planning);

    try {
      await planningCreate.mutateAsync(_planning);

      toast({
        description: "Criado sucesso",
        status: "success",
        position: "top",
      });

      router.push("/amendments/create");
    } catch {
      console.log("Error happened");
    }
  };

  return (
    <Layout title="Emendas Parlamentares">
      <Flex mb="8" justify="center" align="center">
        <Flex
          as="form"
          width="100%"
          maxWidth={800}
          bg={colorMode}
          borderRadius={8}
          p={[6, 8]}
          flexDirection="column"
          onSubmit={handleSubmit(handleCreatePlanning)}
        >
          <Box
            border="1px"
            borderRadius="md"
            borderColor="green.200"
            p={2}
            mb={4}
          >
            <Heading size="md">{coordinate?.name}</Heading>
          </Box>
          <Tabs>
            <TabList>
              <Tab key={1}>Projeto</Tab>
              <Tab key={2}>Localização</Tab>
              <Tab key={3}>Emenda</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={2} columnGap={3} rowGap={6}>
                  <GridItem colSpan={2}>
                    <Input
                      name="project"
                      label="Nome Projeto"
                      error={errors.project}
                      {...register("project")}
                    />
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <FormControl isInvalid={!!errors.secretary}>
                      <FormLabel htmlFor="secretary">Secretaria</FormLabel>
                      <Controller
                        control={control}
                        name="secretary"
                        defaultValue={acting.map((c) => c.value)}
                        render={({ field: { onChange, value, ref } }) => (
                          <SelectChakra
                            chakraStyles={{
                              container: (provided) => ({
                                ...provided,
                                background: colorModeVm
                              })
                            }}
                            instanceId="secretary"
                            ref={ref}
                            onChange={(v: any) => onChange(v.value)}
                            options={acting}
                            value={acting.find((c) => value === c.value)}
                          />
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <FormControl isInvalid={!!errors.typework}>
                      <FormLabel htmlFor="typework">Tipo de Obra</FormLabel>
                      <Controller
                        control={control}
                        defaultValue={typeworkOptions.map((c) => c.value)}
                        name="typework"
                        render={({ field: { onChange, value, ref } }) => (
                          <SelectChakra
                            chakraStyles={{
                              container: (provided) => ({
                                ...provided,
                                background: colorModeVm
                              })
                            }}
                            instanceId="typework"
                            ref={ref}
                            value={typeworkOptions.find(
                              (c) => value === c.value
                            )}
                            onChange={(val: any) => onChange(val.value)}
                            options={typeworkOptions}
                          />
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <FormControl isInvalid={!!errors.size}>
                      <FormLabel htmlFor="size">Porte</FormLabel>
                      <Controller
                        control={control}
                        defaultValue={sizeOptions.map((c) => c.value)}
                        name="size"
                        render={({ field: { onChange, value, ref } }) => (
                          <SelectChakra
                            chakraStyles={{
                              container: (provided) => ({
                                ...provided,
                                background: colorModeVm
                              })
                            }}
                            instanceId="size"
                            ref={ref}
                            value={sizeOptions.find((c) => value === c.value)}
                            onChange={(val: any) => onChange(val.value)}
                            options={sizeOptions}
                          />
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <Input
                      name="component"
                      label="Componente"
                      error={errors.component}
                      {...register("component")}
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormLabel htmlFor="justification">Justificativa</FormLabel>
                    <Textarea
                      bgColor={colorModeVm}
                      _hover={{
                        bgColor: { colorModeVm }
                      }}
                      name="justification"
                      placeholder="Uma breve descrição"
                      {...register("justification")}
                      maxLength={200}
                    />
                  </GridItem>
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={2} columnGap={3} rowGap={6}>
                  <GridItem colSpan={[2, 1]}>
                    <InputMasked
                      mask="99999-999"
                      name="zip"
                      label="CEP"
                      error={errors.zip}
                      {...register("zip")}
                    />
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <FormControl isInvalid={!!errors.city}>
                      <FormLabel htmlFor="city">Município</FormLabel>
                      <Controller
                        control={control}
                        defaultValue={cityOptions.map((c) => c.value)}
                        name="city"
                        render={({ field: { onChange, value, ref } }) => (
                          <SelectChakra
                            chakraStyles={{
                              container: (provided) => ({
                                ...provided,
                                background: colorModeVm
                              })
                            }}
                            instanceId="city"
                            ref={ref}
                            value={cityOptions.find((c) => value === c.value)}
                            onChange={(val: any) => onChange(val.value)}
                            options={cityOptions}
                          />
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <Input
                      name="neighborhood"
                      label="Bairro"
                      maxLength={100}
                      {...register("neighborhood")}
                    />
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <Input name="cnes" label="CNES" {...register("cnes")} />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Input
                      name="establishment"
                      label="Nome Estabelecimento"
                      error={errors.establishment}
                      {...register("establishment")}
                    />
                  </GridItem>
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={2} columnGap={3} rowGap={6}>
                  <GridItem colSpan={[2, 1]}>
                    <InputMasked
                      mask="99.999.999/9999-99"
                      name="cnpj"
                      label="Cnpj"
                      {...register("cnpj")}
                    />
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <FormControl isInvalid={!!errors.parliamentary}>
                      <FormLabel htmlFor="parliamentary">Parlamentar</FormLabel>
                      <Controller
                        control={control}
                        defaultValue={parliamentaryOptions.map((c) => c.value)}
                        name="parliamentary"
                        render={({ field: { onChange, value, ref } }) => (
                          <SelectChakra
                            chakraStyles={{
                              container: (provided) => ({
                                ...provided,
                                background: colorModeVm
                              })
                            }}
                            instanceId="parliamentary"
                            ref={ref}
                            value={parliamentaryOptions.find(
                              (c) => value === c.value
                            )}
                            onChange={(val: any) => onChange(val.value)}
                            options={parliamentaryOptions}
                          />
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <FormControl isInvalid={!!errors.budget_action}>
                      <FormLabel htmlFor="budget_action">
                        Ação Orçamentária
                      </FormLabel>
                      <Controller
                        control={control}
                        defaultValue={budgetactionOptions.map((c) => c.value)}
                        name="budget_action"
                        render={({ field: { onChange, value, ref } }) => (
                          <SelectChakra
                            chakraStyles={{
                              container: (provided) => ({
                                ...provided,
                                background: colorModeVm
                              })
                            }}
                            instanceId="budget_action"
                            ref={ref}
                            value={budgetactionOptions.find(
                              (c) => value === c.value
                            )}
                            onChange={(val: any) => onChange(val.value)}
                            options={budgetactionOptions}
                          />
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <InputCurrency
                      name="proposed_value"
                      label="Valor Proposta"
                      error={errors.proposed_value}
                      {...register("proposed_value")}
                    />
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <InputMasked
                      mask="99/99/9999"
                      name="date_proposed"
                      label="Data da Proposta"
                      error={errors.date_proposed}
                      {...register("date_proposed")}
                    />
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <FormControl isInvalid={!!errors.nature_expense}>
                      <FormLabel htmlFor="nature_expense">
                        Natureza da Resposta
                      </FormLabel>
                      <Controller
                        control={control}
                        defaultValue={natureexpenseOptions.map((c) => c.value)}
                        name="nature_expense"
                        render={({ field: { onChange, value, ref } }) => (
                          <SelectChakra
                            chakraStyles={{
                              container: (provided) => ({
                                ...provided,
                                background: colorModeVm
                              })
                            }}
                            instanceId="nature_expense"
                            ref={ref}
                            value={natureexpenseOptions.find(
                              (c) => value === c.value
                            )}
                            onChange={(val: any) => onChange(val.value)}
                            options={natureexpenseOptions}
                          />
                        )}
                      />
                    </FormControl>
                  </GridItem>
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Flex justify="space-around" gap={2} mt="6">
            <Button
              w="full"
              onClick={() => reset()}
            >
              Limpar
            </Button>
            <Button
              type="submit"
              w="full"
              colorScheme="blue"
              isLoading={formState.isSubmitting}
            >
              Salvar
            </Button>
          </Flex>
        </Flex>
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
