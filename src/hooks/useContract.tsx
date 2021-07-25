import { Contract, ContractInterface } from "@ethersproject/contracts";
import {
    InfuraProvider,
    JsonRpcSigner,
    Web3Provider,
} from "@ethersproject/providers";
import { ethers } from "ethers";
import { useMemo } from "react";

function getSigner(provider: Web3Provider | InfuraProvider, account: string): JsonRpcSigner {
    return provider.getSigner(account).connectUnchecked()
}

function getSignerOrProvider(
    provider: Web3Provider | InfuraProvider,
    account?: string
): InfuraProvider | JsonRpcSigner | Web3Provider {
    return account ? getSigner(provider, account) : provider
}

function getContract(
    contractAddress: string,
    abi: ethers.ContractInterface,
    provider: Web3Provider | InfuraProvider | null,
    account?: string
): Contract {
    return new ethers.Contract(contractAddress, abi, getSignerOrProvider(provider as Web3Provider | InfuraProvider, account));
}

export function useContract(
    provider: Web3Provider | InfuraProvider | null,
    contractAddress: string,
    abi: ContractInterface,
    account: string,
) {
    return useMemo(() => {
        try {
            return getContract(contractAddress, abi, provider, account)
        } catch (error) {
            return null
        }   
    }, [
        provider,
        account,
        contractAddress,
        abi
    ])
}
