import { Play, Loader2 } from 'lucide-react';
import ScenarioSelector from '../components/ScenarioSelector';
import AudioPlayer from '../components/AudioPlayer';
import React, { useEffect, useState } from 'react';
import useAudioGenerator from '../hooks/useAudioGenerator';
const Index = () => {
  const [selectedScenario, setSelectedScenario] = useState('');
  const [customScenario, setCustomScenario] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [backgroundClass, setBackgroundClass] = useState('bg-gradient-to-br from-blue-50 to-indigo-100');
  const [floatingIcons, setFloatingIcons] = useState([]);
  const { generateWhiteNoise, isGenerating, error } = useAudioGenerator();

  // 场景背景配置
  const scenarioBackgrounds = {
    sleep: 'bg-gradient-to-br from-indigo-900 to-purple-900',
    office: 'bg-gradient-to-br from-gray-700 to-gray-900',
    subway: 'bg-gradient-to-br from-slate-800 to-slate-900',
    rain: 'bg-gradient-to-br from-blue-800 to-blue-900',
    forest: 'bg-gradient-to-br from-green-900 to-green-800',
    cafe: 'bg-gradient-to-br from-amber-900 to-amber-800'
  };

  // 场景图标配置
  const scenarioIcons = {
    sleep: ['moon', 'star'],
    office: ['pen', 'tablet'], // 修改为钢笔和平板
    subway: ['person', 'luggage'], // 修改为小人和行李
    rain: ['raindrop'], // 只保留雨滴，删除云朵
    forest: ['leaf', 'flower'], // 修改为树叶和花朵
    cafe: ['coffee', 'cup']
  };

  // 处理场景切换
  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
    // 切换场景时清空自定义场景输入
    setCustomScenario('');
    // 切换场景时隐藏音频播放模块
    setGeneratedAudio(null);
    
    // 更新背景 - 修复白屏问题：先设置背景再生成图标
    const newBackgroundClass = scenarioBackgrounds[scenario] || 'bg-gradient-to-br from-blue-50 to-indigo-100';
    setBackgroundClass(newBackgroundClass);
    
    // 生成浮动图标
    if (scenarioIcons[scenario]) {
      generateFloatingIcons(scenarioIcons[scenario]);
    } else {
      setFloatingIcons([]);
    }
  };

  // 生成浮动图标
  const generateFloatingIcons = (icons) => {
    if (!icons || icons.length === 0) {
      setFloatingIcons([]);
      return;
    }

    // 创建更多图标实例，铺满背景
    const iconCount = 15; // 每种图标的数量
    const newIcons = [];
    
    icons.forEach((icon, iconIndex) => {
      for (let i = 0; i < iconCount; i++) {
        // 雨声场景特殊处理：雨滴从上到下垂直移动
        if (icon === 'raindrop') {
          newIcons.push({
            id: `${iconIndex}-${i}`,
            type: icon,
            direction: 'down', // 垂直向下移动
            duration: 20, // 固定20秒，使所有图标速度相同
            delay: Math.random() * 10,
            top: -10, // 从屏幕上方开始
            left: Math.random() * 100, // 0%-100% 宽度
            size: 16 + Math.random() * 24, // 16-40px
            opacity: 0.3 // 固定30%透明度
          });
        } else {
          // 地铁场景中小人图标始终保持从右往左移动
          const direction = icon === 'person' ? 'left' : (Math.random() > 0.5 ? 'left' : 'right');
          newIcons.push({
            id: `${iconIndex}-${i}`,
            type: icon,
            direction: direction,
            duration: 20, // 固定20秒，使所有图标速度相同
            delay: Math.random() * 10,
            top: Math.random() * 90 + 5, // 5%-95% 高度
            left: Math.random() * 100, // 0%-100% 宽度
            size: 16 + Math.random() * 24, // 16-40px
            opacity: 0.3 // 固定30%透明度
          });
        }
      }
    });

    setFloatingIcons(newIcons);
  };

  // 处理自定义场景输入
  const handleCustomScenarioChange = (e) => {
    setCustomScenario(e.target.value);
    // 如果输入自定义场景，恢复默认背景
    setBackgroundClass('bg-gradient-to-br from-blue-50 to-indigo-100');
    // 清空选中的预设场景
    setSelectedScenario('');
    // 隐藏音频播放模块
    setGeneratedAudio(null);
    // 清空浮动图标
    setFloatingIcons([]);
  };

  const handleGenerateNoise = async () => {
    // 优先使用自定义场景，如果自定义场景为空则使用选中的预设场景
    const scenario = customScenario || selectedScenario;
    if (!scenario) {
      alert('请选择一个声音场景或输入自定义场景');
      return;
    }

    try {
      const audio = await generateWhiteNoise(scenario);
      setGeneratedAudio(audio);
    } catch (err) {
      console.error('生成声音失败:', err);
      alert('生成声音失败，请重试');
    }
  };

  const handleReset = async () => {
    // 重新生成时保持音频播放模块显示，只更新音频内容
    const scenario = customScenario || selectedScenario;
    if (!scenario) return;
    
    try {
      const audio = await generateWhiteNoise(scenario);
      setGeneratedAudio(audio);
    } catch (err) {
      console.error('重新生成声音失败:', err);
      alert('重新生成声音失败，请重试');
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-100 ${backgroundClass} py-12 relative overflow-hidden`}>
      {/* 浮动图标 */}
      {floatingIcons.map((icon) => (
        <div
          key={icon.id}
          className={`absolute text-white ${
            icon.direction === 'down' 
              ? 'animate-float-down' 
              : `animate-float-${icon.direction}`
          }`}
          style={{
            top: `${icon.top}%`,
            left: `${icon.left}%`,
            fontSize: `${icon.size}px`,
            opacity: icon.opacity,
            animationDuration: `${icon.duration}s`,
            animationDelay: `${icon.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear'
          }}
        >
          {icon.type === 'moon' && '🌙'}
          {icon.type === 'star' && '⭐'}
          {icon.type === 'pen' && '✒️'} {/* 钢笔 */}
          {icon.type === 'tablet' && '📱'} {/* 平板 */}
          {icon.type === 'person' && '🚶'} {/* 小人 */}
          {icon.type === 'luggage' && '🧳'} {/* 行李 */}
          {icon.type === 'cloud' && '☁️'}
          {icon.type === 'raindrop' && '💧'}
          {icon.type === 'leaf' && '🍃'} {/* 树叶 */}
          {icon.type === 'flower' && '🌸'} {/* 花朵 */}
          {icon.type === 'coffee' && '☕'}
          {icon.type === 'cup' && '🥤'}
        </div>
      ))}

      <div className="max-w-3xl mx-auto px-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-6 drop-shadow-lg ${customScenario || selectedScenario ? (customScenario ? 'text-gray-800' : 'text-white') : 'text-gray-800'}`}>白噪音生成器</h1>
          <p className={`text-lg drop-shadow ${customScenario || selectedScenario ? (customScenario ? 'text-gray-700' : 'text-white') : 'text-gray-700'}`}>
            选择您喜欢的声音场景，生成专属的白噪音音频，帮助您放松、专注或入睡
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onScenarioChange={handleScenarioChange}
          />
          
          <div className="mt-6">
            <label htmlFor="custom-scenario" className="block text-sm font-medium text-gray-700 mb-2">
              或输入自定义场景
            </label>
            <input
              id="custom-scenario"
              type="text"
              value={customScenario}
              onChange={handleCustomScenarioChange}
              placeholder="例如：海浪声、咖啡馆、图书馆..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={handleGenerateNoise}
              disabled={isGenerating}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  生成声音
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {generatedAudio && (
          <AudioPlayer
            audio={generatedAudio}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
