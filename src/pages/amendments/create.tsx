import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { api } from "../../services/apiClient";
import { IActing, IOption } from "../../interface";
import { useRouter } from "next/router";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { Select as SelectChakra } from "chakra-react-select";
import { Layout } from "../../components/Layout";

export default function CreateAmendments() {
  const router = useRouter();
  const [acting, setActing] = useState<IOption[]>([]);
  const [strategic, setStrategic] = useState<IOption[]>([]);
  const [coordinate, setCoordinate] = useState<IOption[]>([]);
  const [disabled, setDisbled] = useState<boolean>(false);
  const [button, setButton] = useState<boolean>(false);
  const { handleSubmit, formState, reset, control } = useForm();
  const { errors } = formState;
  const colorMode = useColorModeValue("gray.50", "gray.900");
  const colorModeVm = useColorModeValue("white", "gray.900");

  const handlerClear = useCallback(() => {
    setStrategic(null);
    setCoordinate(null);
    setDisbled(false);
    setButton(false);
    reset();
  }, [reset]);

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
    handlerClear();
    loadActings();
  }, [handlerClear]);

  const handleSearchPlanning: SubmitHandler<any> = async (payload) => {
    const { coordinates_data } = payload;
    router.push(`/amendments/${coordinates_data}`);
  };

  const handleActingChange = useCallback(async (payload: any) => {
    const { value } = payload;
    const { status, data } = await api.get(`strategic/${value}/acting`);
    if (status === 200) {
      const strategicOp = data.map((strategic: IActing) => ({
        value: strategic.id,
        label: strategic.name,
      }));
      setStrategic(strategicOp);
      setDisbled(true);
    }
  }, []);

  const handleStrategicChange = useCallback(async (payload: any) => {
    const { value } = payload;
    const { status, data } = await api.get(`coordinates/${value}/strategic`);
    if (status === 200) {
      const coordinateOp = data.map((coordinate: IActing) => ({
        value: coordinate.id,
        label: coordinate.name,
      }));
      setCoordinate(coordinateOp);
    }
  }, []);

  return (
    <Layout title="Emendas Parlamentares">
      <Box px="8">
        <Flex
          mb="8"
          justify="center"
          borderRadius={8}
          bg={colorMode}
          align="center"
        >
          <Flex
            as="form"
            width="100%"
            maxWidth={500}
            p={[6, 8]}
            flexDirection="column"
            onSubmit={handleSubmit(handleSearchPlanning)}
          >
            <Stack spacing="4">
              <GridItem colSpan={2}>
                <FormControl isInvalid={!errors}>
                  <FormLabel htmlFor="acting_data">Área de Atuação</FormLabel>
                  <Controller
                    control={control}
                    name="acting_data"
                    defaultValue={acting.map((c) => c.value)}
                    render={({ field: { onChange, value, ref } }) => (
                      <SelectChakra
                        chakraStyles={{
                          container: (provided) => ({
                            ...provided,
                            background: colorModeVm
                          })
                        }}
                        instanceId="acting_data"
                        ref={ref}
                        onChange={(v: any) =>
                          onChange(v.value, handleActingChange(v))
                        }
                        options={acting}
                        isDisabled={disabled}
                        value={acting.find((c) => value === c.value)}
                      />
                    )}
                  />
                </FormControl>
              </GridItem>
              {strategic && (
                <GridItem colSpan={2}>
                  <FormControl isInvalid={!errors}>
                    <FormLabel htmlFor="strategic_data">
                      Programas Estratégicos
                    </FormLabel>
                    <Controller
                      control={control}
                      name="strategic_data"
                      render={({ field: { onChange, value, ref } }) => (
                        <SelectChakra
                          chakraStyles={{
                            container: (provided) => ({
                              ...provided,
                              background: colorModeVm
                            })
                          }}
                          instanceId="strategic_data"
                          ref={ref}
                          onChange={(v: any) =>
                            onChange(v.value, handleStrategicChange(v))
                          }
                          options={strategic}
                          value={strategic.find((c) => value === c.value)}
                          isDisabled={!strategic}
                        />
                      )}
                    />
                  </FormControl>
                </GridItem>
              )}
              {coordinate && (
                <GridItem colSpan={2}>
                  <FormControl isInvalid={!errors}>
                    <FormLabel htmlFor="coordinates_data">
                      Ações Coordenadas
                    </FormLabel>
                    <Controller
                      control={control}
                      name="coordinates_data"
                      render={({ field: { onChange, value, ref } }) => (
                        <SelectChakra
                          chakraStyles={{
                            container: (provided) => ({
                              ...provided,
                              background: colorModeVm
                            })
                          }}
                          instanceId="coordinates_data"
                          ref={ref}
                          value={coordinate.find((c) => value === c.value)}
                          onChange={(v: any) => onChange(v.value, setButton(true))}
                          options={coordinate}
                          isDisabled={!coordinate}
                        />
                      )}
                    />
                  </FormControl>
                </GridItem>
              )}
            </Stack>
            <Flex justify="space-around" gap={2} mt="6">
              <Button
                w="full"
                onClick={handlerClear}
              >
                Limpar
              </Button>
              <Button
                type="submit"
                w="full"
                colorScheme="blue"
                isLoading={formState.isSubmitting}
                disabled={!button}
              >
                Avançar
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>
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
