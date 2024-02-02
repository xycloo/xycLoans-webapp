export async function fetchPools() {
    const res = await fetch('http://172.232.157.194:5000/graphql', {
        cache: "no-cache",
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
      body: JSON.stringify({
        query: `query MyQuery {
          allZephyrD6Eacc6B192F3Ae14116A75Fac2D1Db6S {
            nodes {
               
                
                timestamp
                contract
                supply
              
            }
          }
          
          allZephyr189C96D767479F9619F1C034467D7231S {
            nodes {
              
                contract
                address
                timestamp
                balance
              
            }
          }
          
          allZephyr9473E79262F2F063D45166Fe1D270D0Fs {
            nodes {
              
                contract
                address
                timestamp
                yieldnorm
                yield
            
            }
          }
          
          allZephyr28439Ed255B6Ccbb589A4635958Eec88S {
            nodes {
              
                contract
                timestamp
                yieldnorm
                yield
              
            }
          }

          allZephyrC4B405471033E73Ec0083Ca915572228S {
            nodes {
                sequence
                timestamp
                contract
                topic1
                topic2
                topic3
                topic4
                data
              
            }
          }
        }`})
    })

  const json_res = await res.json();
  const data = json_res.data;

  return (
    data
  )
}