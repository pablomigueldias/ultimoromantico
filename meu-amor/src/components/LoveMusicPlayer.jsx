// src/components/LoveMusicPlayer.jsx
import {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";
import "./LoveMusicPlayer.css";

const playlist = [
    {
        title: "A vida é boa com você",
        artist: "Romantic Beats",
        src: "/music/Kali Uchis - Moonlight (Official Lyric Video) - KALI UCHIS (youtube).mp3",
    },
    {
        title: "Nosso Cantinho",
        artist: "Soft Love",
        src: "/music/Kali Uchis - Moonlight (Official Lyric Video) - KALI UCHIS (youtube).mp3",
    },
    {
        title: "Para Sempre Nós",
        artist: "Heart Piano",
        src: "/music/Kali Uchis - Moonlight (Official Lyric Video) - KALI UCHIS (youtube).mp3",
    },
];

const LoveMusicPlayer = forwardRef(function LoveMusicPlayer(_, ref) {
    const audioRef = useRef(null);
    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);
    const analyzerRef = useRef(null);
    const dataArrayRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(0);
    const [beat, setBeat] = useState(0);
    const [volume, setVolume] = useState(0.8);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    // monta AudioContext + analyser
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = volume;

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext ||
                window.webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;

        if (!sourceRef.current) {
            sourceRef.current = audioContext.createMediaElementSource(audio);

            analyzerRef.current = audioContext.createAnalyser();
            analyzerRef.current.fftSize = 256;

            sourceRef.current.connect(analyzerRef.current);
            analyzerRef.current.connect(audioContext.destination);

            dataArrayRef.current = new Uint8Array(
                analyzerRef.current.frequencyBinCount
            );
        }

        function animateHeart() {
            if (analyzerRef.current && dataArrayRef.current) {
                analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
                const bass = dataArrayRef.current[1] / 255;
                setBeat(bass);
            }
            requestAnimationFrame(animateHeart);
        }

        animateHeart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // listeners de tempo
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration || 0);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime || 0);
        };

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [currentSong]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio
                .play()
                .then(() => {
                    if (audioContextRef.current?.state === "suspended") {
                        audioContextRef.current.resume();
                    }
                    setIsPlaying(true);
                })
                .catch(() => { });
        }
    };

    const changeSong = (index) => {
        const audio = audioRef.current;
        if (!audio) return;

        setCurrentSong(index);
        audio.src = playlist[index].src;
        audio.load();
        audio.volume = volume;
        setCurrentTime(0);

        if (isPlaying) {
            audio
                .play()
                .then(() => {
                    if (audioContextRef.current?.state === "suspended") {
                        audioContextRef.current.resume();
                    }
                })
                .catch(() => { });
        }
    };

    const nextSong = () =>
        changeSong((currentSong + 1) % playlist.length);

    const prevSong = () =>
        changeSong((currentSong - 1 + playlist.length) % playlist.length);

    const handleVolumeChange = (e) => {
        const value = Number(e.target.value);
        setVolume(value);
        if (audioRef.current) {
            audioRef.current.volume = value;
        }
    };

    const handleSeekChange = (e) => {
        const value = Number(e.target.value); // 0 a 100
        if (!duration || !audioRef.current) return;
        const newTime = (value / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    // API pro App controlar por causa do vídeo
    useImperativeHandle(ref, () => ({
        pauseForVideo() {
            const audio = audioRef.current;
            if (!audio) return;

            audio.pause();
            setIsPlaying(false);
        },
        resumeAfterVideo() {
            const audio = audioRef.current;
            if (!audio) return;

            audio
                .play()
                .then(() => {
                    if (audioContextRef.current?.state === "suspended") {
                        audioContextRef.current.resume();
                    }
                    setIsPlaying(true);
                })
                .catch(() => { });
        },
    }));

    return (
        <div className="love-player">
            <audio
                ref={audioRef}
                src={playlist[currentSong].src}
                onEnded={nextSong}
            ></audio>

            {/* linha de cima */}
            <div className="top-row">
                <div className="love-player-left">
                    <div
                        className="heart"
                        style={{ transform: `scale(${1 + beat * 0.4})` }}
                    >
                        ❤️
                    </div>

                    <div className="song-info">
                        <h4>{playlist[currentSong].title}</h4>
                        <span>{playlist[currentSong].artist}</span>
                    </div>
                </div>

                <div className="controls">
                    <button onClick={prevSong}>⏮</button>
                    <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶️"}</button>
                    <button onClick={nextSong}>⏭</button>
                </div>

                <div className="volume">
                    <span className="volume-icon">🔈</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                </div>

                <div className="equalizer">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="bar"
                            style={{
                                height: `${18 + Math.sin(beat * 8 + i) * 16}px`,
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* progresso */}
            <div className="progress">
                <span className="time">{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercent}
                    onChange={handleSeekChange}
                />
                <span className="time">{formatTime(duration)}</span>
            </div>

            {/* playlist visual */}
            <div className="playlist">
                {playlist.map((song, index) => (
                    <button
                        key={song.src}
                        className={`playlist-item ${index === currentSong ? "active" : ""
                            }`}
                        onClick={() => changeSong(index)}
                    >
                        <span className="playlist-title">{song.title}</span>
                        <span className="playlist-artist">{song.artist}</span>
                    </button>
                ))}
            </div>
        </div>
    );
});

export default LoveMusicPlayer;
