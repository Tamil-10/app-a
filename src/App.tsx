import { useState, useEffect } from 'react'
import { getAgent } from '@finos/fdc3'
import './App.css'

function App() {
  const [receivedValue, setReceivedValue] = useState<number | null>(null)

  useEffect(() => {
    getAgent().then((fdc3) => {
      console.log('FDC3 ready in App A')
      fdc3.addIntentListener('CounterValue', (context: any) => {
        console.log('Received CounterValue', context)
        if (context.type === 'fdc3.counter' && context.id?.value !== undefined) {
          setReceivedValue(context.id.value)
        }
      })
    }).catch((err) => console.error('FDC3 not available', err))
  }, [])

  const raiseIncrementIntent = () => {
    getAgent().then((fdc3) => {
      fdc3.raiseIntent('IncrementCounter', { type: 'fdc3.counter', id: { increment: 1 } })
    }).catch((err) => console.error('FDC3 not available', err))
  }

  return (
    <div>
      <h1>App A</h1>
      <button onClick={raiseIncrementIntent}>Increment Counter</button>
      {receivedValue !== null && <p>Received Counter Value: {receivedValue}</p>}
    </div>
  )
}

export default App
