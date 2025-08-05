# Pixel Bloom

An interactive educational tool for understanding diffusion models - the AI technology behind DALL-E 2, Midjourney, and Stable Diffusion. Learn how these models generate stunning images from pure noise through step-by-step visual demonstrations.

## What This Tool Teaches

### Forward Diffusion Process
- **Visual noise addition**: Watch a clean image gradually transform into pure noise over customizable steps (default: 50)
- **Mathematical foundations**: See the formula `x_t = √(α_t) * x_0 + √(1 - α_t) * ε` in action
- **Real-time canvas simulation**: Generated concentric circle patterns with color gradients demonstrate the process

### Reverse Diffusion (Denoising)
- **Neural network denoising**: Visualize how a trained model learns to remove noise step by step
- **Interactive controls**: Adjust learning rates, diffusion steps, and watch the reverse process unfold
- **Pattern recognition**: See how the model reconstructs structured images from random noise

### U-Net Architecture Visualization
- **Layer-by-layer breakdown**: Interactive diagram showing the complete U-Net structure
- **Feature map dimensions**: Understand how data flows through encoder (256→128→64→32→16) and decoder paths
- **Channel progression**: See how features evolve from 3→64→128→256→512→1024 channels and back
- **Skip connections**: Visualize how encoder features are combined with decoder features

### Noise Schedule Comparison
- **Four schedule types**: Linear, Cosine, Exponential, and Sigmoid noise schedules
- **Interactive graphs**: Real-time plotting of β (beta) and α (alpha) values across diffusion steps
- **Customizable parameters**: Adjust beta start (0.0001) and end (0.02) values
- **Mathematical visualization**: See how different schedules affect the noise addition process

### Training Process Simulation
- **Loss visualization**: Watch how the model learns to predict noise through training iterations
- **Gradient descent**: Understand the optimization process with adjustable learning rates
- **Performance metrics**: Track model improvement over simulated training steps

### Educational Content
- **Theoretical foundations**: Comprehensive explanations of diffusion model concepts
- **Mathematical derivations**: Key equations and their intuitive meanings
- **Implementation guidance**: Code examples for forward/reverse processes
- **Research papers**: Curated links to foundational papers (DDPM, Classifier-Free Guidance, etc.)
- **PyTorch code samples**: Actual implementation snippets for each process

## Interactive Features

- **Play/Pause controls**: Step through processes at your own pace
- **Adjustable parameters**: 
  - Diffusion steps (1-100)
  - Noise schedules (Linear/Cosine/Exponential/Sigmoid)
  - Learning rates for training simulation
- **Real-time rendering**: Canvas-based visualizations that update as you change parameters
- **Responsive design**: Works on desktop and mobile devices

## Technical Implementation

- **React + TypeScript**: Modern, type-safe component architecture
- **Canvas API**: Real-time image processing and noise simulation
- **Mathematical accuracy**: Proper implementation of diffusion model equations
- **Tailwind CSS**: Dark theme optimized for extended learning sessions

## Getting Started

```bash
git clone https://github.com/HaidanP/Pixel-Bloom.git
cd Pixel-Bloom
npm install
npm run dev
```

Open `http://localhost:5173` and start exploring!

## Learning Path

1. **Start with Forward Diffusion**: Understand how noise destroys image structure
2. **Explore Noise Schedules**: See how different schedules affect the process
3. **Study U-Net Architecture**: Learn the neural network that powers denoising
4. **Watch Reverse Diffusion**: See how the model reconstructs images
5. **Understand Training**: Learn how these models are actually trained
6. **Read Theory**: Dive deep into the mathematical foundations

Perfect for students, researchers, and anyone curious about the technology behind modern AI image generation.