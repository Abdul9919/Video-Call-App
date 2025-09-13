import React, {useState} from 'react'
import SocketContext from '../Contexts/SocketContext.jsx'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [room, setRoom] = useState('')
  const navigate = useNavigate()
  const socket = useContext(SocketContext)

  const handleRoomJoin = (e) => {
    e.preventDefault()
    socket.emit('join', { room })
    navigate(`/room/${room}`)
  }
  
  return (
    <>
    <form action="" onSubmit={handleRoomJoin}>
      <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} />
    </form>
    </>
  )
}

export default Home