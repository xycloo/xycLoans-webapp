import dynamic from 'next/dynamic'
import { convertTimestampsToDates, parseBase64Yield, parseTimestamp, timestampsToDates, toHex } from '../helpers/dataParsing';
import { stroopsToXLM } from '../pools/getPools';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export const AccountBalanceChart = (params) => {
  // Extract timestamps and yields from data
  const timestamps = params.data.map(entry => parseTimestamp(entry.timestamp))
  let dates = timestampsToDates(timestamps, false)
  let balances = params.data.map(entry => stroopsToXLM(parseInt(toHex(entry.balance), 16)), 3)
  
  //if (params.data.length === 1) {
    balances.unshift(0);
    dates.unshift(new Date(timestamps[0] - 10000000))
  //}

  //console.log(supplies)
  
  // Create trace for accumulated yield

  const trace1 = {
    type: "scatter",
    mode: "lines",
    name: 'Supply Evolution',
    x: dates,
    y: balances,
    line: { color: '#17BECF' }
  };

  // Define data array
  const _data = [trace1];

  // Define layout options
  const layout = {
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