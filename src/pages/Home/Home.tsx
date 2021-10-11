import { gql, useQuery } from "@apollo/client";
import { Box, Button, Flex, List, ListItem, Spinner } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { useWallet } from "src/context/WalletProvider";
import { decimalPlaces, fromBaseUnits } from "src/lib/math.utils";
import { formatAddress } from "src/lib/string.utils";
import { Stream } from "src/types.d";

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
        skip: !address
    });

    if (loading) return (
        <Flex align="center" justify="center">
            <Spinner size="xl" color="secondary.500" />
        </Flex>
    );

    if (!data?.streams?.length) return (
        <Flex align="center" justify="center">
            <Box>No streams available for {address}</Box>
        </Flex>
    );

    return (
        <Flex
            align="center"
            alignSelf="center"
            justify="center"
            h="full"
            w="50rem"
            maxW="100%"
        >
            <List spacing={2} w="full">
                <ListItem
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                    p={4}
                    w="100%"
                >
                    <Box w="20%" p={1}>
                        ID
                    </Box>
                    <Box w="20%" p={1}>
                        Sender
                    </Box>
                    <Box w="20%" p={1}>
                        Recipient
                    </Box>
                    <Box w="20%" p={1}>
                        Deposit
                    </Box>
                    <Box w="20%" p={1}>
                        Token
                    </Box>
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
                            flexDirection={{ base: "column", md: "row" }}
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
                                {decimalPlaces(
                                    fromBaseUnits(
                                        stream.deposit,
                                        stream.token.decimals
                                    ),
                                    4
                                )}
                            </Box>
                            <Box w="20%" p={1}>
                                {stream.token?.symbol}
                            </Box>
                        </ListItem>
                    );
                })}
            </List>
        </Flex>
    );
}

export function HomePage() {
    const { connect, wallet } = useWallet();
    if (!wallet) {
        return (
            <Flex
                align="center"
                alignSelf="center"
                justify="center"
                h="full"
                w="50rem"
                maxW="100%"
            >
                <Button
                    align="center"
                    backgroundSize="100% 100%"
                    bgGradient="linear(to-tr, secondary.200, primary.100)"
                    borderRadius="lg"
                    boxShadow="2xl"
                    color="blackAlpha.900"
                    justify="center"
                    maxW="100%"
                    onClick={connect}
                    p={16}
                    transition="background-size 200ms ease 0s, background-position 200ms ease 0s"
                    _active={{
                        backgroundPositionY: "50%",
                        backgroundSize: "100% 200%",
                    }}
                    _hover={{
                        backgroundPositionY: "50%",
                        backgroundSize: "100% 200%",
                    }}
                >
                    Connect Wallet
                </Button>
            </Flex>
        );
    }
    return <Streams />;
}
