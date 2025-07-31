import React, { useState, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const MusicPlayer = () => {
  const { theme, settings } = useContext(ThemeContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [listeners, setListeners] = useState(0);
  
  const audioRef = useRef(null);
  const wsRef = useRef(null);
  const heartbeatRef = useRef(null);

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    wsRef.current = new WebSocket('wss://listen.moe/gateway_v2');

    wsRef.current.onopen = () => {
      setIsConnected(true);
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    };

    wsRef.current.onmessage = (message) => {
      if (!message.data.length) return;
      
      let response;
      try {
        response = JSON.parse(message.data);
      } catch (error) {
        return;
      }

      switch (response.op) {
        case 0:
          wsRef.current.send(JSON.stringify({ op: 9 }));
          heartbeatRef.current = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({ op: 9 }));
            }
          }, response.d.heartbeat);
          break;
        case 1:
          if (response.t === 'TRACK_UPDATE' || response.t === 'TRACK_UPDATE_REQUEST') {
            setCurrentTrack(response.d);
          }
          if (response.t === 'QUEUE_UPDATE') {
            setListeners(response.d.listeners || 0);
          }
          break;
        default:
          break;
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setTimeout(() => connect(), 5000);
    };
  };

  useEffect(() => {
    connect();
    
    if (audioRef.current) {
      audioRef.current.src = 'https://listen.moe/stream';
      audioRef.current.volume = volume;
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearInterval(heartbeatRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <audio 
        ref={audioRef}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />
      
      <div 
        className={`fixed right-4 bottom-4 z-50 transition-all duration-500 ease-in-out ${
          isExpanded ? 'w-80' : 'w-16'
        } ${settings.animations ? 'animate-fade-in' : ''}`}
        style={{ '--stagger-delay': '2000ms' }}
      >
        {isExpanded && (
          <div className="mb-3 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border border-[var(--border)] rounded-2xl p-4 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xs text-[var(--text-secondary)]">
                  Listen.moe {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                <i className="fas fa-users mr-1"></i>
                {listeners}
              </div>
            </div>

            {currentTrack && (
              <div className="mb-4">
                <div className="flex items-start gap-3">
                  {currentTrack.song?.albums?.[0]?.image && (
                    <img 
                      src={`https://cdn.listen.moe/covers/${currentTrack.song.albums[0].image}`}
                      alt="Album cover"
                      className="w-12 h-12 rounded-lg object-cover border border-[var(--border)]"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--text)] truncate">
                      {currentTrack.song?.title || 'Unknown Title'}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] truncate">
                      {currentTrack.song?.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}
                    </div>
                    {currentTrack.song?.albums?.[0]?.name && (
                      <div className="text-xs text-[var(--text-secondary)] truncate">
                        {currentTrack.song.albums[0].name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <button
                onClick={togglePlay}
                className={`w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] flex items-center justify-center hover:bg-[var(--accent-secondary)] transition-colors duration-300 ${
                  settings.animations ? 'hover-scale' : ''
                }`}
              >
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} ${isPlaying ? '' : 'ml-0.5'}`}></i>
              </button>
              
              <div className="flex-1 mx-3">
                <div className="flex items-center gap-2">
                  <i className="fas fa-volume-down text-[var(--text-secondary)] text-xs"></i>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-1 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer volume-slider"
                  />
                  <i className="fas fa-volume-up text-[var(--text-secondary)] text-xs"></i>
                </div>
              </div>
              
              <span className="text-xs text-[var(--text-secondary)] min-w-max">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {isPlaying && (
              <div className="flex items-center justify-center gap-1 mb-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-[var(--accent)] rounded-full music-bar"
                      style={{
                        height: '8px',
                        animationDelay: `${i * 0.1}s`,
                        animation: settings.animations ? 'musicBar 1s ease-in-out infinite alternate' : 'none'
                      }}
                    ></div>
                  ))}
                </div>
                <span className="text-xs text-[var(--accent)] ml-2">Now Playing</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-16 h-16 rounded-full bg-[var(--bg-secondary)]/95 backdrop-blur-xl border border-[var(--border)] flex items-center justify-center shadow-2xl transition-all duration-300 group ${
            settings.glowEffects ? 'glow-effect' : ''
          } ${settings.animations ? 'hover-scale hover-glow' : ''}`}
        >
          {isPlaying ? (
            <div className="flex items-center gap-0.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-[var(--accent)] rounded-full"
                  style={{
                    height: '12px',
                    animationDelay: `${i * 0.1}s`,
                    animation: settings.animations ? 'musicBar 1s ease-in-out infinite alternate' : 'none'
                  }}
                ></div>
              ))}
            </div>
          ) : (
            <i className={`fas fa-music text-[var(--accent)] text-lg transition-transform duration-300 ${
              isConnected ? '' : 'opacity-50'
            }`}></i>
          )}
          
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--bg-secondary)] ${
            isConnected ? 'bg-green-400' : 'bg-red-400'
          }`}></div>
        </button>
      </div>
    </>
  );
};

export default MusicPlayer;