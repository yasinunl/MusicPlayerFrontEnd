const SongList = ({ songs, currentSongIndex, onSongSelect }) => {
    return (
        <ul className="song-list">
            {songs.map((song, index) => (
                <li key={index} className={currentSongIndex === index ? 'active' : ''}>
                    <button onClick={() => onSongSelect(index)}>{song.title}</button>
                </li>
            ))}
        </ul>
    );
};

export default SongList;