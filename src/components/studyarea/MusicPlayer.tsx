'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

const playlist = [
  { name: 'Rain Sounds', url: '/sounds/rain.mp3' },
  { name: 'Lo-fi Vibes', url: '/sounds/lofi.mp3' },
  { name: 'Forest Calm', url: '/sounds/forest.mp3' },
  { name: 'Stream', url: '/sounds/river.mp3' },
  { name: 'Coffee Shop', url: '/sounds/cofee-shop.mp3' }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(playlist[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl shadow-md">
      <select
        className="mb-2 rounded p-1"
        value={currentTrack.name}
        onChange={(e) => {
          const track = playlist.find(t => t.name === e.target.value)!;
          setCurrentTrack(track);
          setIsPlaying(false);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
          }
        }}
      >
        {playlist.map(track => (
          <option key={track.name} value={track.name}>
            {track.name}
          </option>
        ))}
      </select>
      <Button onClick={togglePlay} variant="secondary">
        {isPlaying ? 'Pause Music' : 'Play Music'}
      </Button>
      <audio ref={audioRef} loop>
        <source src={currentTrack.url} type="audio/mp3" />
      </audio>
    </div>
  );
}
