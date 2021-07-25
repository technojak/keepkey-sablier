import { Interface } from '@ethersproject/abi'

import sablierAbi from '../abi/SablierContractAbi.json'

export const SABLIER_PROXY_CONTRACT = '0xbd6a40bb904aea5a49c59050b5395f7484a4203d';

export const sablierProxyInterface = new Interface(sablierAbi)
