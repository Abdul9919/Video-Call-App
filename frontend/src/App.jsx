import React from 'react'
import Home from './Components/Home.jsx'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Room from './Components/Room.jsx'
import { SocketProvider } from './Contexts/SocketContext.jsx'

const App = () => {

  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </Router>
    </SocketProvider>
  )
}
export default App