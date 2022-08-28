import {
  Flex,
  Stack,
  Text,
  Link as ChakraLink,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Input } from "../components/Form/Input";
import Link from "next/link";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup.string().required("Senha obrigatória"),
});

export default function Home() {
  const colorMode = useColorModeValue("brand.50", "gray.900");
  const { signIn } = useContext(AuthContext);
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const { errors } = formState;

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await signIn(values);
  };

  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      flexDirection={["column", "row"]}
      bg={colorMode}
    >
      <Stack p={[6, 8]} spacing="4" mr={[0, 0, 0, 100]}>
        <Text
          fontSize={["2xl", "3xl"]}
          fontWeight="bold"
          letterSpacing="tight"
          w="64"
        >
          SGM
          <Text as="span" color="brand.500">
            .
          </Text>
        </Text>
        <Text
          letterSpacing="tight"
          lineHeight="normal"
          fontSize={["3xl", "5xl"]}
          mb="8"
          fontWeight="extrabold"
          maxW={430}
        >
          Sistema de Gestão Municipal
        </Text>
      </Stack>
      <Flex
        as="form"
        width="100%"
        maxWidth={400}
        p={[6, 8]}
        borderRadius={8}
        flexDirection="column"
        bg={colorMode}
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing="4">
          <Input
            label="E-mail"
            name="email"
            type="email"
            {...register("email")}
            {...register("email")}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            error={errors.password}
            {...register("password")}
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
          Entrar
        </Button>
        <Link href="/forgot" passHref>
          <ChakraLink alignSelf="center" mt="4">
            <Text color="gray.500">Esqueci minha senha</Text>
          </ChakraLink>
        </Link>
      </Flex>
    </Flex>
  );
}
