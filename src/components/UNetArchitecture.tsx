import React, { useState, useEffect } from 'react';
import { Brain, ArrowDown, ArrowUp, Layers, Zap } from 'lucide-react';

interface UNetArchitectureProps {
  isPlaying: boolean;
}

const UNetArchitecture: React.FC<UNetArchitectureProps> = ({ isPlaying }) => {
  const [activeLayer, setActiveLayer] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);

  const layers = [
    { name: 'Input', channels: 3, size: 256, description: 'Noisy image + time embedding' },
    { name: 'Conv Block 1', channels: 64, size: 256, description: 'Feature extraction' },
    { name: 'Down 1', channels: 128, size: 128, description: 'Spatial compression' },
    { name: 'Down 2', channels: 256, size: 64, description: 'Deeper features' },
    { name: 'Down 3', channels: 512, size: 32, description: 'Abstract representations' },
    { name: 'Bottleneck', channels: 1024, size: 16, description: 'Highest level features' },
    { name: 'Up 3', channels: 512, size: 32, description: 'Spatial expansion' },
    { name: 'Up 2', channels: 256, size: 64, description: 'Feature refinement' },
    { name: 'Up 1', channels: 128, size: 128, description: 'Detail restoration' },
    { name: 'Output', channels: 3, size: 256, description: 'Predicted noise' },
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveLayer((prev) => (prev + 1) % layers.length);
        setProcessingStep((prev) => (prev + 1) % 100);
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, layers.length]);

  const getLayerColor = (index: number) => {
    if (index <= 4) return 'from-purple-500 to-purple-700'; // Encoder
    if (index === 5) return 'from-red-500 to-red-700'; // Bottleneck
    return 'from-green-500 to-green-700'; // Decoder
  };

  const LayerBlock: React.FC<{ layer: typeof layers[0]; index: number; isActive: boolean }> = ({ 
    layer, 
    index, 
    isActive 
  }) => (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all duration-500 cursor-pointer ${
        isActive
          ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/30'
          : 'border-white/20 bg-white/5 hover:bg-white/10'
      }`}
      onClick={() => setActiveLayer(index)}
    >
      <div className={`w-full h-16 rounded-lg bg-gradient-to-r ${getLayerColor(index)} mb-3 flex items-center justify-center`}>
        <div className="text-white font-bold">
          {layer.size}×{layer.size}×{layer.channels}
        </div>
      </div>
      <h4 className="font-medium text-white text-sm mb-1">{layer.name}</h4>
      <p className="text-xs text-slate-400">{layer.description}</p>
      
      {isActive && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full p-1">
          <Zap size={12} />
        </div>
      )}
    </div>
  );

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Architecture Visualization */}
      <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Brain className="text-purple-400" />
          <span>U-Net Architecture</span>
        </h2>
        
        <div className="space-y-6">
          {/* Encoder Path */}
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center space-x-2">
              <ArrowDown size={20} />
              <span>Encoder (Downsampling)</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {layers.slice(0, 5).map((layer, index) => (
                <LayerBlock
                  key={index}
                  layer={layer}
                  index={index}
                  isActive={activeLayer === index}
                />
              ))}
            </div>
          </div>

          {/* Bottleneck */}
          <div>
            <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center space-x-2">
              <Layers size={20} />
              <span>Bottleneck</span>
            </h3>
            <div className="flex justify-center">
              <div className="w-48">
                <LayerBlock
                  layer={layers[5]}
                  index={5}
                  isActive={activeLayer === 5}
                />
              </div>
            </div>
          </div>

          {/* Decoder Path */}
          <div>
            <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center space-x-2">
              <ArrowUp size={20} />
              <span>Decoder (Upsampling)</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {layers.slice(6).map((layer, index) => (
                <LayerBlock
                  key={index + 6}
                  layer={layer}
                  index={index + 6}
                  isActive={activeLayer === index + 6}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Skip Connections Visualization */}
        <div className="mt-8 p-6 bg-blue-500/20 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Skip Connections</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { from: 'Conv Block 1', to: 'Up 1', description: 'Preserves fine details' },
              { from: 'Down 1', to: 'Up 2', description: 'Maintains spatial context' },
              { from: 'Down 2', to: 'Up 3', description: 'Combines multi-scale features' },
            ].map((connection, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-400/30 p-3 rounded-lg">
                  <div className="font-medium text-blue-200">{connection.from}</div>
                  <div className="text-blue-300 my-2">→</div>
                  <div className="font-medium text-blue-200">{connection.to}</div>
                </div>
                <p className="text-xs text-blue-300 mt-2">{connection.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Current Layer</h3>
          {layers[activeLayer] && (
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-purple-300">{layers[activeLayer].name}</h4>
                <p className="text-sm text-slate-300">{layers[activeLayer].description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <div className="text-xl font-bold text-purple-300">{layers[activeLayer].size}</div>
                  <div className="text-xs text-purple-200">Spatial Size</div>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <div className="text-xl font-bold text-blue-300">{layers[activeLayer].channels}</div>
                  <div className="text-xs text-blue-200">Channels</div>
                </div>
              </div>
              
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <div className="text-sm text-yellow-200">
                  Parameters: ~{Math.floor(layers[activeLayer].channels * layers[activeLayer].size * 0.1)}K
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Architecture Benefits</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Multi-Scale Processing</h4>
                <p className="text-sm text-slate-300">
                  Different layers capture features at various scales, from fine details to global structure.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Skip Connections</h4>
                <p className="text-sm text-slate-300">
                  Direct connections between encoder and decoder preserve important spatial information.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Time Conditioning</h4>
                <p className="text-sm text-slate-300">
                  Time step information is embedded at each layer to guide the denoising process.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Training Details</h3>
          <div className="space-y-3 text-slate-300">
            <div className="flex justify-between">
              <span>Loss Function:</span>
              <span className="text-white font-mono">MSE</span>
            </div>
            <div className="flex justify-between">
              <span>Optimizer:</span>
              <span className="text-white font-mono">AdamW</span>
            </div>
            <div className="flex justify-between">
              <span>Parameters:</span>
              <span className="text-white font-mono">~860M</span>
            </div>
            <div className="flex justify-between">
              <span>Training Steps:</span>
              <span className="text-white font-mono">500K+</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
            <p className="text-sm text-green-200">
              The network learns to predict the noise that was added at each time step, 
              allowing it to reverse the diffusion process during generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UNetArchitecture;