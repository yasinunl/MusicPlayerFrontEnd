import React, { useState, useRef, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {
    useStompClient,
    useSubscription,
} from "react-stomp-hooks";
import Alert from './Alert';

const MusicPlayer = ({ songs, currentSongIndex, onPrevious, onNext, user }) => {
    const audioRef = useRef(null);
    const stompClient = useStompClient();
    const sessionID = localStorage.getItem("sessionID");
    const [message, setMessage] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    // Getting message, which came from server
    useSubscription('/queue/reply-' + sessionID, (message) => { setMessage(message.body) });
    useEffect(() => {
        if (message === "paused") { // If someone plays music with same email, it is going to turn "paused"
            audioRef.current.audio.current.pause(); // Stop music player
            setAlertType("error");
            setAlertMessage("Music is stopped. Someone is playing at the same time");
        }
        if (message === "paused message")
            {
                setAlertType("success");
                setAlertMessage("Other client's music player is stopped");
            }
        setTimeout(()=> {setAlertMessage("");}, 20000)
    }, [message])

    return (
        <div className="music-player">
            {alertMessage && <Alert message={alertMessage} type={alertType} />}
            <img src={songs[currentSongIndex].coverArt} alt="Album cover" />
            <AudioPlayer
                ref={audioRef}
                src={songs[currentSongIndex].audioSrc}
                onPlay={() => {
                    // Send message for playing
                    // We are sending user email on message
                    stompClient.publish({ destination: '/app/play', body: user, headers: { "sessionID": sessionID } })
                }}
                onPause={() => {
                    // Send message for pausing
                    stompClient.publish({ destination: '/app/pause', body: user, headers: { "sessionID": sessionID } })
                }}
            />
            <div className="controls">
                <button onClick={onPrevious} disabled={currentSongIndex === 0}>Previous</button>
                <button onClick={onNext} disabled={currentSongIndex === songs.length - 1}>Next</button>
            </div>
        </div>
    );
};

export default MusicPlayer;
