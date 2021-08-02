import BigNumber from "bignumber.js";
import dayjs from "dayjs";

import { Stream } from "../types";

export type FormattedStream = Stream & {
    available: string;
    amountStreamed: string;
    remainingBalance: string;
    percentStreamed: number;
    percentWithdrawn: number;
    stopTimeDisplay: string;
    rate: string;
};

function calculateAmountStreamed(stream: Stream) {
    const rate = new BigNumber(stream.ratePerSecond).div("1e+18");
    const now = Date.now() / 1000;
    const startTime = stream.startTime;
    const stopTime = stream.stopTime;
    if (new BigNumber(now).gte(stopTime)) {
        return new BigNumber(stream.deposit).div("1e+18").toString();
    }
    const streamed = rate.times(new BigNumber(now).minus(startTime));
    return streamed.toString();
}

function calculateAvailable(stream: Stream) {
    const withdrawn = stream?.withdrawals.reduce((acc, current) => {
        const amount = new BigNumber(current.amount).div("1e+18").toNumber();
        acc += amount;
        return acc;
    }, 0);
    const amountStreamed = calculateAmountStreamed(stream)
    return {
        available: new BigNumber(amountStreamed).minus(withdrawn).toString(),
        amountStreamed,
        withdrawn
    }
}

export function formatStream(stream?: Stream): FormattedStream | null {
    if (!stream) return null;
    const deposit = new BigNumber(stream.deposit).div("1e+18").toString();
    const { available, amountStreamed, withdrawn } = calculateAvailable(stream)
    const remainingBalance = new BigNumber(deposit).minus(withdrawn).toString();
    const percentStreamed = new BigNumber(amountStreamed)
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
        amountStreamed,
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
