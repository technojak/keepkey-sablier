import { BigNumber as EthersBigNumber, BigNumberish } from "@ethersproject/bignumber";
import BigNumber from "bignumber.js";

export function toBaseUnits(amount: string, decimal: number) {
    return new BigNumber(amount).times(`1e+${decimal}`).toString()
}

export function fromBaseUnits(amount: string, decimal: number) {
    return new BigNumber(amount).div(`1e+${decimal}`).toString()
}

export function decimalPlaces(amount: string, value: number) {
    return new BigNumber(amount).decimalPlaces(value).toNumber()
}

export function toHexString(val?: BigNumberish) {
    return EthersBigNumber.from(val).toHexString()
}
