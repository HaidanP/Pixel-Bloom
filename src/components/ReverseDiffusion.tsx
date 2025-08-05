import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

interface ReverseDiffusionProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  diffusionSteps: number;
  noiseSchedule: string;
}

const ReverseDiffusion: React.FC<ReverseDiffusionProps> = ({
  isPlaying,
  setIsPlaying,
  diffusionSteps,
  noiseSchedule,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(diffusionSteps - 1);
  const [predictionAccuracy, setPredictionAccuracy] = useState(0);
  const animationRef = useRef<number>();

  const generateNoisyImage = (ctx: CanvasRenderingContext2D, width: number, height: number): ImageData => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Start with pure noise
      data[i] = Math.random() * 255;     // Red
      data[i + 1] = Math.random() * 255; // Green
      data[i + 2] = Math.random() * 255; // Blue
      data[i + 3] = 255;                 // Alpha
    }

    return imageData;
  };

  const denoiseStep = (noisyData: ImageData, step: number, totalSteps: number): ImageData => {
    const denoisedData = new ImageData(
      new Uint8ClampedArray(noisyData.data),
      noisyData.width,
      noisyData.height
    );
    
    const data = denoisedData.data;
    const width = noisyData.width;
    const height = noisyData.height;
    
    // Progress from noise to structure
    const progress = 1 - (step / totalSteps);
    const structureStrength = Math.pow(progress, 0.5);
    
    // Simulate U-Net prediction by gradually revealing structure
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // Create target pattern (what the model is trying to predict)
        const centerX = width / 2;
        const centerY = height / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const normalizedDistance = distance / (Math.min(width, height) / 2);
        
        const ringPattern = Math.sin(normalizedDistance * Math.PI * 3) * 0.5 + 0.5;
        const colorPhase = (x + y) / (width + height);
        
        const targetR = 255 * (1 - normalizedDistance) * ringPattern;
        const targetG = 255 * colorPhase * ringPattern;
        const targetB = 255 * normalizedDistance * ringPattern;
        
        // Blend current noisy pixel with predicted structure
        data[index] = data[index] * (1 - structureStrength) + targetR * structureStrength;
        data[index + 1] = data[index + 1] * (1 - structureStrength) + targetG * structureStrength;
        data[index + 2] = data[index + 2] * (1 - structureStrength) + targetB * structureStrength;
        
        // Add some controlled noise to simulate imperfect predictions
        if (step > totalSteps * 0.2) {
          const noiseLevel = (step / totalSteps) * 20;
          data[index] += (Math.random() - 0.5) * noiseLevel;
          data[index + 1] += (Math.random() - 0.5) * noiseLevel;
          data[index + 2] += (Math.random() - 0.5) * noiseLevel;
        }
      }
    }
    
    // Update prediction accuracy
    setPredictionAccuracy(Math.min(100, progress * 100));
    
    return denoisedData;
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
    
    // Start with noisy image if at the beginning
    let currentImage: ImageData;
    if (currentStep === diffusionSteps - 1) {
      currentImage = generateNoisyImage(ctx, width, height);
    } else {
      // Get the previous state and denoise it
      currentImage = generateNoisyImage(ctx, width, height);
      currentImage = denoiseStep(currentImage, currentStep, diffusionSteps);
    }
    
    ctx.putImageData(currentImage, 0, 0);
  };

  const animate = () => {
    if (isPlaying) {
      setCurrentStep((prev) => {
        const next = prev - 1;
        if (next < 0) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
      
      animationRef.current = setTimeout(() => {
        requestAnimationFrame(animate);
      }, 150);
    }
  };

  useEffect(() => {
    drawCurrentState();
  }, [currentStep, diffusionSteps]);

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
    setCurrentStep(diffusionSteps - 1);
    setIsPlaying(false);
    setPredictionAccuracy(0);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Visualization */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Reverse Diffusion Process</h2>
        
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
              <span>Step {diffusionSteps - currentStep} of {diffusionSteps}</span>
              <span>Structure Clarity: {predictionAccuracy.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((diffusionSteps - currentStep) / diffusionSteps) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-300">{currentStep}</div>
              <div className="text-xs text-purple-200">Noise Steps Left</div>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-300">{predictionAccuracy.toFixed(0)}%</div>
              <div className="text-xs text-green-200">Prediction Accuracy</div>
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
              <span>{isPlaying ? 'Pause' : 'Denoise'}</span>
            </button>
            
            <button
              onClick={reset}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-all"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Reverse Process</h3>
          <div className="space-y-3 text-slate-300">
            <p>
              The reverse diffusion process uses a trained neural network (U-Net) to predict and remove noise 
              at each step, gradually revealing the underlying image structure.
            </p>
            <div className="bg-green-500/20 p-4 rounded-lg">
              <p className="font-medium text-green-200">Mathematical Formula:</p>
              <code className="text-green-100 text-sm">
                x_(t-1) = μ(x_t, t) + σ(t) * z
              </code>
              <p className="text-sm mt-2">
                Where μ is the predicted mean (what U-Net outputs), σ is noise variance, and z is random noise.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">U-Net Prediction</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Current Step:</span>
              <span className="text-white font-mono">{currentStep}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Noise Level:</span>
              <span className="text-white font-mono">{((currentStep / diffusionSteps) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Structure Revealed:</span>
              <span className="text-white font-mono">{(100 - predictionAccuracy).toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-200 mb-2">
              <Zap size={16} />
              <span className="font-medium">Neural Network Activity</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    predictionAccuracy > i * 11
                      ? 'bg-blue-400'
                      : 'bg-blue-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Conditional Generation</h4>
                <p className="text-sm text-slate-300">
                  The U-Net conditions its predictions on the current noise level and time step.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Progressive Refinement</h4>
                <p className="text-sm text-slate-300">
                  Each step refines the image by removing noise while preserving important features.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Stochastic Process</h4>
                <p className="text-sm text-slate-300">
                  Small amounts of controlled randomness ensure diverse outputs even from the same starting noise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseDiffusion;