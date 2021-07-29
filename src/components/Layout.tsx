import { Flex } from "@chakra-ui/react";

import { Header } from "./Header";

type LayoutProps = {
    children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
    return (
        <Flex alignItems="center" flexDirection="column" minH="100vh">
            <Header />
            <Flex as="main" flex={1}>
                {children}
            </Flex>
        </Flex>
    );
}
