import React, {useRef} from 'react'
import './App.css'

function App() {
  const videoRef = useRef();

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      videoRef.current.srcObject = stream;
    });

  return (
    <>
      <video autoPlay playsInline ref={videoRef} />
    </>
  )
}

export default App
