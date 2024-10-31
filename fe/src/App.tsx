import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import '@mantine/core/styles.css'

import { NothingFoundBackground } from "./components/Error/NothingFoundBackground"
import { Home } from "./components/home/Home"

function App() {

  return (
    <Router>
      <Routes>
        <Route path='*' element={<NothingFoundBackground />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
