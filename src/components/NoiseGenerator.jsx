import React from 'react';

const NoiseGenerator = () => {
  const generateWhiteNoise = async (scenario, duration = 10, sampleRate = 44100) => {
    try {
      // 创建音频上下文
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // 创建音频缓冲区
      const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
      const channelData = buffer.getChannelData(0);
      
      // 根据场景生成不同的白噪音特性
      const noiseProfile = getNoiseProfile(scenario);
      
      for (let i = 0; i < channelData.length; i++) {
        const time = i / sampleRate;
        let sample = generateSample(scenario, time, i);
        
        // 应用场景特定的频率特性
        sample *= noiseProfile.amplitude;
        sample *= noiseProfile.frequencyModulation(time);
        
        // 限制幅度避免削波
        channelData[i] = Math.max(-0.8, Math.min(0.8, sample));
      }
      
      return buffer;
    } catch (error) {
      console.error('生成白噪音失败:', error);
      throw new Error('音频生成失败');
    }
  };

  const getNoiseProfile = (scenario) => {
    const profiles = {
      sleep: {
        amplitude: 0.3,
        frequencyModulation: (time) => 0.7 + 0.1 * Math.sin(time * 0.3),
        description: '低频稍强，高频柔和，声音平稳'
      },
      office: {
        amplitude: 0.4,
        frequencyModulation: (time) => 0.8 + 0.2 * Math.sin(time * 1.5),
        description: '中高频突出，适合掩盖键盘声、环境声'
      },
      subway: {
        amplitude: 0.5,
        frequencyModulation: (time) => 0.9 + 0.1 * Math.sin(time * 2.0),
        description: '低频和中频增强，模拟交通噪声掩蔽效果'
      }
    };
    
    return profiles[scenario] || profiles.sleep;
  };

  const generateSample = (scenario, time, index) => {
    let sample = 0;
    
    switch (scenario) {
      case 'sleep':
        // 睡眠场景：主要低频成分
        sample = (Math.random() * 2 - 1) * 0.1;
        sample += Math.sin(time * 20) * 0.05; // 低频正弦波
        sample += Math.sin(time * 40) * 0.02;
        break;
        
      case 'office':
        // 办公室场景：中高频成分
        sample = (Math.random() * 2 - 1) * 0.15;
        sample += Math.sin(time * 100) * 0.03; // 中频正弦波
        sample += Math.sin(time * 200) * 0.01; // 高频正弦波
        break;
        
      case 'subway':
        // 地铁场景：低频和中频增强
        sample = (Math.random() * 2 - 1) * 0.2;
        sample += Math.sin(time * 30) * 0.08; // 低频正弦波
        sample += Math.sin(time * 80) * 0.04; // 中频正弦波
        break;
        
      default:
        sample = (Math.random() * 2 - 1) * 0.1;
    }
    
    return sample;
  };

  const audioBufferToWav = (buffer) => {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV文件头
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 44100, true);
    view.setUint32(28, 44100 * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    const channelData = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return arrayBuffer;
  };

  return null; // 这是一个工具组件，不渲染任何内容
};

export default NoiseGenerator;
