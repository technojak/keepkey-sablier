import Onboard from 'bnc-onboard';
import { Subscriptions } from 'bnc-onboard/dist/src/interfaces'

const wallets = [{
    walletName: 'keepkey', preferred: true, rpcUrl: process.env.REACT_APP_RPC_URL
}]

const walletCheck = [
    { checkName: 'derivationPath' },
    { checkName: 'accounts' },
    { checkName: 'connect' },
    { checkName: 'network' },
]

export function setupOnboard(subscriptions: Subscriptions) {
    return Onboard({
        networkId: 1, // mainnet
        hideBranding: true,
        blockPollingInterval: 30000,
        walletSelect: {
            wallets,
            agreement: {
                version: '1.0'
            }
        },
        walletCheck,
        subscriptions
    })
}
