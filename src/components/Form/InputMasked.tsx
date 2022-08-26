import { forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input as ChakraInput,
    InputProps as ChakraInputProps,
} from '@chakra-ui/react'
import InputMask from 'react-input-mask'

interface InputProps extends ChakraInputProps {
    name: string
    label?: string
    error?: FieldError
    mask: string
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
    { name, label, error = null, mask, ...rest },
    ref
) => {
    return (
        <FormControl isInvalid={!!error}>
            {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

            <ChakraInput
                as={InputMask}
                mask={mask}
                maskPlaceholder={null}
                name={name}
                id={name}
                ref={ref}
                {...rest}
            />

            {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
        </FormControl>
    )
}

export const InputMasked = forwardRef(InputBase)