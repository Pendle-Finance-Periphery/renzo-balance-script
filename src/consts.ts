export const Consts = {
  DEFAULT_QUERY_SIZE: 100_000,
  MAX_LOG: 100_000,
};

export function getMarketStateSqlQuery(blk: number) {
  return `select 
                market, argMax(totalSy, block_number * ${Consts.MAX_LOG} + log_index) as totalSy, argMax(totalActiveSupply, block_number * ${Consts.MAX_LOG} + log_index) as totalActiveSupply 
            from \`market_info\` where block_number <= ${blk} group by market`;
}

export function getUsersMarketInfoQuery(
  blk: number,
  market: string,
  users: string[]
) {
  return `select 
                user, argMax(activeBalance, block_number * ${
                  Consts.MAX_LOG
                } + log_index) as activeBalance 
            from \`user_market_info\` where market = '${market}' and block_number <= ${blk} and user in ['${users.join(
    "', '"
  )}'] group by user`;
}

export function getUsersYTInfoQuery(blk: number, users: string[]) {
  return `select 
                user, argMax(ytImpliedHolding, block_number * ${
                  Consts.MAX_LOG
                } + log_index) as ytImpliedHolding 
            from \`user_yt_position\` where block_number <= ${blk} and user in ['${users.join(
    "', '"
  )}'] group by user`;
}

export function getLiquidLockerInfoQuery(blk: number, market: string) {
  return `select 
                liquidLockerReceiptToken, argMax(activeBalance, block_number * ${Consts.MAX_LOG} + log_index) as activeBalance, argMax(totalSupply, block_number * ${Consts.MAX_LOG} + log_index) as totalSupply 
            from \`liquid_locker_info\` where block_number <= ${blk} and market = '${market}' group by liquidLockerReceiptToken`;
}

export function getUserLiquidLockerInfoQuery(
  blk: number,
  receiptToken: string,
  users: string[]
) {
  return `select 
                user, argMax(balance, block_number * ${
                  Consts.MAX_LOG
                } + log_index) as balance 
            from \`user_liquid_locker_info\` where receiptToken = '${receiptToken}' and block_number <= ${blk} and user in ['${users.join(
    "', '"
  )}'] group by user`;
}
