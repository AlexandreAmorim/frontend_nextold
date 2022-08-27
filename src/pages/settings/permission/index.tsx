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
import { useForm } from "react-hook-form";
import { Input } from "../../../components/Form/Input";
import { useCallback } from "react";
import { api } from "../../../services/apiClient";
import { Layout } from "../../../components/Layout";

const formSchema = yup.object().shape({
  name: yup.string().trim().required("Nome é obrigatório"),
  alias: yup.string().trim().required("Alias é obrigatório"),
});

export default function Permission() {
  const colorMode = useColorModeValue("gray.50", "gray.900");
  const toast = useToast();
  const { register, handleSubmit, reset, formState } = useForm({
    resolver: yupResolver(formSchema),
  });

  const { errors } = formState;

  const handlerCreatePermission = useCallback(
    async (payload: any) => {
      const { status } = await api.post("permissions", payload);
      if (status === 201) {
        toast({
          title: "Sucesso",
          description: `Permissão criada com sucesso`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        reset();
      }
    },
    [reset, toast]
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
        onSubmit={handleSubmit(handlerCreatePermission)}
      >
        <SimpleGrid columns={2} columnGap={3} rowGap={6}>
          <GridItem colSpan={[2, 1]}>
            <FormControl>
              <Input label="Nome" {...register("name")} />
            </FormControl>
          </GridItem>
          <GridItem colSpan={[2, 1]}>
            <FormControl>
              <Input
                label="Alias"
                placeholder="ex: user.list"
                {...register("alias")}
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
