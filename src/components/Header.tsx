import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import React from "react";

import { useWallet } from "../context/WalletProvider";
import { SablierLogo } from "./SablierLogo";

export function Header() {
    const { disconnect, wallet } = useWallet();

    return (
        <React.Fragment>
            <Box py={4} bg="primary.100" w="full" boxShadow="xl" mb={4}>
                <Container maxW="container.xl">
                    <Text fontSize="lg" textAlign="center">This dapp was created to allow KeepKey wallets to claim from <SablierLogo /> streams. This dapp is not built or maintained by Sablier. <strong>No warranty or support of any kind is provided</strong>.</Text>
                </Container>
            </Box>
            <Container maxW="container.xl">
                <Flex
                    as="header"
                    align="center"
                    justifyContent="space-between"
                    py={4}
                >
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
        </React.Fragment>
    );
}
