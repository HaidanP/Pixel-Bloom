import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface ForwardDiffusionProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  diffusionSteps: number;
  setDiffusionSteps: (steps: number) => void;
  noiseSchedule: string;
}

const ForwardDiffusion: React.FC<ForwardDiffusionProps> = ({
  isPlaying,
  setIsPlaying,
  diffusionSteps,
  setDiffusionSteps,
  noiseSchedule,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const animationRef = useRef<number>();

  // Generate a simple pattern to represent an image
  const generateOriginalImage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // Create a simple pattern (circles and gradients)
        const centerX = width / 2;
        const centerY = height / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const normalizedDistance = distance / (Math.min(width, height) / 2);
        
        // Create concentric circles with color gradients
        const ringPattern = Math.sin(normalizedDistance * Math.PI * 3) * 0.5 + 0.5;
        const colorPhase = (x + y) / (width + height);
        
        data[index] = Math.floor(255 * (1 - normalizedDistance) * ringPattern); // Red
        data[index + 1] = Math.floor(255 * colorPhase * ringPattern); // Green  
        data[index + 2] = Math.floor(255 * normalizedDistance * ringPattern); // Blue
        data[index + 3] = 255; // Alpha
      }
    }
    
    return imageData;
  };

  const addNoise = (originalData: ImageData, noiseLevel: number): ImageData => {
    const noisyData = new ImageData(
      new Uint8ClampedArray(originalData.data),
      originalData.width,
      originalData.height
    );
    
    const data = noisyData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Add Gaussian noise
      const noise = () => {
        const u1 = Math.random();
        const u2 = Math.random();
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      };
      
      const noiseIntensity = noiseLevel * 50;
      
      data[i] = Math.max(0, Math.min(255, data[i] + noise() * noiseIntensity)); // Red
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise() * noiseIntensity)); // Green
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise() * noiseIntensity)); // Blue
    }
    
    return noisyData;
  };

  const getNoiseLevel = (step: number, totalSteps: number, schedule: string): number => {
    const t = step / totalSteps;
    
    switch (schedule) {
      case 'linear':
        return t;
      case 'cosine':
        return 0.5 * (1 - Math.cos(Math.PI * t));
      case 'exponential':
        return t * t;
      default:
        return t;
    }
  };

  const drawCurrentState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = 200;
    const height = 200;
    canvas.width = width;
    canvas.height = height;
    
    // Generate original image
    const originalImage = generateOriginalImage(ctx, width, height);
    
    // Add noise based on current step
    const noiseLevel = getNoiseLevel(currentStep, diffusionSteps, noiseSchedule);
    const noisyImage = addNoise(originalImage, noiseLevel);
    
    // Draw the noisy image
    ctx.putImageData(noisyImage, 0, 0);
  };

  const animate = () => {
    if (isPlaying) {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= diffusionSteps) {
          setIsPlaying(false);
          return diffusionSteps - 1;
        }
        return next;
      });
      
      animationRef.current = setTimeout(() => {
        requestAnimationFrame(animate);
      }, 100);
    }
  };

  useEffect(() => {
    drawCurrentState();
  }, [currentStep, diffusionSteps, noiseSchedule]);

  useEffect(() => {
    if (isPlaying) {
      animate();
    } else {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying]);

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Visualization */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Forward Diffusion Process</h2>
        
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-black/20 rounded-lg">
            <canvas
              ref={canvasRef}
              className="border border-white/20 rounded-lg"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Step {currentStep} of {diffusionSteps}</span>
              <span>Noise Level: {(getNoiseLevel(currentStep, diffusionSteps, noiseSchedule) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / diffusionSteps) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            
            <button
              onClick={reset}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-all"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
            
            <button
              onClick={() => setShowControls(!showControls)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-all"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">What's Happening?</h3>
          <div className="space-y-3 text-slate-300">
            <p>
              The forward diffusion process gradually adds noise to a clean image over {diffusionSteps} steps.
              This process is deterministic and follows a predefined noise schedule.
            </p>
            <div className="bg-purple-500/20 p-4 rounded-lg">
              <p className="font-medium text-purple-200">Mathematical Formula:</p>
              <code className="text-purple-100 text-sm">
                x_t = √(α_t) * x_0 + √(1 - α_t) * ε
              </code>
              <p className="text-sm mt-2">
                Where x_t is the noisy image at step t, x_0 is the original image, 
                α_t controls noise level, and ε is random noise.
              </p>
            </div>
          </div>
        </div>

        {showControls && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Controls</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Diffusion Steps: {diffusionSteps}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={diffusionSteps}
                  onChange={(e) => setDiffusionSteps(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Manual Step Control
                </label>
                <input
                  type="range"
                  min="0"
                  max={diffusionSteps - 1}
                  value={currentStep}
                  onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  disabled={isPlaying}
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Key Concepts</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Noise Schedule</h4>
                <p className="text-sm text-slate-300">
                  Controls how much noise is added at each step. Different schedules affect the training and generation quality.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Markov Chain</h4>
                <p className="text-sm text-slate-300">
                  Each step only depends on the previous step, forming a chain of transformations.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Gaussian Noise</h4>
                <p className="text-sm text-slate-300">
                  Random noise following a normal distribution is added to gradually destroy the image structure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForwardDiffusion;