import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

interface NavSectionProps {
  title: string;
  children: ReactNode;
}

export function NavSection({ title, children }: NavSectionProps) {
  const colorMode = useColorModeValue("gray.500", "gray.500");

  return (
    <Box mt={6}>
      <Text fontWeight="bold" color={colorMode} fontSize="md" ml="2">
        {title}
      </Text>
      <Stack spacing="2" mt="6" align="stretch" ml="2">
        {children}
      </Stack>
    </Box>
  );
}
