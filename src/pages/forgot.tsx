import {
  Button,
  Flex,
  Stack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/apiClient";

import { Input } from "../components/Form/Input";

type SignInFormData = {
  email: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
});

export default function Forgot() {
  const toast = useToast();
  const colorMode = useColorModeValue("gray.50", "gray.900");
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const { errors } = formState;

  const handleSignIn: SubmitHandler<SignInFormData> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const { email } = data;

    try {
      const response = await api.post("forgot", {
        email,
      });

      if (response.status === 200) {
        toast({
          status: "success",
          title: "Sucesso!",
          description:
            "Se você informou um e-mail cadastrado no sistema, em breve, receberá um e-mail com o link para criar uma nova senha. Lembre-se de verificar a caixa de Spam.",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      if (!!err.isAxiosError && !err.response) {
        toast({
          status: "error",
          title: "Erro na conexão",
          description:
            "Você está sem acesso à internet ou o servidor está off-line.",
          duration: 5000,
          isClosable: true,
        });
      }

      if (err.response && err.response.status === 429) {
        toast({
          status: "error",
          title: "Opsss!",
          description: "Você excedeu o limite de requisições para o servidor.",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (err.response && err.response.status === 400) {
        const { message } = Array.isArray(err.response.data)
          ? err.response.data[0]
          : err.response.data;
        toast({
          status: "error",
          title: message,
        });
        return;
      }
    }
  };

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        borderWidth={1}
        p="8"
        borderRadius={8}
        bg={colorMode}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing="4">
          <Input
            name="email"
            type="email"
            label="E-mail"
            error={errors.email}
            {...register("email")}
          />
        </Stack>

        <Button
          type="submit"
          mt="6"
          bg="blue.500"
          color="white"
          _hover={{
            bg: "blue.600",
          }}
          isLoading={formState.isSubmitting}
        >
          Enviar
        </Button>
      </Flex>
    </Flex>
  );
}
