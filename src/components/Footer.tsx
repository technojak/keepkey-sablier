import { Flex, Text } from "@chakra-ui/react";

export function Footer() {
    return (
        <Flex as="footer" align="center" flexDirection="row" justify="center" py={8}>
            <Text fontSize="sm" as="i">Note: not affliated with Sablier</Text>
        </Flex>
    );
}
