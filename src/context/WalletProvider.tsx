import { InfuraProvider, Web3Provider } from "@ethersproject/providers";
import { Wallet } from "bnc-onboard/dist/src/interfaces";
import { API as OnboardAPI } from "bnc-onboard/dist/src/interfaces";
import { ethers } from "ethers";
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { setupOnboard } from "../lib/onboard";

type WalletContextProps = {
    onboard: OnboardAPI | null;
    wallet: Wallet | null;
    accountSelect(): Promise<void>;
    connect(): Promise<void>;
    disconnect(): void;
    provider: InfuraProvider | Web3Provider | null;
    address: string;
    loading: boolean;
};

type WalletProviderProps = {
    children: React.ReactNode;
};

const WalletContext = React.createContext<WalletContextProps>({
    accountSelect: () => Promise.resolve(),
    connect: () => Promise.resolve(),
    disconnect: () => {},
    onboard: null,
    provider: null,
    wallet: null,
    address: '',
    loading: true,
});

export function useWallet() {
    const ctx = useContext(WalletContext);
    if (!ctx) throw Error("wallet ctx");
    return ctx;
}

export function WalletProvider({ children }: WalletProviderProps) {
    const [provider, setProvider] = useState<InfuraProvider|Web3Provider|null>(null);
    const [address, setAddress] = useState<string>('');
    const [network, setNetwork] = useState<number>();
    const [loading, setLoading] = useState(true);
    const [wallet, setWallet] = useState<Wallet|null>(null);
    const [onboard, setOnboard] = useState<OnboardAPI|null>(null);

    useEffect(() => {
        setLoading(true)
        const onboard = setupOnboard({
            network: setNetwork,
            address: setAddress,
            wallet: (wallet: Wallet) => {
                if (wallet.provider) {
                    setWallet(wallet);
                    const provider = new ethers.providers.Web3Provider(
                        wallet.provider,
                        "any"
                    );
                    provider.pollingInterval = 20000;
                    setProvider(provider);
                } else {
                    setProvider(null);
                    setWallet(null);
                }
            },
        });
        setOnboard(onboard);
    }, []);

    const connect = useCallback(async () => {
        if (onboard) {
            const selected = await onboard.walletSelect();
            if (selected) {
                const ready = await onboard.walletCheck();
                console.log("ready", ready);
            }
        }
    }, [onboard]);

    const accountSelect = useCallback(async () => {
        if (onboard) await onboard.accountSelect();
    }, [onboard]);

    const disconnect = useCallback(() => {
        if (onboard) onboard.walletReset();
    }, [onboard]);

    const value = useMemo(
        () => ({
            address,
            loading,
            network,
            wallet,
            onboard,
            provider,
            accountSelect,
            connect,
            disconnect,
        }),
        [
            address,
            loading,
            network,
            wallet,
            onboard,
            accountSelect,
            connect,
            disconnect,
            provider,
        ]
    );

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}
