import { HStack, Link, useColorMode } from "@chakra-ui/react";
import { RiLogoutCircleRLine, RiMoonLine, RiSunLine } from "react-icons/ri";
import { signOut } from '../../contexts/AuthContext'

export function NotificationsNav() {
  const { colorMode, toggleColorMode } = useColorMode();

  function handleSignOut() {
    signOut()
  }

  return (
    <HStack
      spacing={["6", "8"]}
      mx={["6", "8"]}
      pr={["6", "8"]}
      py="1"
      color="gray.400"
      borderRightWidth={1}
      borderColor="gray.700"
      display={{ base: "none", md: "flex" }}
    >
      <Link onClick={toggleColorMode}>
        {colorMode === "light" ? <RiMoonLine /> : <RiSunLine />}
      </Link>
      <Link
        display="flex"
        color="red.500"
        onClick={handleSignOut}
        alignItems="center"
      >
        <RiLogoutCircleRLine size="20" />
      </Link>
    </HStack>
  );
}
