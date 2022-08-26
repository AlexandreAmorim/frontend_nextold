import { IconButton, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { NotificationsNav } from "./NotificationsNav";
import { Profile } from "./Profile";

export function Header({ title, onOpen }) {
  const colorMode = useColorModeValue("white", "gray.800");

  return (
    <Flex
      ml={{ base: 0, md: 64 }}
      px="4"
      position="sticky"
      top="0"
      height="20"
      zIndex="1"
      bg={colorMode}
      alignItems="center"
      justifyContent={{ base: "space-between", md: "space-between" }}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Text
        display={{ base: "none", md: "flex" }}
        fontSize={["2xl", "3xl"]}
        fontWeight="bold"
      >
        {title}
      </Text>
      <Text
        display={{ base: "flex", md: "none" }}
        fontSize={["2xl", "3xl"]}
        fontWeight="bold"
        letterSpacing="tight"
      >
        SGM
      </Text>
      <Flex align="center">
        <NotificationsNav />
        <Profile />
      </Flex>
    </Flex>
  );
}
