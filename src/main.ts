import { BigNumber } from "ethers";
import {
  getLiquidLockersStateAtBlock,
  getMarketStateAtBlock,
  getUsersLiquidLockerInfoAtBlock,
  getUsersMarketInfoAtBlock,
  getUsersYTInfoAtBlock,
} from "./sentio-api";

async function main() {
  const ENDPOINT =
    "https://app.sentio.xyz/api/v1/analytics/renzo/pendle-mainnet-dec2024/sql/execute";
  const BLOCK_NUMBER = 19837007;
  const USERS = [
    "0x1fccc097db89a86bfc474a1028f93958295b1fb7",
    "0xd3751b261f193242472427b8949310e02d387410",
    "0x7f429edeff8afc7bb3a2cf7db832fc86f6fa99da",
  ];

  const result: Map<string, BigNumber> = new Map();
  function increaseUserShare(user: string, amount: BigNumber) {
    if (result.has(user)) {
      result.set(user, result.get(user)!.add(amount));
    } else {
      result.set(user, amount);
    }
  }

  /* User holding YT */ {
    const ytInfos = await getUsersYTInfoAtBlock(ENDPOINT, BLOCK_NUMBER, USERS);
    ytInfos.forEach((info) => {
      increaseUserShare(info.user, info.ytImpliedHolding);
    });
  }


  /* User holding LP or liquid locker */ {
    const marketStates = await getMarketStateAtBlock(ENDPOINT, BLOCK_NUMBER);
    for (const marketState of marketStates) {
      const market = marketState.market;

      /* User holding LP */ {
        const usersMarketInfo = await getUsersMarketInfoAtBlock(
          ENDPOINT,
          BLOCK_NUMBER,
          market,
          USERS
        );
        usersMarketInfo.forEach((info) => {
          const userImpliedEzETHHolding = info.activeBalance
            .mul(marketState.totalSy)
            .div(marketState.totalActiveSupply);
          increaseUserShare(info.user, userImpliedEzETHHolding);
        });
      }
      
      /* User holding liquid locker */ {
        const liquidLockerStates = await getLiquidLockersStateAtBlock(ENDPOINT,BLOCK_NUMBER, market);
        for(const liquidLockerState of liquidLockerStates) {
          const receiptToken = liquidLockerState.receiptToken;
          const usersLiquidLockerInfo = await getUsersLiquidLockerInfoAtBlock(ENDPOINT, BLOCK_NUMBER, receiptToken, USERS);

          usersLiquidLockerInfo.forEach((info) => {
            const impliedActiveBalance = info.balance.mul(liquidLockerState.activeBalance).div(liquidLockerState.totalSupply);
            const userImpliedEzETHHolding = impliedActiveBalance.mul(marketState.totalSy).div(marketState.totalActiveSupply);
            increaseUserShare(info.user, userImpliedEzETHHolding);
          });
        }
      }
    }
  }

  console.log("User Share:");
  for (const [user, share] of result) {
    console.log(`${user}: ${share.toString()}`);
  }
}

main()
  .then(() => console.log(""))
  .catch(console.error);
