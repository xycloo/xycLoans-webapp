import dynamic from 'next/dynamic'
import { convertTimestampsToDates, parseBase64Yield, parseTimestamp, timestampsToDates, toHex } from '../helpers/dataParsing';
import { stroopsToXLM } from '../pools/getPools';
import { Normalize } from '../helpers/dataManipulation';
import normalize from "array-normalize"

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export const NormChart = (params) => {
  // Extract timestamps and yields from data
  
  const supplyTimestamps = params.supplyData.map(entry => parseTimestamp(entry.timestamp))
  const supplyDates = timestampsToDates(supplyTimestamps, false)
  const supplies = params.supplyData.map(entry => stroopsToXLM(parseInt(toHex(entry.supply), 16)), 3)
  //console.log("supply:", supplyDates, supplies)

  const yieldTimestamps = params.yieldData.map(entry => parseTimestamp(entry.timestamp))
  const yieldDates = timestampsToDates(yieldTimestamps)
  const yields = params.yieldData.length === 1 ? [parseFloat(stroopsToXLM(parseBase64Yield(params.yieldData[0].yield, 8), 3))] : params.yieldData.map(entry => parseFloat(stroopsToXLM(parseBase64Yield(entry.yield, 8), 3)))

  // Calculate accumulated yield over time
  const accumulatedYields = [0];
  let accumulatedYield = 0;
  for (let i = 0; i < yields.length; i++) {
    accumulatedYield += yields[i];
    accumulatedYields.push(accumulatedYield);
  }
  
  //console.log("yield:", yieldDates, accumulatedYields)
  
  const normalizedSupply = Normalize(supplies)
  const normalizedYield = Normalize(accumulatedYields)

  // Create trace for accumulated yield

  const trace1 = {
    type: "scatter",
    mode: "lines",
    name: 'Normalized Supply Evolution',
    x: supplyDates,
    y: normalizedSupply,
    line: { color: 'primary' }
  };

  const trace2 = {
    type: "scatter",
    mode: "lines",
    name: 'Normalized yield',
    x: yieldDates,
    y: normalizedYield,
    line: { color: '#17BECF' }
  };

  // Define data array
  const _data = [trace1, trace2];

  // Define layout options
  const layout = {
    title: '',
    autosize: false,
      width: 500,
      height: 400,
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      },
    xaxis: {
      title: '',
      type: 'date',
      rangeselector: {
        buttons: [
          {
            count: 1,
            label: '1m',
            step: 'month',
            stepmode: 'backward'
          },
          {
            count: 6,
            label: '6m',
            step: 'month',
            stepmode: 'backward'
          },
          { step: 'all' }
        ]
      }
    },
    yaxis: { title: '' }
  };


return (
  <Plot
    data={_data}
    layout={layout}
/>
)

};