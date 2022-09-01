import { useColorModeValue } from "@chakra-ui/react";
import { ChakraStylesConfig } from "chakra-react-select";

export const chakraStyles: ChakraStylesConfig = {
    container: () => ({
        background: useColorModeValue("white", "gray.900")
    }),
};
