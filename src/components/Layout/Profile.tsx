import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from '../../contexts/AuthContext'

export function Profile() {
  const { user } = useContext(AuthContext)
  return (
    <Flex align="center">
      <Box mr="4" textAlign="right" display={{ base: "none", md: "block" }}>
        <Text>{user?.name}</Text>
        <Text color="gray.400" fontSize="small">
          {user?.email}
        </Text>
      </Box>

      <Avatar size="md" name={user?.name} src={user?.avatar} />
    </Flex>
  );
}
