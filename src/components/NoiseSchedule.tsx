import React, { useState, useRef, useEffect } from 'react';
import { Settings, TrendingUp, Activity } from 'lucide-react';

interface NoiseScheduleProps {
  noiseSchedule: string;
  setNoiseSchedule: (schedule: string) => void;
  diffusionSteps: number;
}

const NoiseSchedule: React.FC<NoiseScheduleProps> = ({ 
  noiseSchedule, 
  setNoiseSchedule, 
  diffusionSteps 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [customBeta, setCustomBeta] = useState({ start: 0.0001, end: 0.02 });
  const [selectedStep, setSelectedStep] = useState(25);

  const schedules = [
    { id: 'linear', name: 'Linear', description: 'Constant rate of noise addition' },
    { id: 'cosine', name: 'Cosine', description: 'Slower start, faster middle, slower end' },
    { id: 'exponential', name: 'Exponential', description: 'Exponentially increasing noise' },
    { id: 'sigmoid', name: 'Sigmoid', description: 'S-curve shaped noise schedule' },
  ];

  const getBetaValue = (step: number, totalSteps: number, schedule: string) => {
    const t = step / totalSteps;
    
    switch (schedule) {
      case 'linear':
        return customBeta.start + (customBeta.end - customBeta.start) * t;
      case 'cosine':
        return customBeta.start + (customBeta.end - customBeta.start) * (1 - Math.cos(Math.PI * t)) / 2;
      case 'exponential':
        return customBeta.start + (customBeta.end - customBeta.start) * t * t;
      case 'sigmoid':
        const sigmoid = 1 / (1 + Math.exp(-10 * (t - 0.5)));
        return customBeta.start + (customBeta.end - customBeta.start) * sigmoid;
      default:
        return customBeta.start + (customBeta.end - customBeta.start) * t;
    }
  };

  const getAlphaValue = (step: number, totalSteps: number, schedule: string) => {
    let alphaBar = 1;
    for (let i = 0; i <= step; i++) {
      const beta = getBetaValue(i, totalSteps, schedule);
      alphaBar *= (1 - beta);
    }
    return alphaBar;
  };

  const drawSchedule = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      const y = (i / 10) * height;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw beta schedule
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let step = 0; step < diffusionSteps; step++) {
      const x = (step / diffusionSteps) * width;
      const beta = getBetaValue(step, diffusionSteps, noiseSchedule);
      const y = height - (beta / customBeta.end) * height;
      
      if (step === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw alpha_bar schedule
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let step = 0; step < diffusionSteps; step++) {
      const x = (step / diffusionSteps) * width;
      const alpha = getAlphaValue(step, diffusionSteps, noiseSchedule);
      const y = height - alpha * height;
      
      if (step === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw selected step indicator
    const selectedX = (selectedStep / diffusionSteps) * width;
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(selectedX, 0);
    ctx.lineTo(selectedX, height);
    ctx.stroke();
    
    // Draw legend
    ctx.fillStyle = '#8B5CF6';
    ctx.fillRect(10, 10, 20, 3);
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    ctx.fillText('β(t) - Noise Rate', 35, 18);
    
    ctx.fillStyle = '#10B981';
    ctx.fillRect(10, 30, 20, 3);
    ctx.fillStyle = 'white';
    ctx.fillText('ᾱ(t) - Signal Retention', 35, 38);
  };

  useEffect(() => {
    drawSchedule();
  }, [noiseSchedule, diffusionSteps, customBeta, selectedStep]);

  const currentBeta = getBetaValue(selectedStep, diffusionSteps, noiseSchedule);
  const currentAlpha = getAlphaValue(selectedStep, diffusionSteps, noiseSchedule);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Schedule Visualization */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Activity className="text-blue-400" />
          <span>Noise Schedules</span>
        </h2>
        
        <div className="mb-6">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full border border-white/20 rounded-lg bg-black/20"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Selected Step: {selectedStep}
            </label>
            <input
              type="range"
              min="0"
              max={diffusionSteps - 1}
              value={selectedStep}
              onChange={(e) => setSelectedStep(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-500/20 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-purple-300">{currentBeta.toFixed(6)}</div>
              <div className="text-sm text-purple-200">β(t) - Noise Rate</div>
            </div>
            <div className="bg-green-500/20 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-green-300">{currentAlpha.toFixed(6)}</div>
              <div className="text-sm text-green-200">ᾱ(t) - Signal Retention</div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Controls */}
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Settings className="text-purple-400" />
            <span>Schedule Type</span>
          </h3>
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <label
                key={schedule.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                  noiseSchedule === schedule.id
                    ? 'bg-purple-500/30 border border-purple-400'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="schedule"
                  value={schedule.id}
                  checked={noiseSchedule === schedule.id}
                  onChange={(e) => setNoiseSchedule(e.target.value)}
                  className="text-purple-500"
                />
                <div>
                  <div className="font-medium text-white">{schedule.name}</div>
                  <div className="text-sm text-slate-300">{schedule.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Beta Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                β_start: {customBeta.start.toFixed(6)}
              </label>
              <input
                type="range"
                min="0.00001"
                max="0.001"
                step="0.00001"
                value={customBeta.start}
                onChange={(e) => setCustomBeta(prev => ({ ...prev, start: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                β_end: {customBeta.end.toFixed(6)}
              </label>
              <input
                type="range"
                min="0.001"
                max="0.1"
                step="0.001"
                value={customBeta.end}
                onChange={(e) => setCustomBeta(prev => ({ ...prev, end: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="text-green-400" />
            <span>Mathematical Relationships</span>
          </h3>
          <div className="space-y-4">
            <div className="bg-blue-500/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-200 mb-2">Forward Process</h4>
              <code className="text-blue-100 text-sm block">
                q(x_t | x_(t-1)) = N(√(1-β_t) x_(t-1), β_t I)
              </code>
            </div>
            
            <div className="bg-green-500/20 p-4 rounded-lg">
              <h4 className="font-medium text-green-200 mb-2">Cumulative Alpha</h4>
              <code className="text-green-100 text-sm block">
                ᾱ_t = ∏(i=1 to t) (1 - β_i)
              </code>
            </div>
            
            <div className="bg-purple-500/20 p-4 rounded-lg">
              <h4 className="font-medium text-purple-200 mb-2">Direct Sampling</h4>
              <code className="text-purple-100 text-sm block">
                x_t = √ᾱ_t x_0 + √(1-ᾱ_t) ε
              </code>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Schedule Impact</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Training Stability</h4>
                <p className="text-sm text-slate-300">
                  Better schedules lead to more stable training and faster convergence.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Generation Quality</h4>
                <p className="text-sm text-slate-300">
                  Optimal schedules preserve more information in early steps, improving final quality.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Sampling Speed</h4>
                <p className="text-sm text-slate-300">
                  Some schedules allow for fewer sampling steps while maintaining quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoiseSchedule;