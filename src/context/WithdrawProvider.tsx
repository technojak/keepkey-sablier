import { useDisclosure } from "@chakra-ui/react";
import {
    BigNumber as EthersBigNumber,
    BigNumberish,
} from "@ethersproject/bignumber";
import BigNumber from "bignumber.js";
import React from "react";
import { useContext } from "react";

import { toHexString } from "../lib/math.utils";
import { SABLIER_PROXY_CONTRACT, sablierProxyInterface } from "../lib/sablier";
import { useWallet } from "./WalletProvider";

type WithdrawalProviderProps = {
    children: React.ReactNode;
};

type WithdrawalInput = {};

type WithdrawalContextProps = {
    isOpen: boolean;
    onClose(): void;
    onOpen(): void;
    handleWithdrawal(input?: WithdrawalInput): void;
};

const WithdrawalContext = React.createContext<WithdrawalContextProps>({
    isOpen: false,
    onClose: () => {},
    onOpen: () => {},
    handleWithdrawal: () => {},
});

export function formatNumber(input?: BigNumberish) {
    return parseInt(toHexString(input), 16);
}

export function WithdrawProvider({ children }: WithdrawalProviderProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { provider, address } = useWallet();

    const buildtx = async (id: string, claimAmount: string) => {
        const amountInBaseUnits = new BigNumber(claimAmount).times(
            new BigNumber(10).exponentiatedBy(18)
        );
        const data = sablierProxyInterface.encodeFunctionData(
            "withdrawFromSalary",
            [id, amountInBaseUnits.toFixed()]
        );
        const tx = {
            to: SABLIER_PROXY_CONTRACT,
            data,
            value: toHexString("0"),
        };
        try {
            const gasPrice = await provider?.getGasPrice();
            const gasLimit = "80000";
            const bufferedGasLimit = new BigNumber(gasLimit)
                .times(1.2)
                .decimalPlaces(0)
                .toString();
            const bufferedGasPrice = new BigNumber(10)
                .times(1.2)
                .decimalPlaces(0)
                .toString();
            return {
                ...tx,
                gasPrice: toHexString(gasPrice),
                gasLimit: toHexString(gasLimit),
                estimatedFee: new BigNumber(bufferedGasLimit)
                    .times(bufferedGasPrice)
                    .toFixed(),
            };
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleWithdrawal = async ({
        claimAmount,
        id,
    }: {
        claimAmount: string;
        id: string;
    }) => {
        // Validate claimAmount
        const balance = await provider?.getBalance(address);
        console.log("balance");
        const tx = await buildtx(id, claimAmount);
        if (tx) {
            if (EthersBigNumber.from(balance).lt(tx.estimatedFee)) {
                throw new Error("Not enough eth");
            }

            console.log("tx", tx);
            // console.log("response", response);
            // const nonce = await provider?.getSigner().getTransactionCount()
            // const claimTx = await provider?.getSigner().sendTransaction({
            //   from: walletAddress,
            //   to: state.transaction?.to,
            //   data: state.transaction?.data,
            //   value: state.transaction?.value,
            //   gasLimit: state.transaction?.gasLimit,
            //   gasPrice: state.transaction?.gasPrice,
            //   nonce: nonce,
            //   chainId: state.transaction?.chainId
            // })
        }
    };

    return (
        <WithdrawalContext.Provider
            value={{
                isOpen,
                onClose,
                onOpen,
                handleWithdrawal,
            }}
        >
            {children}
        </WithdrawalContext.Provider>
    );
}

export function useWithdraw() {
    const ctx = useContext(WithdrawalContext);
    if (!ctx) throw Error("WithdrawContext Error");
    return ctx;
}
