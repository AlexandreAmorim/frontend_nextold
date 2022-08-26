import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  List,
  ListItem,
  Text,
  Flex,
  VStack,
  CloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

const planOrcitems = [
  { id: 1, link: "/dashboard", title: "Plano Plurianual" },
  { id: 2, link: "/planning/create", title: "Emendas Parlamentares" },
  { id: 3, link: "/", title: "Lei Diretrizes Orçamentárias" },
  { id: 4, link: "/", title: "Lei Orçamentária Anual" },
];

const parltems = [{ link: "/atwork", title: "Em Teste" }];

const headers = [
  { id: 1, title: "Plan.Orçamentos", items: planOrcitems },
  { id: 2, title: "Política Pública", items: parltems },
  { id: 3, title: "Gestão Parlamentar", items: parltems },
];

const settingsItems = [{ link: "/settings", title: "Acl" }];
const usersItems = [{ link: "/users", title: "listagem" }];

const footers = [
  { id: 1, title: "Settings", items: settingsItems },
  { id: 2, title: "Usuários", items: usersItems },
];

export function Sidebar({ onClose, ...rest }) {
  const colorMode = useColorModeValue("gray.200", "gray.900");

  return (
    <Box
      w={{ base: "full", md: 64 }}
      pos="fixed"
      h="full"
      overflowY="scroll"
      bg={colorMode}
      mr="2"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text
          fontSize={["2xl", "3xl"]}
          fontWeight="bold"
          letterSpacing="tight"
          w="64"
        >
          Next
          <Text as="span" color="brand.500">
            .
          </Text>
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <VStack spacing="4" pr="6" alignItems="stretch">
        <NavSection title="GERAL">
          {headers.map(({ id, title, items }) => (
            <Accordion allowToggle key={id}>
              <AccordionItem border="none">
                <AccordionButton borderLeftWidth="2px" borderLeftColor="blue.600">
                  <Box flex="1" textAlign="left" mr={4}>
                    <Text fontWeight="bold" fontSize="md">
                      {title}
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <List spacing={3}>
                    {items.map(({ link, title }) => (
                      <ListItem key={title} borderLeftWidth="2px" borderLeftColor="blue.600">
                        <Text fontWeight="bold" fontSize="small" ml="2" color={colorMode}>
                          <NavLink href={link}>{title}</NavLink>
                        </Text>
                      </ListItem>
                    ))}
                  </List>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          ))}
        </NavSection>
        <NavSection title="CONFIGURAÇÕES">
          {footers.map(({ id, title, items }) => (
            <Accordion allowToggle key={id}>
              <AccordionItem border="none">
                <AccordionButton borderLeftWidth="2px" borderLeftColor="blue.600">
                  <Box flex="1" textAlign="left" mr={4}>
                    <Text fontWeight="bold" fontSize="md">
                      {title}
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <List spacing={3}>
                    {items.map(({ link, title }) => (
                      <ListItem key={title} borderLeftWidth="2px" borderLeftColor="blue.600">
                        <Text fontWeight="bold" fontSize="small" ml="2" color={colorMode}>
                          <NavLink href={link}>{title}</NavLink>
                        </Text>
                      </ListItem>
                    ))}
                  </List>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          ))}
        </NavSection>
      </VStack>
    </Box>
  );
}
