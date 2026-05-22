import { useState, useCallback } from 'react';

const useAudioGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateWhiteNoise = useCallback(async (scenario) => {
    setIsGenerating(true);
    setError(null);

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const sampleRate = 44100;
      const duration = 10;
      const samples = sampleRate * duration;
      
      const buffer = audioContext.createBuffer(1, samples, sampleRate);
      const channelData = buffer.getChannelData(0);
      
      // 增加随机种子，使每次生成的声音都有差异
      const randomSeed = Math.random();
      const noiseProfile = getNoiseProfile(scenario, randomSeed);
      
      for (let i = 0; i < samples; i++) {
        const time = i / sampleRate;
        let sample = generateSample(scenario, time, i, randomSeed);
        
        sample *= noiseProfile.amplitude;
        sample *= noiseProfile.frequencyModulation(time);
        
        channelData[i] = Math.max(-0.8, Math.min(0.8, sample));
      }
      
      const wavData = audioBufferToWav(buffer);
      const blob = new Blob([wavData], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      return {
        url,
        blob,
        scenario,
        duration,
        sampleRate
      };
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const getNoiseProfile = (scenario, randomSeed) => {
    const baseProfiles = {
      sleep: {
        amplitude: 0.3,
        frequencyModulation: (time) => 0.7 + 0.1 * Math.sin(time * 0.3),
      },
      office: {
        amplitude: 0.4,
        frequencyModulation: (time) => 0.8 + 0.2 * Math.sin(time * 1.5),
      },
      subway: {
        amplitude: 0.5,
        frequencyModulation: (time) => 0.9 + 0.1 * Math.sin(time * 2.0),
      },
      rain: {
        amplitude: 0.4,
        frequencyModulation: (time) => 0.8 + 0.3 * Math.sin(time * 0.8),
      },
      forest: {
        amplitude: 0.3,
        frequencyModulation: (time) => 0.6 + 0.4 * Math.sin(time * 1.8),
      },
      cafe: {
        amplitude: 0.45,
        frequencyModulation: (time) => 0.75 + 0.25 * Math.sin(time * 1.2),
      }
    };
    
    // 检查是否为预设场景
    const profile = baseProfiles[scenario] || null;
    
    if (profile) {
      // 添加随机变化
      const variation = 0.2 * (randomSeed - 0.5);
      return {
        ...profile,
        amplitude: profile.amplitude * (1 + variation),
        frequencyModulation: (time) => profile.frequencyModulation(time) * (1 + 0.3 * Math.sin(time * 0.1 + randomSeed * 10))
      };
    } else {
      // 自定义场景使用默认配置
      const variation = 0.3 * (randomSeed - 0.5);
      return {
        amplitude: 0.35 * (1 + variation),
        frequencyModulation: (time) => 0.7 + 0.3 * Math.sin(time * 1.2 + randomSeed * 8)
      };
    }
  };

  const generateSample = (scenario, time, index, randomSeed) => {
    let sample = 0;
    const randomFactor = 1 + 0.5 * (randomSeed - 0.5);
    
    // 检查是否为预设场景
    const presetScenarios = ['sleep', 'office', 'subway', 'rain', 'forest', 'cafe'];
    
    if (presetScenarios.includes(scenario)) {
      switch (scenario) {
        case 'sleep':
          sample = (Math.random() * 2 - 1) * 0.1 * randomFactor;
          sample += Math.sin(time * 20 + randomSeed * 5) * 0.05;
          sample += Math.sin(time * 40 + randomSeed * 3) * 0.02;
          break;
          
        case 'office':
          sample = (Math.random() * 2 - 1) * 0.15 * randomFactor;
          sample += Math.sin(time * 100 + randomSeed * 8) * 0.03;
          sample += Math.sin(time * 200 + randomSeed * 6) * 0.01;
          break;
          
        case 'subway':
          sample = (Math.random() * 2 - 1) * 0.2 * randomFactor;
          sample += Math.sin(time * 30 + randomSeed * 4) * 0.08;
          sample += Math.sin(time * 80 + randomSeed * 2) * 0.04;
          break;
          
        case 'rain':
          sample = (Math.random() * 2 - 1) * 0.25 * randomFactor;
          sample += Math.sin(time * 300 + randomSeed * 10) * 0.02;
          sample += Math.sin(time * 500 + randomSeed * 7) * 0.01;
          sample += Math.sin(time * 800 + randomSeed * 5) * 0.005;
          if (Math.random() < 0.1) {
            sample += Math.random() * 0.1 * Math.exp(-Math.random() * 10);
          }
          break;
          
        case 'forest':
          sample = (Math.random() * 2 - 1) * 0.12 * randomFactor;
          sample += Math.sin(time * 80 + randomSeed * 6) * 0.04;
          sample += Math.sin(time * 150 + randomSeed * 4) * 0.02;
          if (Math.random() < 0.05) {
            sample += Math.random() * 0.08 * Math.sin(time * 400 + randomSeed * 12);
          }
          break;
          
        case 'cafe':
          sample = (Math.random() * 2 - 1) * 0.18 * randomFactor;
          // 咖啡机声音
          if (Math.random() < 0.02) {
            sample += Math.random() * 0.15 * Math.sin(time * 200 + randomSeed * 15);
          }
          // 杯碟碰撞声
          if (Math.random() < 0.01) {
            sample += Math.random() * 0.1 * Math.exp(-Math.random() * 5);
          }
          // 人声低语
          sample += Math.sin(time * 50 + randomSeed * 7) * 0.03;
          sample += Math.sin(time * 80 + randomSeed * 5) * 0.02;
          break;
      }
    } else {
      // 自定义场景的生成逻辑 - 添加更多环境音效变化
      sample = (Math.random() * 2 - 1) * 0.15 * randomFactor;
      
      // 根据场景关键词添加特定音效
      const scenarioLower = scenario.toLowerCase();
      
      // 咖啡厅环境音效
      if (scenarioLower.includes('咖啡') || scenarioLower.includes('cafe') || scenarioLower.includes('coffee')) {
        // 咖啡机声音
        if (Math.random() < 0.02) {
          sample += Math.random() * 0.15 * Math.sin(time * 200 + randomSeed * 15);
        }
        // 杯碟碰撞声
        if (Math.random() < 0.01) {
          sample += Math.random() * 0.1 * Math.exp(-Math.random() * 5);
        }
        // 人声低语
        sample += Math.sin(time * 50 + randomSeed * 7) * 0.03;
        sample += Math.sin(time * 80 + randomSeed * 5) * 0.02;
      }
      // 菜市场环境音效
      else if (scenarioLower.includes('菜市') || scenarioLower.includes('市场') || scenarioLower.includes('market')) {
        // 人声嘈杂
        sample += Math.sin(time * 60 + randomSeed * 9) * 0.04;
        sample += Math.sin(time * 90 + randomSeed * 6) * 0.03;
        // 叫卖声
        if (Math.random() < 0.015) {
          sample += Math.random() * 0.12 * Math.sin(time * 150 + randomSeed * 20);
        }
        // 推车声
        if (Math.random() < 0.008) {
          sample += Math.random() * 0.08 * Math.sin(time * 40 + randomSeed * 3);
        }
      }
      // 飞机环境音效
      else if (scenarioLower.includes('飞机') || scenarioLower.includes('飞行') || scenarioLower.includes('airplane') || scenarioLower.includes('flight')) {
        // 引擎轰鸣声
        sample += Math.sin(time * 25 + randomSeed * 2) * 0.1;
        sample += Math.sin(time * 35 + randomSeed * 1) * 0.08;
        // 气流声
        sample += (Math.random() * 2 - 1) * 0.05;
        // 广播声
        if (Math.random() < 0.005) {
          sample += Math.random() * 0.15 * Math.sin(time * 100 + randomSeed * 25);
        }
      }
      // 海浪环境音效
      else if (scenarioLower.includes('海浪') || scenarioLower.includes('海边') || scenarioLower.includes('ocean') || scenarioLower.includes('beach')) {
        // 海浪声
        sample += Math.sin(time * 0.5 + randomSeed * 0.3) * 0.15;
        sample += Math.sin(time * 1.2 + randomSeed * 0.7) * 0.1;
        // 海鸥叫声
        if (Math.random() < 0.003) {
          sample += Math.random() * 0.2 * Math.sin(time * 300 + randomSeed * 30);
        }
        // 风声
        sample += (Math.random() * 2 - 1) * 0.03;
      }
      // 图书馆环境音效
      else if (scenarioLower.includes('图书') || scenarioLower.includes('图书馆') || scenarioLower.includes('library')) {
        // 翻书声
        if (Math.random() < 0.01) {
          sample += Math.random() * 0.08 * Math.exp(-Math.random() * 3);
        }
        // 轻微脚步声
        if (Math.random() < 0.005) {
          sample += Math.random() * 0.05 * Math.sin(time * 30 + randomSeed * 2);
        }
        // 空调声
        sample += Math.sin(time * 10 + randomSeed * 0.5) * 0.02;
      }
      // 默认环境音效
      else {
        sample += Math.sin(time * 50 + randomSeed * 7) * 0.05;
        sample += Math.sin(time * 120 + randomSeed * 5) * 0.03;
        sample += Math.sin(time * 250 + randomSeed * 3) * 0.01;
        
        // 添加一些随机脉冲效果
        if (Math.random() < 0.02) {
          sample += Math.random() * 0.1 * Math.exp(-Math.random() * 5);
        }
      }
    }
    
    return sample;
  };

  const audioBufferToWav = (buffer) => {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    
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

  return {
    generateWhiteNoise,
    isGenerating,
    error
  };
};

export default useAudioGenerator;
