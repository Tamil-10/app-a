import { useState, useEffect, useRef } from 'react'
import { getAgent } from '@finos/fdc3'
import './App.css'

function App() {
  const [counter, setCounter] = useState(0)
  const listenerRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false

    getAgent()
      .then((fdc3) => {
        if (cancelled) return

        console.log('FDC3 ready in App B')

        listenerRef.current = fdc3.addIntentListener('IncrementCounter', (context: any) => {
          console.log('Received IncrementCounter', context)
          if (context.type === 'fdc3.counter' && typeof context.id?.increment === 'number') {
            setCounter((prev) => {
              const newValue = prev + context.id.increment
              fdc3.raiseIntent('CounterValue', { type: 'fdc3.counter', id: { value: newValue } })
              return newValue
            })
          }
        })
      })
      .catch((err) => console.error('FDC3 not available', err))

    return () => {
      cancelled = true
      if (listenerRef.current?.unsubscribe) {
        listenerRef.current.unsubscribe()
      }
      listenerRef.current = null
    }
  }, [])

  return (
    <div>
      <h1>App B</h1>
      <p>Counter: {counter}</p>
    </div>
  )
}

export default App
