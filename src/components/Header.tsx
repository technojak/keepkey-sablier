import { Button, Container, Flex, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { useWallet } from "../context/WalletProvider";
import { SablierLogo } from "./SablierLogo";

export function Header() {
    const { disconnect, wallet } = useWallet();

    return (
        <Container maxW="container.xl">
            <Flex
                as="header"
                align="center"
                justifyContent="space-between"
                py={4}
            >
                <Link to="/">
                    <Flex align="center">
                        <SablierLogo />
                        <Heading size="md" ml={2}>KeepKey</Heading>
                    </Flex>
                </Link>
                <Flex align="center">
                    {wallet && (
                        <Button
                            p={6}
                            borderRadius="2xl"
                            mr={4}
                            onClick={disconnect}
                        >
                            Disconnect
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Container>
    );
}
