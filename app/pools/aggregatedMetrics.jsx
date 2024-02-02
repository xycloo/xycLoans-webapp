import { filterAndSortSupplies, intToFloat, stroopsToXLM } from "./getPools";

export default async function AggregatedMetrics(props) {
    const data = props.data
    const contract_supplies = data.allZephyrD6Eacc6B192F3Ae14116A75Fac2D1Db6S.nodes
    
    function calculateSuppliesSum(data) {
      // Initialize the sum
      let sum = 0;
    
      // Loop through each object in the array
      for (let i = 0; i < data.length; i++) {
        // Decode the hexadecimal "yield" value to an integer
        const supplyValue = data[i].supply;
        
    
        // Add the integer value to the sum
        sum += supplyValue;
      }
  
      //const floatSum = intToFloat(sum/10000000, 3)
      const floatSum = stroopsToXLM(sum, 3)
    
      // Return the total sum
      return floatSum;
    }
    
    const contracts = filterAndSortSupplies(contract_supplies)
    const suppliesSum = calculateSuppliesSum(contracts)

    return (
        <p className="font-bold text-black text-lg">{suppliesSum} XLM</p>
    )
}

//need a different function for accounts, sinc account objects have the balance argument instead of supply(as it is for the contracts)
export function AccountAggregatedMetrics(props) {
  
  const accountSupplies = props.data
  
  function calculateSuppliesSum(data) {
    // Initialize the sum
    let sum = 0;
  
    // Loop through each object in the array
    for (let i = 0; i < data.length; i++) {
      // Decode the hexadecimal "yield" value to an integer
      const balanceValue = data[i].balance;
      
  
      // Add the integer value to the sum
      sum += balanceValue;
    }

    //const floatSum = intToFloat(sum/10000000, 3)
    const floatSum = stroopsToXLM(sum, 3)
  
    // Return the total sum
    return floatSum;
  }
  
  const balanceSum = calculateSuppliesSum(accountSupplies)

  return (
      <p className="font-bold text-black text-lg">{balanceSum} XLM</p>
  )
}