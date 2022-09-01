import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  useColorModeValue,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError | any;
  mask: string;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, mask, ...rest },
  ref
) => {
  const colorMode = useColorModeValue("white", "gray.900");

  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <ChakraInput
        as={InputMask}
        mask={mask}
        name={name}
        id={name}
        ref={ref}
        bgColor={colorMode}
        _hover={{
          bgColor: { colorMode }
        }}
        {...rest}
      />

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const InputMasked = forwardRef(InputBase);
