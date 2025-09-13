import React, { useEffect, useRef } from 'react'
import { peerConnection } from '../Utils/RTCConnection'
import SocketContext from '../Contexts/SocketContext.jsx'
import { useParams } from "react-router-dom";
const Room = () => {

    const socket = React.useContext(SocketContext)
    const { id } = useParams()
    const localRef = useRef()
    const remoteRef = useRef()

    useEffect(() => {
        const handleBeforeUnload = () => {
            socket.emit("leave", { room: id });
        };

        // When tab closes or refreshes
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            // When component unmounts (navigating away)
            socket.emit("leave", { room: id });
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [id, socket]);

    const handleRoomJoined = async ({ room }) => {
        try {
            console.log(`Joined room: ${room}`);

            const localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            localRef.current.srcObject = localStream

            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });

            // ✅ Wait for offer
            const offer = await peerConnection.createOffer();

            console.log("Generated offer:", offer);

            // ✅ Set local description with the offer
            await peerConnection.setLocalDescription(offer);

            // ✅ Send the offer to the signaling server
            socket.emit("offer", { offer, room: id });
        } catch (error) {
            console.error("Error creating or setting offer:", error);
        }
    };

    const handleOfferReceived = async ({ offer, room }) => {
        console.log('Offer received:', offer)

        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localRef.current.srcObject = localStream;
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        socket.emit('answer', { answer, room })
    }


    // const getLocalStream = async () => {

    // }

    // useEffect(() => {
    //     getLocalStream()
    // }, [])

    const handleAnswerReceived = async ({ answer, room }) => {
        console.log('Answer received:', answer)
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))

    }
    const handleIceCandidateReceived = async ({ candidate }) => {
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
            console.error("Error adding received ICE candidate", err);
        }
    }

    useEffect(() => {

        peerConnection.ontrack = (event) => {
            console.log("Remote track received:", event.streams);
            const remoteVideo = remoteRef.current;

            // Attach the first remote stream to the <video>
            if (remoteVideo.srcObject !== event.streams[0]) {
                remoteVideo.srcObject = event.streams[0];
            }
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", { candidate: event.candidate, room: id });
            }
        };

        socket.on('joinedRoom', handleRoomJoined)
        socket.on('offer', handleOfferReceived)
        socket.on('answer', handleAnswerReceived)
        socket.on("ice-candidate", handleIceCandidateReceived);

        return () => {
            socket.off('joinedRoom', handleRoomJoined)
            socket.off('offer', handleOfferReceived)
            socket.off('answer', handleAnswerReceived)
            socket.off('ice-candidate', handleIceCandidateReceived);
        }
    }, [])




    return (
        <>
            <div>Room</div>
            <video ref={localRef} autoPlay muted></video>
            <h1>REMOTE STREAM</h1>
            <video ref={remoteRef} autoPlay></video>
        </>
    )
}

export default Room