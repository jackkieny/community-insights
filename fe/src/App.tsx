import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import '@mantine/core/styles.css'

import { NothingFoundBackground } from "./components/Error/NothingFoundBackground"
import { Home } from "./components/home/Home"
import { Login } from "./components/login/Login"
import { Register } from "./components/register/Register"
import { Dashboard } from "./components/dashboard/Dashboard"
import { Community } from "./components/dashboard/community/Community"
import { Planner } from "./components/dashboard/planner/Planner"

function App() {

  return (
    <Router>
      <Routes>
        <Route path='*' element={<NothingFoundBackground />} />
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='community' element={<Community />} />
          <Route path='planner' element={<Planner />} />
          <Route path='settings' element={<h1>Settings</h1>} />
          <Route path='account' element={<h1>Account</h1>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
