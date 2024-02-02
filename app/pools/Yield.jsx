import { StrKey } from "stellar-sdk";
import getTotYield from "./getYield";

export default async function Yield(props) {
    const _yield = await getTotYield(props.contractId, props.yieldData, props.radix)
   return ( _yield)
}
