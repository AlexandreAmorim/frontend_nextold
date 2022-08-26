import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useContext } from "react";

export function Profile() {
  return (
    <Flex align="center">
      <Box mr="4" textAlign="right" display={{ base: "none", md: "block" }}>
        <Text>MILTON ALEXANDRE DE AMORIM</Text>
        <Text color="gray.400" fontSize="small">
          milton.rj30@gmail.com
        </Text>
      </Box>

      <Avatar size="md" name="milton" src="" />
    </Flex>
  );
}
