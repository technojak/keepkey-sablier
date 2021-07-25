import { gql, useQuery } from "@apollo/client";
import { Box, Button, Flex, List, ListItem } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { useWallet } from "../../context/WalletProvider";
import { decimalPlaces, fromBaseUnits } from "../../lib/math.utils";
import { formatAddress } from "../../lib/string.utils";
import { Stream } from "../../types.d";

type StreamLookup = Pick<
    Stream,
    "id" | "deposit" | "recipient" | "sender" | "token"
>;

const STREAMS = gql`
    query streams($address: String!) {
        streams(where: { recipient_contains: $address }) {
            id
            deposit
            recipient
            sender
            token {
                symbol
                name
                decimals
            }
        }
    }
`;

function Streams() {
    const history = useHistory();
    const { address } = useWallet();
    const { data, loading } = useQuery<{ streams: StreamLookup[] }>(STREAMS, {
        variables: {
            address,
        },
    });

    if (loading) return <Box>Loading...</Box>;

    if (!data?.streams?.length)
        return <Box>No streams available for {address}</Box>;

    return (
        <Flex align="center" alignSelf="center" justify="center" h="full" w="50rem" maxW="100%">
            <List spacing={2} w="full">
                <ListItem display="flex" flexDirection={{ base: 'column', md: 'row' }} p={4} w="100%">
                    <Box w="20%" p={1}>ID</Box>
                    <Box w="20%" p={1}>Sender</Box>
                    <Box w="20%" p={1}>Recipient</Box>
                    <Box w="20%" p={1}>Deposit</Box>
                    <Box w="20%" p={1}>Token</Box>
                </ListItem>
                {data?.streams.map((stream: StreamLookup) => {
                    return (
                        <ListItem
                            key={stream.id}
                            boxShadow="lg"
                            border="1px solid"
                            borderColor="secondary.100"
                            borderRadius="md"
                            cursor="pointer"
                            display="flex"
                            flexDirection={{ base: 'column', md: 'row' }} 
                            onClick={() => history.push(`/stream/${stream.id}`)}
                            p={4}
                            transition=".2s all"
                            w="100%"
                            _hover={{
                                transition: ".2s all",
                                transform: "scale(1.01)",
                            }}
                        >
                            <Box w="20%" p={1}>
                                {stream.id}
                            </Box>
                            <Box w="20%" p={1}>
                                {formatAddress(stream.sender)}
                            </Box>
                            <Box w="20%" p={1}>
                                {formatAddress(stream.recipient)}
                            </Box>
                            <Box w="20%" p={1}>
                                {decimalPlaces(fromBaseUnits(stream.deposit, stream.token.decimals), 4)}
                            </Box>
                            <Box w="20%" p={1}>{stream.token.symbol}</Box>
                        </ListItem>
                    );
                })}
            </List>
        </Flex>
    );
}

export function Home() {
    const { connect, wallet } = useWallet();
    if (!wallet) {
        return (
            <Flex align="center" alignSelf="center" justify="center" h="full" w="50rem" maxW="100%">
                <Button
                    onClick={connect}
                    align="center"
                    bgGradient="linear(to-tr, secondary.500, primary.200)"
                    borderRadius="lg"
                    boxShadow="2xl"
                    color="blackAlpha.900"
                    justify="center"
                    p={16}
                    maxW="100%"
                    transition="background-size 200ms ease 0s, background-position 200ms ease 0s"
                    // backgroundPositionY="0%"
                    backgroundSize="100% 100%"
                    _active={{
                        backgroundPositionY: '50%',
                        backgroundSize: '100% 200%',
                    }}
                    _hover={{
                        backgroundPositionY: '50%',
                        backgroundSize: '100% 200%',
                    }}
                >
                    Connect Wallet
                </Button>
            </Flex>
        )
    }
    return <Streams />;
}
