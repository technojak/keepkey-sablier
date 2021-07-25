import Onboard from 'bnc-onboard';
import { Subscriptions } from 'bnc-onboard/dist/src/interfaces'

const wallets = [{
    walletName: 'keepkey', preferred: true, rpcUrl: 'https://mainnet.infura.io/v3/254bf6f2a8164c57b4c07a310e49be66'
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
