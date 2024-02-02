'use client'

import { useState } from "react";
import { StrKey } from "stellar-sdk";

function hexToFloat64(hexString) {
    // Convert the hex string to a typed array
    const typedArray = new Uint8Array(hexString.match(/[\da-f]{2}/gi).map(hex => parseInt(hex, 16)));
  
    // Create a DataView to interpret the bytes
    const dataView = new DataView(typedArray.buffer);
  
    // Read the float64 value
    const floatValue = dataView.getFloat64(0, false); // false for little-endian, true for big-endian
  
    return floatValue;
  }

export function sumYieldLastXDays(data, contract, x) {
    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const fromStringToKey = (key) => (
        StrKey.encodeContract(fromHexString(`${key}`))
    )
    
    const filteredData = data.filter(obj => fromStringToKey(obj.contract.slice(2)) === contract);
  
    // Initialize an array to store relevant objects
    const relevantObjects = [];
  
    // Get the current timestamp
    const currentTimestamp = Date.now() / 1000;
  
    // Calculate timestamp for the last x days
    const lastXDaysTimestamp = currentTimestamp - (x * 24 * 60 * 60);
  
    // Iterate through the filtered data
    for (const obj of filteredData) {
      const timestamp = parseInt(obj.timestamp.slice(2), 16);
  
      // Check if the timestamp is within the last x days
      if (timestamp >= lastXDaysTimestamp) {
        // Add the relevant object to the array
        relevantObjects.push(obj);
      }
    }
  
    // Calculate the sum of yield from the relevant objects
    const sumYield = relevantObjects.reduce((sum, obj) => {
      return sum + hexToFloat64(obj.yield.slice(2));
    }, 0);
  
    return sumYield;
  }

/*
export default function YieldForPeriod() {
    
    const [period, setPeriod] = useState()

    
    return (
              <div className="max-w-md">
                <div className="mb-2 block">
                  <Label htmlFor="countries" value="Select your country" />
                </div>
                <Select id="countries" required value={period} onChange={(e) => { setPeriod(e.target.value) }}>
                  <option value="1d">1 day</option>
                  <option value="1w">1 week</option>
                  <option value="2w">2 weeks</option>
                  <option value="1m">1 month</option>
                  <option value="3m">3 months</option>
                  <option value="6m">6 months</option>
                  <option value="1y">1 year</option>
                  <option value="2y">2 years</option>
                  <option value="All">All time</option>
                </Select>
              </div>
    )
}
*/
export function Form() {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    // Call your custom function to handle the submission with the selected data
    handleFormSubmit(selectedValue);
  };

  const handleFormSubmit = (selectedData) => {
    if (selectedData === "1d") {
        
    }
    console.log('Form submitted with selected data:', selectedData);
    // You can make an API call or perform any other actions based on the selected data
  };

  return (
    <form>
      <label>
        Select an option:
        <select value={selectedOption} onChange={handleSelectChange}>
          <option value="1d">1 day</option>
          <option value="1w">1 week</option>
          <option value="option2">Option 2</option>
          {/* Add more options as needed */}
        </select>
      </label>
    </form>
  );
};

  
  // Example usage:
  const dataArray = [ /* Your array of objects here */ ];
  const contractToSum = "\\x6382b77351f7984cabdce500e4e5ae502c605cf441da016fe27ddf437580cf6b";
  const numberOfDays = 7; // Change this value based on your requirement
  
  const result = sumYieldLastXDays(dataArray, contractToSum, numberOfDays);
  console.log(`Sum of yield for the last ${numberOfDays} days: ${result}`);
  