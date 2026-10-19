


import { useState, useRef, useEffect } from "react";
import {
    Pause,
    Play,
    Maximize,
    Volume2,
    VolumeX,
    Settings2
} from "lucide-react";

const Editorial = ({ secureUrl, thumbnailUrl, duration = 0 }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(duration || 0);
    const [isHovering, setIsHovering] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);

    const formatTime = (seconds) => {
        if (!Number.isFinite(seconds) || seconds < 0) {
            return "0:00";
        }

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${mins}:${String(secs).padStart(2, "0")}`;
    };

    const togglePlayPause = async () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            try {
                await video.play();
            } catch (error) {
                console.error("Unable to play video:", error);
            }
        } else {
            video.pause();
        }
    };

    const handleSeek = (e) => {
        const video = videoRef.current;
        if (!video) return;

        const time = Number(e.target.value);
        video.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolumeChange = (e) => {
        const video = videoRef.current;
        const newVolume = Number(e.target.value);

        setVolume(newVolume);
        setIsMuted(newVolume === 0);

        if (video) {
            video.volume = newVolume;
            video.muted = newVolume === 0;
        }
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const handlePlaybackRate = (e) => {
        const rate = Number(e.target.value);
        setPlaybackRate(rate);

        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
        }
    };

    const toggleFullscreen = async () => {
        const container = containerRef.current;
        if (!container) return;

        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await container.requestFullscreen();
            }
        } catch (error) {
            console.error("Fullscreen error:", error);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };

        const handleLoadedMetadata = () => {
            if (Number.isFinite(video.duration)) {
                setVideoDuration(video.duration);
            }
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("durationchange", handleLoadedMetadata);
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);
        video.addEventListener("ended", handleEnded);

        if (video.readyState >= 1 && Number.isFinite(video.duration)) {
            setVideoDuration(video.duration);
        }

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("durationchange", handleLoadedMetadata);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
            video.removeEventListener("ended", handleEnded);
        };
    }, [secureUrl]);

    useEffect(() => {
        setCurrentTime(0);
        setIsPlaying(false);
        setVideoDuration(duration || 0);
    }, [secureUrl, duration]);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div
                ref={containerRef}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onKeyDown={(e) => {
                    if (
                        e.target === containerRef.current &&
                        (e.code === "Space" || e.code === "Enter")
                    ) {
                        e.preventDefault();
                        togglePlayPause();
                    }
                }}
                tabIndex={0}
                role="region"
                aria-label="Editorial video player"
                className="group relative isolate overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] shadow-2xl shadow-black/30 outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                {/* Video */}
                <video
                    ref={videoRef}
                    src={secureUrl}
                    poster={thumbnailUrl}
                    preload="metadata"
                    playsInline
                    onClick={togglePlayPause}
                    className="block aspect-video w-full cursor-pointer bg-black object-contain"
                />

                

                {/* Top label */}
                <div
                    className={`pointer-events-none absolute left-4 top-4 transition-opacity duration-300 ${
                        isHovering || !isPlaying
                            ? "opacity-100"
                            : "opacity-0"
                    }`}
                >
                    <span className="badge border border-white/15 bg-black/60 px-3 py-3 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
                        <span className="mr-1.5 h-2 w-2 rounded-full bg-primary" />
                        EDITORIAL
                    </span>
                </div>

                {/* Center play button */}
                {!isPlaying && (
                    <button
                        type="button"
                        onClick={togglePlayPause}
                        aria-label="Play video"
                        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-primary text-primary-content shadow-xl transition duration-200 hover:scale-110 hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:h-20 sm:w-20"
                    >
                        <Play size={30} fill="currentColor" className="ml-1" />
                    </button>
                )}

                {/* Bottom controls */}
                <div
                    className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-3 pb-3 pt-16 transition-opacity duration-300 sm:px-5 sm:pb-5 ${
                        isHovering || !isPlaying
                            ? "opacity-100"
                            : "pointer-events-none opacity-0"
                    }`}
                >
                    {/* Progress bar */}
                    <input
                        type="range"
                        min="0"
                        max={videoDuration || 0}
                        step="0.1"
                        value={Math.min(currentTime, videoDuration || 0)}
                        onChange={handleSeek}
                        disabled={!videoDuration}
                        aria-label="Seek video"
                        className="range range-primary range-xs mb-3 block w-full cursor-pointer"
                        style={{
                            "--range-shdw": "var(--color-primary)"
                        }}
                    />

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-3 text-white">
                        {/* Play / Pause */}
                        <button
                            type="button"
                            onClick={togglePlayPause}
                            className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/15"
                            aria-label={isPlaying ? "Pause video" : "Play video"}
                        >
                            {isPlaying ? (
                                <Pause size={20} fill="currentColor" />
                            ) : (
                                <Play size={20} fill="currentColor" />
                            )}
                        </button>

                        {/* Time */}
                        <span className="whitespace-nowrap font-mono text-xs text-white/90 sm:text-sm">
                            {formatTime(currentTime)}
                            <span className="mx-1 text-white/40">/</span>
                            {formatTime(videoDuration)}
                        </span>

                        <div className="flex-1" />

                        {/* Volume */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={toggleMute}
                                className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/15"
                                aria-label={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? (
                                    <VolumeX size={19} />
                                ) : (
                                    <Volume2 size={19} />
                                )}
                            </button>

                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                aria-label="Volume"
                                className="range range-primary range-xs w-16 sm:w-20"
                            />
                        </div>

                        {/* Playback speed */}
                        <div className="dropdown dropdown-top dropdown-end">
                            <button
                                type="button"
                                tabIndex={0}
                                className="btn btn-ghost btn-sm gap-1 px-2 text-white hover:bg-white/15"
                                aria-label="Playback speed"
                            >
                                <Settings2 size={17} />
                                <span className="text-xs">{playbackRate}x</span>
                            </button>

                            <ul
                                tabIndex={0}
                                className="dropdown-content menu z-20 mb-2 w-32 rounded-xl border border-white/10 bg-[#18181b] p-2 text-sm text-white shadow-xl"
                            >
                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                    <li key={rate}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPlaybackRate(rate);
                                                if (videoRef.current) {
                                                    videoRef.current.playbackRate = rate;
                                                }
                                                document.activeElement?.blur();
                                            }}
                                            className={
                                                playbackRate === rate
                                                    ? "active"
                                                    : ""
                                            }
                                        >
                                            {rate}x
                                            {playbackRate === rate && (
                                                <span className="ml-auto">✓</span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Fullscreen */}
                        <button
                            type="button"
                            onClick={toggleFullscreen}
                            className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/15"
                            aria-label="Toggle fullscreen"
                        >
                            <Maximize size={19} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editorial;
