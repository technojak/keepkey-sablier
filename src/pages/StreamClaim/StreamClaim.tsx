import "react-circular-progressbar/dist/styles.css";

import { gql, useQuery } from "@apollo/client";
import { DownloadIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { Box, Flex, Progress, Spinner, Text, Tooltip, useTheme } from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { useState } from "react";
import {
    buildStyles,
    CircularProgressbar,
    CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { useParams } from "react-router-dom";

import { useWithdraw } from "../../context/WithdrawProvider";
import { useInterval } from "../../hooks/useInterval";
import { formatAddress } from "../../lib/string.utils";
import { Stream } from "../../types.d"

type StreamQuery = {
    stream: Stream;
};

const STROKE_WIDTH = 6;

const STREAM = gql`
    query stream($id: String!) {
        stream(id: $id) {
            id
            ratePerSecond
            recipient
            sender
            startTime
            stopTime
            timestamp
            deposit
            token {
                symbol
                decimals
                name
            }
            cancellation {
                recipientBalance
                senderBalance
                timestamp
                txhash
            }
            withdrawals {
                amount
                txhash
            }
        }
    }
`;

function calculateAmountAvailable(stream: Stream) {
    const rate = new BigNumber(stream.ratePerSecond).div("1e+18");
    const now = Date.now() / 1000;
    const startTime = stream.startTime;
    const stopTime = stream.stopTime;
    if (new BigNumber(now).gte(stopTime)) {
        return new BigNumber(stream.deposit).div("1e+18").toString();
    }
    const available = rate.times(new BigNumber(now).minus(startTime));
    return available.toString();
}

type FormattedStream = Stream & {
    available: string;
    remainingBalance: string;
    percentStreamed: number;
    percentWithdrawn: number;
    stopTimeDisplay: string;
    rate: string;
};

function formatStreamData(stream?: Stream): FormattedStream | null {
    if (!stream) return null;
    const deposit = new BigNumber(stream.deposit).div("1e+18").toString();
    const available = calculateAmountAvailable(stream);
    const withdrawn = stream?.withdrawals.reduce((acc, current) => {
        const amount = new BigNumber(current.amount).div("1e+18").toNumber();
        acc += amount;
        return acc;
    }, 0);
    const remainingBalance = new BigNumber(deposit).minus(withdrawn).toString();
    const percentStreamed = new BigNumber(available)
        .div(deposit)
        .times(100)
        .toNumber();
    const percentWithdrawn = new BigNumber(deposit)
        .minus(remainingBalance)
        .div(deposit)
        .times(100)
        .toNumber();
    return {
        ...stream,
        available,
        deposit,
        remainingBalance,
        percentStreamed: percentStreamed > 100 ? 100 : percentStreamed,
        percentWithdrawn,
        stopTimeDisplay: dayjs(Number(stream.stopTime) * 1000).format(
            "MMMM DD, YYYY h:m A"
        ),
        rate: new BigNumber(stream.ratePerSecond)
            .div("1e+18")
            .toNumber()
            .toFixed(3),
    };
}

export function StreamClaim() {
    const [stream, setStream] = useState<FormattedStream | null>(null);
    const theme = useTheme();
    const { onOpen } = useWithdraw();
    const params = useParams<{ id: string }>();
    const { data, loading } = useQuery<StreamQuery>(STREAM, {
        variables: { id: params.id },
        skip: !params.id,
    });

    useInterval(() => {
        setStream(formatStreamData(data?.stream));
    }, 1000);

    if (loading || !stream) return (
        <Flex align="center" justify="center">
            <Spinner size="xl" color="secondary.500" />
        </Flex>
    )

    const tooltip = `
        This is an active stream created by ${formatAddress(stream.sender)} 
        and paying ${formatAddress(stream.recipient)} ${stream.rate} ${stream.token.symbol} 
        per second. The recipient has not yet withdrawn all the funds.
    `;

    return (
        <>
            <Box margin="auto">
                <Box w="32rem" maxW="100%" mb={16}>
                    <Box position="relative">
                        <Flex justify="center">
                            <Box h={300} w={300} zIndex={-1}>
                                <CircularProgressbarWithChildren
                                    value={stream?.percentStreamed || 0}
                                    strokeWidth={STROKE_WIDTH - 1}
                                    styles={buildStyles({
                                        pathColor: theme.colors.primary[500],
                                        trailColor: theme.colors.gray[50],
                                    })}
                                >
                                    <Box w={`${100 - 2 * (STROKE_WIDTH + 2)}%`}>
                                        <CircularProgressbar
                                            value={
                                                stream?.percentWithdrawn || 0
                                            }
                                            strokeWidth={STROKE_WIDTH}
                                            styles={buildStyles({
                                                pathColor:
                                                    theme.colors.secondary[500],
                                                trailColor:
                                                    theme.colors.gray[50],
                                            })}
                                        />
                                    </Box>
                                </CircularProgressbarWithChildren>
                            </Box>
                        </Flex>
                        <Flex
                            align="center"
                            flexDirection="column"
                            justify="center"
                            position="absolute"
                            left="50%"
                            top="50%"
                            transform="translate(-50%, -50%)"
                        >
                            <Flex
                                align="center"
                                bgGradient="linear(to-r, primary.100, secondary.300)"
                                color="blackAlpha.900"
                                borderRadius="lg"
                                boxShadow="2xl"
                                flexDirection="column"
                                px={16}
                                py={4}
                                zIndex={0}
                                maxW="100%"
                                w="30rem"
                            >
                                <Text
                                    textAlign="center"
                                    fontSize="3xl"
                                    fontWeight="bold"
                                >
                                    {Number(stream?.available)?.toFixed(10)}
                                </Text>
                            </Flex>
                            <Text
                                textAlign="center"
                                fontSize="md"
                                fontWeight="bold"
                            >
                                / {Number(stream?.deposit)?.toLocaleString()}{" "}
                                {stream?.token.symbol} Total
                            </Text>
                        </Flex>
                    </Box>
                </Box>
                <Box w="32rem" maxW="100%" margin="0 auto" mb={16}>
                    <Flex justify="center">
                        <Flex align="center" flexDirection="column" flex={1}>
                            <Box textAlign="center">
                                <Text as="span" mr={2}>
                                    Streamed
                                </Text>
                                <Text as="span" fontWeight="bold">
                                    {stream?.percentStreamed?.toFixed(2)} %
                                </Text>
                            </Box>
                            <Progress
                                bg="gray.50"
                                size="xs"
                                borderRadius="md"
                                w="10rem"
                                value={stream?.percentStreamed}
                            />
                        </Flex>
                        <Flex align="center" flexDirection="column" flex={1}>
                            <Box textAlign="center">
                                <Text as="span" mr={2}>
                                    Withdrawn
                                </Text>
                                <Text as="span" fontWeight="bold">
                                    {stream?.percentWithdrawn?.toFixed(2)} %
                                </Text>
                            </Box>
                            <Progress
                                bg="gray.50"
                                size="xs"
                                colorScheme="secondary"
                                borderRadius="md"
                                w="10rem"
                                value={stream?.percentWithdrawn}
                            />
                        </Flex>
                    </Flex>
                </Box>
                <Flex
                    align="center"
                    bgGradient="linear(to-r, primary.100, secondary.300)"
                    borderColor="secondary.100"
                    borderRadius="lg"
                    boxShadow="2xl"
                    color="blackAlpha.900"
                    justify="center"
                    mb={8}
                    px={16}
                    py={4}
                    zIndex={0}
                    maxW="100%"
                >
                    <Text textAlign="center" fontSize="xl" mr={4}>
                        {stream.stopTimeDisplay}
                    </Text>
                    <Tooltip label={tooltip} px={6} py={4}>
                        <InfoOutlineIcon />
                    </Tooltip>
                </Flex>
                <Box w="32rem" maxW="100%" margin="0 auto" mb={16}>
                    <Flex
                        as="button"
                        aria-label="withdraw"
                        bgGradient="linear(to-r, primary.100, secondary.300)"
                        borderRadius="lg"
                        boxShadow="2xl"
                        color="blackAlpha.900"
                        align="center"
                        justify="center"
                        px={16}
                        py={3}
                        onClick={onOpen}
                        w="full"
                    >
                        <DownloadIcon boxSize={4} mr={2} />
                        <Text>Withdraw</Text>
                    </Flex>
                </Box>
            </Box>
        </>
    );
}
