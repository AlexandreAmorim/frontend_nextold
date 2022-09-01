import { useColorModeValue } from "@chakra-ui/react";
import { ChakraStylesConfig } from "chakra-react-select";

const colorMode = useColorModeValue("white", "gray.900")

export const chakraStyles: ChakraStylesConfig = {
    container: () => ({
        background: colorMode
    }),
};