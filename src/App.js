import './style.css';
import MusicPlayer from './MusicPlayer';
import SongList from './SongList';
import { useEffect, useState } from 'react';
import Login from './Login';
import axios from 'axios';
import {
  StompSessionProvider,
} from "react-stomp-hooks";

const songs = [
  { title: 'Song 1', audioSrc: 'musics/song1.mp3', coverArt: 'https://picsum.photos/400/600' },
  { title: 'Song 2', audioSrc: 'musics/song2.mp3', coverArt: 'https://picsum.photos/400/599' },
  { title: 'Song 3', audioSrc: 'musics/song3.mp3', coverArt: 'https://picsum.photos/400/598' },
];

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState("");
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // State for alert type

  const handleLogin = (email, password) => {
    const auth = async (email, password) => {
      await axios.post("http://localhost:8080/api/v1.0/user/login",
        { "email": email, "password": password })
        .then((response => {
          setAlertMessage('Login successful!');
          setAlertType('success');
          setUser(response.data.email);
          setTimeout(() => {
            setIsLoggedIn(true);
            setIsLoginModalOpen(false);
          }, 1500);
        }))
        .catch(err => {
          setAlertMessage('Invalid username or password');
          setAlertType('error');
          setTimeout(() => {
            setAlertMessage("")
          }, 1500);
        })
    }
    auth(email, password)
  };

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => Math.min(prevIndex + 1, songs.length - 1));
  };

  const handleSongSelect = (newIndex) => {
    setCurrentSongIndex(newIndex);
  };
  useEffect(() => {
    function makeid(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }
    const sessionID = makeid(10)
    localStorage.setItem("sessionID", sessionID)
  }, [])
  return (<>
    <div className="music-app">
      <StompSessionProvider url={'http://localhost:8080/api/v1.0/ws-endpoint'} >
      {isLoggedIn ? (
        <>
          <MusicPlayer
            songs={songs}
            currentSongIndex={currentSongIndex}
            onPrevious={handlePrevious}
            onNext={handleNext}
            user={user}
          />
          <SongList
            songs={songs}
            currentSongIndex={currentSongIndex}
            onSongSelect={handleSongSelect}
          />
        </>
      ) : (
        <button onClick={handleLoginModalOpen}>Login</button>
      )}</StompSessionProvider>
      <Login
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onLogin={handleLogin}
        alertMessage={alertMessage}
        alertType={alertType}
      />
    </div>
    </>
  );
}

export default App;
