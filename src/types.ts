import { BigNumber } from "ethers";


export type MarketState = {
    market: string;
    totalSy: BigNumber;
    totalActiveSupply: BigNumber;
}

export type UserMarketInfo = {
    user: string;
    activeBalance: BigNumber;
}

export type UserYTInfo = {
    user: string;
    ytImpliedHolding: BigNumber;
}

export type LiquidLockerState = {
    receiptToken: string;
    activeBalance: BigNumber;
    totalSupply: BigNumber;
}

export type UserLiquidLockerInfo = {
    user: string;
    balance: BigNumber;
}
