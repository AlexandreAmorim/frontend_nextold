import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";

import { ActiveLink } from "./ActiveLink";

interface NavLinkProps extends ChakraLinkProps {
  children: string;
  href: string;
}

export function NavLink({ children, href, ...rest }: NavLinkProps) {
  return (
    <ActiveLink href={href} passHref>
      <ChakraLink display="flex" align="center" ml="4" fontSize="xs" {...rest} >
        {children}
      </ChakraLink>
    </ActiveLink>
  );
}
