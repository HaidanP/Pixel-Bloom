import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Zap, BarChart } from 'lucide-react';

interface TrainingProcessProps {
  isPlaying: boolean;
  learningRate: number;
  setLearningRate: (rate: number) => void;
}

const TrainingProcess: React.FC<TrainingProcessProps> = ({ 
  isPlaying, 
  learningRate, 
  setLearningRate 
}) => {
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(2.5);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [validationLoss, setValidationLoss] = useState(2.8);
  const [currentBatch, setCurrentBatch] = useState(0);
  const batchesPerEpoch = 1000;

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentBatch((prev) => {
          const next = prev + 1;
          if (next >= batchesPerEpoch) {
            setEpoch(e => e + 1);
            return 0;
          }
          return next;
        });

        // Simulate loss reduction with some noise
        setLoss((prev) => {
          const targetLoss = 0.1 + 0.3 * Math.exp(-epoch * 0.01);
          const noise = (Math.random() - 0.5) * 0.1;
          const newLoss = Math.max(0.05, targetLoss + noise);
          return newLoss;
        });

        setValidationLoss((prev) => {
          const targetLoss = 0.12 + 0.35 * Math.exp(-epoch * 0.008);
          const noise = (Math.random() - 0.5) * 0.05;
          return Math.max(0.06, targetLoss + noise);
        });

        // Update loss history every 100 batches
        if (currentBatch % 50 === 0) {
          setLossHistory((prev) => [...prev.slice(-49), loss]);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isPlaying, epoch, currentBatch, loss]);

  const LossChart: React.FC = () => (
    <div className="bg-black/20 p-4 rounded-lg">
      <h4 className="text-white font-medium mb-3">Training Loss</h4>
      <div className="h-32 flex items-end justify-center space-x-1 bg-slate-800/50 rounded p-2">
        {lossHistory.length > 0 ? lossHistory.map((lossValue, index) => (
          <div
            key={index}
            className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t min-w-[3px]"
            style={{
              height: `${Math.max(10, (1 - lossValue / 3) * 120)}px`,
              width: '4px',
            }}
          />
        )) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Start training to see loss history
          </div>
        )}
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-2">
        <span>0</span>
        <span>Training Steps</span>
        <span>{Math.max(lossHistory.length * 100, 1000)}</span>
      </div>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Training Visualization */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <TrendingUp className="text-green-400" />
          <span>Training Process</span>
        </h2>

        {/* Training Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-500/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-300">{epoch}</div>
            <div className="text-sm text-purple-200">Epoch</div>
          </div>
          <div className="bg-blue-500/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-300">{currentBatch}</div>
            <div className="text-sm text-blue-200">Batch / {batchesPerEpoch}</div>
          </div>
          <div className="bg-green-500/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-300">{loss.toFixed(4)}</div>
            <div className="text-sm text-green-200">Training Loss</div>
          </div>
          <div className="bg-yellow-500/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-300">{validationLoss.toFixed(4)}</div>
            <div className="text-sm text-yellow-200">Validation Loss</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Epoch Progress</span>
              <span>{((currentBatch / batchesPerEpoch) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${(currentBatch / batchesPerEpoch) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <LossChart />

        {/* Training Algorithm */}
        <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
          <h4 className="text-blue-200 font-medium mb-3 flex items-center space-x-2">
            <Target size={16} />
            <span>Training Objective</span>
          </h4>
          <div className="space-y-2 text-sm">
            <div className="font-mono text-blue-100 bg-blue-500/20 p-2 rounded">
              Loss = MSE(predicted_noise, actual_noise)
            </div>
            <p className="text-blue-200">
              At each step, the model learns to predict the noise that was added to the original image.
            </p>
          </div>
        </div>
      </div>

      {/* Training Details */}
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Training Hyperparameters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Learning Rate: {learningRate.toFixed(6)}
              </label>
              <input
                type="range"
                min="0.0001"
                max="0.01"
                step="0.0001"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-slate-300">Batch Size</div>
                <div className="text-white font-bold">64</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-slate-300">Optimizer</div>
                <div className="text-white font-bold">AdamW</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-slate-300">Weight Decay</div>
                <div className="text-white font-bold">0.01</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-slate-300">Gradient Clipping</div>
                <div className="text-white font-bold">1.0</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Zap className="text-yellow-400" />
            <span>Training Steps</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
              <div>
                <h4 className="font-medium text-white">Sample Training Data</h4>
                <p className="text-sm text-slate-300">
                  Load a batch of clean images from the training dataset.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
              <div>
                <h4 className="font-medium text-white">Add Noise</h4>
                <p className="text-sm text-slate-300">
                  Randomly sample time steps and add corresponding noise levels.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
              <div>
                <h4 className="font-medium text-white">Forward Pass</h4>
                <p className="text-sm text-slate-300">
                  U-Net predicts the noise that was added to the image.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">4</div>
              <div>
                <h4 className="font-medium text-white">Calculate Loss</h4>
                <p className="text-sm text-slate-300">
                  Compare predicted noise with actual noise using MSE loss.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">5</div>
              <div>
                <h4 className="font-medium text-white">Backpropagation</h4>
                <p className="text-sm text-slate-300">
                  Update network weights using gradients from the loss.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <BarChart className="text-green-400" />
            <span>Performance Metrics</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">FID Score:</span>
              <span className="text-green-300 font-bold">{(50 - epoch * 0.1).toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Inception Score:</span>
              <span className="text-blue-300 font-bold">{(3.0 + epoch * 0.01).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">LPIPS Distance:</span>
              <span className="text-purple-300 font-bold">{(0.8 - epoch * 0.001).toFixed(3)}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
            <p className="text-sm text-green-200">
              Lower FID and LPIPS scores indicate better image quality and diversity.
              Higher Inception Score suggests more realistic and varied generated images.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingProcess;