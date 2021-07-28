import { useDisclosure } from "@chakra-ui/react";
import {
    BigNumber as EthersBigNumber,
    BigNumberish,
} from "@ethersproject/bignumber";
import BigNumber from "bignumber.js";
import React from "react";
import { useContext } from "react";

import { WithdrawDrawer } from "../components/WithdrawDrawer";
import { toHexString } from "../lib/math.utils";
import { SABLIER_PROXY_CONTRACT, sablierProxyInterface } from "../lib/sablier";
import { useWallet } from "./WalletProvider";

type WithdrawalProviderProps = {
    children: React.ReactNode;
};

type WithdrawalInput = {
    amount: string;
    id: string;
}

type WithdrawalTx = {
    to: string;
    data: string;
    value: string;
    gasPrice: string;
    gasLimit: string;
    estimatedFee: string;
}

type WithdrawalContextProps = {
    isOpen: boolean;
    onClose(): void;
    onOpen(): void;
    withdrawal(input?: WithdrawalInput): Promise<any>;
    buildtx(input?: WithdrawalInput): Promise<WithdrawalTx|null>;
};

const WithdrawalContext = React.createContext<WithdrawalContextProps>({
    isOpen: false,
    onClose: () => {},
    onOpen: () => {},
    withdrawal: () => Promise.resolve(),
    buildtx: () => Promise.resolve(null),
});

export function formatNumber(input?: BigNumberish) {
    return parseInt(toHexString(input), 16);
}

export function WithdrawProvider({ children }: WithdrawalProviderProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { provider, address } = useWallet();

    const buildtx = async ({ amount, id }: WithdrawalInput) => {
        const amountInBaseUnits = new BigNumber(amount).times(new BigNumber(10).exponentiatedBy(18));
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
            
            console.log('gasPrice', gasPrice);

            const gasLimit = "80000";
            const bufferedGasLimit = new BigNumber(gasLimit)
                .times(1.2)
                .decimalPlaces(0)
                .toString();
            const bufferedGasPrice = new BigNumber(gasPrice?.toString() || '50')
                .times(1.2)
                .decimalPlaces(0)
                .toString();
            return {
                ...tx,
                gasPrice: toHexString(bufferedGasPrice),
                gasLimit: toHexString(bufferedGasLimit),
                estimatedFee: new BigNumber(bufferedGasLimit)
                    .times(bufferedGasPrice)
                    .toFixed(),
            };
        } catch (error) {
            console.error("error", error);
            return null
        }
    };

    const withdrawal = async ({
        amount,
        id,
    }: WithdrawalInput) => {
        // Validate amount
        try {
            const balance = await provider?.getBalance(address);
            const tx = await buildtx({ id, amount });
            if (tx) {
                if (EthersBigNumber.from(balance).lt(tx.estimatedFee)) {
                    throw new Error("Not enough eth");
                }
                const nonce = await provider?.getSigner().getTransactionCount()
                const withdrawalTx = await provider?.getSigner().sendTransaction({
                  from: address,
                  to: tx?.to,
                  data: tx?.data,
                  value: tx?.value,
                  gasLimit: tx?.gasLimit,
                  gasPrice: tx?.gasPrice,
                  nonce: nonce,
                  chainId: 1
                })
                return withdrawalTx
            }
        } catch (error) {
            return null
        }
    };

    return (
        <WithdrawalContext.Provider
            value={{
                isOpen,
                onClose,
                onOpen,
                withdrawal,
                buildtx,
            }}
        >
            {children}
            <WithdrawDrawer />
        </WithdrawalContext.Provider>
    );
}

export function useWithdraw() {
    const ctx = useContext(WithdrawalContext);
    if (!ctx) throw Error("WithdrawContext Error");
    return ctx;
}
