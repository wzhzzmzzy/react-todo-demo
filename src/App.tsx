import { useState } from 'react'
import Button from '@mui/material/Button';
import './styles/app.css'

function Counter () {
  const [count, setCount] = useState(0)

  return (
    <Button type="button" onClick={() => setCount((count) => count + 1)}>
      count is: {count}
    </Button>
  )
}

function App() {
  return (
    <main className="main">
      <div><Counter /></div>
    </main>
  )
}

export default App
