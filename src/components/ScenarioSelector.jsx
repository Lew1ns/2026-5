import React from 'react';
import { Moon, Building, Train, CloudRain, TreePine, Coffee } from 'lucide-react';

const ScenarioSelector = ({ selectedScenario, onScenarioChange }) => {
  const scenarios = [
    {
      id: 'sleep',
      name: '睡眠',
      icon: Moon,
      color: 'bg-blue-500',
      bgColor: 'bg-indigo-900',
      dynamicIcons: ['moon', 'star']
    },
    {
      id: 'office',
      name: '办公',
      icon: Building,
      color: 'bg-green-500',
      bgColor: 'bg-gray-700',
      dynamicIcons: ['building', 'computer']
    },
    {
      id: 'subway',
      name: '地铁',
      icon: Train,
      color: 'bg-orange-500',
      bgColor: 'bg-slate-800',
      dynamicIcons: ['train', 'rail']
    },
    {
      id: 'rain',
      name: '雨声',
      icon: CloudRain,
      color: 'bg-cyan-500',
      bgColor: 'bg-blue-800',
      dynamicIcons: ['cloud', 'raindrop']
    },
    {
      id: 'forest',
      name: '森林',
      icon: TreePine,
      color: 'bg-green-600',
      bgColor: 'bg-green-900',
      dynamicIcons: ['tree', 'leaf']
    },
    {
      id: 'cafe',
      name: '咖啡馆',
      icon: Coffee,
      color: 'bg-amber-600',
      bgColor: 'bg-amber-900',
      dynamicIcons: ['coffee', 'cup']
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">选择声音场景</h2>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {scenarios.slice(0, 3).map((scenario) => {
          const Icon = scenario.icon;
          const isSelected = selectedScenario === scenario.id;
          
          return (
            <div
              key={scenario.id}
              onClick={() => onScenarioChange(scenario.id)}
              className={`
                relative p-3 rounded-lg border-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="text-center">
                <div className={`
                  inline-flex items-center justify-center w-10 h-10 rounded-full text-white mb-2
                  ${isSelected ? scenario.color : 'bg-gray-400'}
                `}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-gray-800 text-sm">{scenario.name}</h3>
              </div>
              
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {scenarios.slice(3).map((scenario) => {
          const Icon = scenario.icon;
          const isSelected = selectedScenario === scenario.id;
          
          return (
            <div
              key={scenario.id}
              onClick={() => onScenarioChange(scenario.id)}
              className={`
                relative p-3 rounded-lg border-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="text-center">
                <div className={`
                  inline-flex items-center justify-center w-10 h-10 rounded-full text-white mb-2
                  ${isSelected ? scenario.color : 'bg-gray-400'}
                `}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-gray-800 text-sm">{scenario.name}</h3>
              </div>
              
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScenarioSelector;
