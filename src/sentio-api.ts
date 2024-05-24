import axios from "axios";
import * as dotenv from "dotenv";
import {
  Consts,
  getLiquidLockerInfoQuery,
  getMarketStateSqlQuery,
  getUserLiquidLockerInfoQuery,
  getUsersMarketInfoQuery,
  getUsersYTInfoQuery,
} from "./consts";
import { BigNumber } from "ethers";
import {
  LiquidLockerState,
  MarketState,
  UserLiquidLockerInfo,
  UserMarketInfo,
  UserYTInfo,
} from "./types";

dotenv.config();

async function querySentioSQL(endpoint: string, query: string) {
  const response = await axios.post(
    endpoint,
    {
      sqlQuery: {
        sql: query,
        size: Consts.DEFAULT_QUERY_SIZE,
      },
    },
    {
      headers: {
        "api-key": process.env.SENTIO_API_KEY!,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.result.rows;
}

export async function getMarketStateAtBlock(
  endpoint: string,
  blk: number
): Promise<MarketState[]> {
  const resp = await querySentioSQL(endpoint, getMarketStateSqlQuery(blk));
  return resp.map((row: any) => ({
    market: row.market,
    totalSy: BigNumber.from(row.totalSy),
    totalActiveSupply: BigNumber.from(row.totalActiveSupply),
  }));
}

export async function getUsersMarketInfoAtBlock(
  endpoint: string,
  blk: number,
  market: string,
  users: string[]
): Promise<UserMarketInfo[]> {
  const resp = await querySentioSQL(
    endpoint,
    getUsersMarketInfoQuery(blk, market, users)
  );
  return resp.map((row: any) => ({
    user: row.user,
    activeBalance: BigNumber.from(row.activeBalance),
  }));
}

export async function getUsersYTInfoAtBlock(
  endpoint: string,
  blk: number,
  users: string[]
): Promise<UserYTInfo[]> {
  const resp = await querySentioSQL(endpoint, getUsersYTInfoQuery(blk, users));
  return resp.map((row: any) => ({
    user: row.user,
    ytImpliedHolding: BigNumber.from(row.ytImpliedHolding),
  }));
}

export async function getLiquidLockersStateAtBlock(
  endpoint: string,
  blk: number,
  market: string
): Promise<LiquidLockerState[]> {
  const resp = await querySentioSQL(
    endpoint,
    getLiquidLockerInfoQuery(blk, market)
  );
  return resp.map((row: any) => ({
    receiptToken: row.liquidLockerReceiptToken,
    activeBalance: BigNumber.from(row.activeBalance),
    totalSupply: BigNumber.from(row.totalSupply),
  }));
}

export async function getUsersLiquidLockerInfoAtBlock(
  endpoint: string,
  blk: number,
  receiptToken: string,
  users: string[]
): Promise<UserLiquidLockerInfo[]> {
  const resp = await querySentioSQL(
    endpoint,
    getUserLiquidLockerInfoQuery(blk, receiptToken, users)
  );
  return resp.map((row: any) => ({
    user: row.user,
    balance: BigNumber.from(row.balance),
  }));
}
