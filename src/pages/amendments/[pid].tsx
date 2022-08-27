import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/apiClient";
import { Select as SelectChakra } from "chakra-react-select";
import { Controller, useForm } from "react-hook-form";
import { RiAddLine } from "react-icons/ri";
import { Layout } from "../../components/Layout";
import Link from "next/link";
import { IOption } from "../../interface";
import { withSSRAuth } from "../../utils/withSSRAuth";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Stack,
  Icon,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  useColorModeValue,
  Divider,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

type ErrorApi = {
  options: string;
  message: string;
};

const consolidatesOptions = [
  { value: "ubs", label: "Unidade Básica de Saúde" },
  { value: "ums", label: "Unidade Móvel de Saúde" },
];

export default function Amendments() {
  const router = useRouter();
  const toast = useToast();
  const [data, setData] = useState<IOption[]>([]);
  const { pid } = router.query;
  const { handleSubmit, formState, control } = useForm();
  const { errors } = formState;
  const colorMode = useColorModeValue("gray.50", "gray.900");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [optionModal, setOptionModal] = useState("");

  useEffect(() => {
    async function loadActings() {
      const { status, data } = await api.get(`plannings/${pid}/coordinate`);
      if (status === 200) {
        const actingOp = data.map((acting: any) => ({
          value: acting.id,
          label: `${acting.project}`,
        }));
        console.log(actingOp);
        setData(actingOp);
      }
    }
    loadActings();
  }, [pid]);

  async function handlerAdd(coordinates_data) {
    console.log("coordinateDate", coordinates_data);
    try {
      router.push(`/amendments/plannings/${coordinates_data}`);
    } catch {
      console.log("Error happened");
    }
  }

  const handleActingChange = useCallback(
    async (payload: any) => {
      console.log(payload);
      router.push(`/amendments/plannings/detail/${payload.value}`);
    },
    [router]
  );

  const handleModalClick = (newModal) => {
    setOptionModal(newModal);
    onOpen();
  };

  const modais = ["Descrição", "Principios", "Diretizes", "Objetivo", "Meta"];

  return (
    <Layout title="Emendas Parlamentares">
      <Flex mb="8" justify="center" align="center">
        <Flex
          as="form"
          width="100%"
          maxWidth={600}
          bg={colorMode}
          borderRadius={8}
          p={[6, 8]}
          flexDirection="column"
          onSubmit={handleSubmit(() => {})}
        >
          <Stack spacing="4">
            <Flex>
              {modais.map((modal) => (
                <Button
                  onClick={() => handleModalClick(modal)}
                  key={modal}
                  mx={2}
                  w="50%"
                  fontSize="sm"
                  bg="blue.400"
                >
                  {modal}
                </Button>
              ))}

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{optionModal}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    {optionModal === "Descrição" && (
                      <Text>
                        A Estratégia da Saúde da Família é desenvolvida por meio
                        de práticas de cuidados integrados dirigidos à população
                        a partir de análise de parâmetros de qualificação, sendo
                        conduzida por equipe multiprofissional composta
                        minimamente por um médico, um enfermeiro (os dois
                        profissionais preferencialmente especialistas em saúde
                        da família), um auxiliar ou técnico de enfermagem e um
                        agente comunitário de saúde. Podem ainda fazer parte da
                        equipe o agente de combate ás endemias, um
                        cirurgião-dentista (preferencialmente especialista em
                        saúde da família) e ou um técnico em saúde bucal. Essas
                        equipes atuam em Unidades Básicas de Saúde(UBS).
                      </Text>
                    )}
                    {optionModal === "Principios" && (
                      <Text>Universalidade, Equidade e Integralidade.</Text>
                    )}
                    {optionModal === "Diretizes" && (
                      <Text>Regionalização e Hierarquização.</Text>
                    )}
                    {optionModal === "Objetivo" && (
                      <Text>
                        Promover a amplicação e a resolutividade da atenção
                        primaria de forma integrada e planejada.
                      </Text>
                    )}
                    {optionModal === "Meta" && (
                      <Text>
                        Conforme Plano Nacional de saúde - PNS (2020 - 2023)
                        está estratégia deverá alcançar cobertura de 72,31% da
                        população.
                      </Text>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Fechar
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
            <GridItem colSpan={2}>
              <FormControl isInvalid={!!errors}>
                <FormLabel htmlFor="acting">Projetos Consolidados</FormLabel>
                <Controller
                  control={control}
                  name="acting"
                  render={({ field: { onChange, value, ref } }) => (
                    <SelectChakra
                      inputId="acting"
                      id="acting"
                      ref={ref}
                      onChange={(v) => onChange(v.value)}
                      options={consolidatesOptions}
                      value={consolidatesOptions.find((c) => value === c.value)}
                    />
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isInvalid={!!errors}>
                <FormLabel htmlFor="acting_data">Projetos Abertos</FormLabel>
                <Controller
                  control={control}
                  name="acting_data"
                  render={({ field: { onChange, value, ref } }) => (
                    <SelectChakra
                      inputId="acting_data"
                      id="acting_data"
                      ref={ref}
                      onChange={(v) => onChange(v.value, handleActingChange(v))}
                      options={data}
                      value={data.find((c) => value === c.value)}
                    />
                  )}
                />
              </FormControl>
            </GridItem>
            <Divider />
            <FormLabel htmlFor="acting_data">Novo Projeto de:</FormLabel>
            <Flex justify="space-around" gap={2} mt="6">
              <Button
                w="50%"
                as="a"
                size="md"
                fontSize="md"
                colorScheme="blue"
                variant="outline"
                cursor="pointer"
                onClick={() => handlerAdd(pid)}
              >
                Unidade Básica de Saúde
              </Button>
              <Button
                w="50%"
                as="a"
                size="md"
                fontSize="md"
                cursor="pointer"
                colorScheme="blue"
                variant="outline"
              >
                Unidade de Saúde Móvel
              </Button>
            </Flex>
          </Stack>
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
