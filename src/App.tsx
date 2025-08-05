import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, BookOpen, Zap, Brain, Target } from 'lucide-react';
import ForwardDiffusion from './components/ForwardDiffusion';
import ReverseDiffusion from './components/ReverseDiffusion';
import UNetArchitecture from './components/UNetArchitecture';
import TrainingProcess from './components/TrainingProcess';
import NoiseSchedule from './components/NoiseSchedule';
import EducationalContent from './components/EducationalContent';

function App() {
  const [activeTab, setActiveTab] = useState('forward');
  const [isPlaying, setIsPlaying] = useState(false);
  const [diffusionSteps, setDiffusionSteps] = useState(50);
  const [noiseSchedule, setNoiseSchedule] = useState('linear');
  const [learningRate, setLearningRate] = useState(0.001);

  const tabs = [
    { id: 'forward', label: 'Forward Process', icon: Target, description: 'Adding noise to images' },
    { id: 'reverse', label: 'Reverse Process', icon: RotateCcw, description: 'Denoising images' },
    { id: 'unet', label: 'U-Net Architecture', icon: Brain, description: 'Neural network structure' },
    { id: 'training', label: 'Training Process', icon: Zap, description: 'Learning to denoise' },
    { id: 'schedule', label: 'Noise Schedule', icon: Settings, description: 'Controlling noise levels' },
    { id: 'education', label: 'Learn More', icon: BookOpen, description: 'Theory and concepts' },
  ];

  const globalControls = {
    isPlaying,
    setIsPlaying,
    diffusionSteps,
    setDiffusionSteps,
    noiseSchedule,
    setNoiseSchedule,
    learningRate,
    setLearningRate,
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Diffusion Model Simulation
              </h1>
              <p className="text-gray-400">
                Interactive exploration of how AI generates images through diffusion processes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-white text-white bg-gray-800'
                      : 'border-transparent text-gray-500 hover:text-white hover:bg-gray-900'
                  }`}
                >
                  <IconComponent size={20} />
                  <div className="text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'forward' && <ForwardDiffusion {...globalControls} />}
        {activeTab === 'reverse' && <ReverseDiffusion {...globalControls} />}
        {activeTab === 'unet' && <UNetArchitecture {...globalControls} />}
        {activeTab === 'training' && <TrainingProcess {...globalControls} />}
        {activeTab === 'schedule' && <NoiseSchedule {...globalControls} />}
        {activeTab === 'education' && <EducationalContent />}
      </div>
    </div>
  );
}

export default App;