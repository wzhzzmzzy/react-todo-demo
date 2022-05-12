import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '@mui/material/Button'

function Counter () {
  const [searchParams, setSearchParams] = useSearchParams()

  const [count, setCount] = useState(
    Number(searchParams.get('count')) ?? 1
  )
  const increment = () => setCount((count) => count + 1)

  useEffect(() => {
    setSearchParams({ count: String(count) })
  }, [count])

  return (
    <Button type="button" onClick={increment}>
      count is: {count}
    </Button>
  )
}

export default function App () {
  return (
    <main className="main">
      <div><Counter /></div>
    </main>
  )
}
