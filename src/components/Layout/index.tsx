import { Box, Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function Layout({ title, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh">
      <Sidebar
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerContent>
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Header onOpen={onOpen} title={title} />
      <Box ml={{ base: 0, md: 60 }} px="4">
        {children}
      </Box>
    </Box>
  );
}
