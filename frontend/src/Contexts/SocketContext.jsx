import React from 'react'
import { io } from 'socket.io-client'

const SocketContext = React.createContext();

export const SocketProvider = ({children}) => {

    const apiUrl = import.meta.env.VITE_API_URL;

    const socket = io(apiUrl);

    
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketContext; 