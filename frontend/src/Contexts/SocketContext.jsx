import React from 'react'
import { io } from 'socket.io-client'

const SocketContext = React.createContext();

export const SocketProvider = ({children}) => {

    const socket = io('https://incorrect-tribal-tactics-mailto.trycloudflare.com');

    
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketContext; 