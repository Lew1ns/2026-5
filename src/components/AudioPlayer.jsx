import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, RotateCcw, Volume2 } from 'lucide-react';

const AudioPlayer = ({ audio, onReset }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const updateTime = () => setCurrentTime(audioElement.currentTime);
    const updateDuration = () => setDuration(audioElement.duration);
    const handleEnded = () => setIsPlaying(false);

    audioElement.addEventListener('timeupdate', updateTime);
    audioElement.addEventListener('loadedmetadata', updateDuration);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', updateTime);
      audioElement.removeEventListener('loadedmetadata', updateDuration);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audioElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audio.url;
    link.download = `natural-sound-${audio.scenario}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getScenarioName = (scenario) => {
    const presetScenarios = {
      sleep: '睡眠白噪音',
      office: '办公白噪音',
      subway: '地铁白噪音',
      rain: '雨声',
      forest: '森林声',
      cafe: '咖啡馆白噪音'
    };
    
    // 如果是预设场景，返回对应的中文名称
    if (presetScenarios[scenario]) {
      return presetScenarios[scenario];
    }
    
    // 否则返回自定义场景名称
    return `${scenario}白噪音`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Volume2 className="h-6 w-6 text-indigo-600 mr-2" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {getScenarioName(audio.scenario)}
            </h3>
            <p className="text-sm text-gray-600">10秒音频片段</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          重新生成
        </button>
      </div>

      <audio
        ref={audioRef}
        src={audio.url}
        preload="metadata"
        className="hidden"
      />

      <div className="space-y-4">
        {/* 播放控制 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </button>

          <div className="flex-1">
            <div
              className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{
                  width: duration ? `${(currentTime / duration) * 100}%` : '0%'
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <button
            onClick={downloadAudio}
            className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
            title="下载音频"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>

        {/* 音量控制 */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">音量:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600 w-8">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
