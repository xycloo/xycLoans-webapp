import { StrKey } from "stellar-sdk";
import getTotYield from "./getYield";
import { stroopsToXLM } from "./getPools";

export default async function Yield(props) {
    const _yield = await getTotYield(props.contractId, props.yieldData, props.radix)
    const printedYield = stroopsToXLM(_yield, 4)
   return ( printedYield )
}
