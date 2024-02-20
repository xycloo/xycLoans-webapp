import CalculateMatured from "../helpers/calculateMatured";

export default async function MaturedFees(props) {
    const matured = await CalculateMatured(props.publicKey, props.events, props.id, props.yieldData)
    return (
        matured.toFixed(4)
    )
}