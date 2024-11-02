import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import '@mantine/core/styles.css'

import { NothingFoundBackground } from "./components/Error/NothingFoundBackground"
import { Home } from "./components/home/Home"
import { Login } from "./components/login/Login"
import { Register } from "./components/register/Register"

function App() {

  return (
    <Router>
      <Routes>
        <Route path='*' element={<NothingFoundBackground />} />
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
