import React, { useState } from 'react';
import { BookOpen, ExternalLink, Code, FileText, Video, Download } from 'lucide-react';

const EducationalContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('basics');

  const sections = [
    { id: 'basics', label: 'Basics', icon: BookOpen },
    { id: 'math', label: 'Mathematics', icon: Code },
    { id: 'implementation', label: 'Implementation', icon: FileText },
    { id: 'resources', label: 'Resources', icon: Video },
  ];

  const resources = [
    {
      title: 'Denoising Diffusion Probabilistic Models',
      authors: 'Ho, Jain, Abbeel',
      url: 'https://arxiv.org/abs/2006.11239',
      type: 'Paper',
      description: 'The foundational DDPM paper that established the modern diffusion model framework.'
    },
    {
      title: 'Diffusion Models Beat GANs on Image Synthesis',
      authors: 'Dhariwal, Nichol',
      url: 'https://arxiv.org/abs/2105.05233',
      type: 'Paper',
      description: 'Demonstrated that diffusion models can achieve better image quality than GANs.'
    },
    {
      title: 'Classifier-Free Diffusion Guidance',
      authors: 'Ho, Salimans',
      url: 'https://arxiv.org/abs/2207.12598',
      type: 'Paper',
      description: 'Introduced classifier-free guidance for conditional generation without explicit classifiers.'
    },
    {
      title: 'The Annotated Diffusion Model',
      authors: 'Hugging Face',
      url: 'https://huggingface.co/blog/annotated-diffusion',
      type: 'Tutorial',
      description: 'Step-by-step implementation guide with code examples.'
    },
  ];

  const codeExamples = {
    forward: `# Forward diffusion process
def q_sample(x_start, t, noise=None):
    if noise is None:
        noise = torch.randn_like(x_start)
    
    sqrt_alphas_cumprod_t = extract(sqrt_alphas_cumprod, t, x_start.shape)
    sqrt_one_minus_alphas_cumprod_t = extract(
        sqrt_one_minus_alphas_cumprod, t, x_start.shape
    )
    
    return sqrt_alphas_cumprod_t * x_start + sqrt_one_minus_alphas_cumprod_t * noise`,
    
    reverse: `# Reverse diffusion sampling
@torch.no_grad()
def p_sample(model, x, t, t_index):
    betas_t = extract(betas, t, x.shape)
    sqrt_one_minus_alphas_cumprod_t = extract(
        sqrt_one_minus_alphas_cumprod, t, x.shape
    )
    sqrt_recip_alphas_t = extract(sqrt_recip_alphas, t, x.shape)
    
    # Model prediction
    model_mean = sqrt_recip_alphas_t * (
        x - betas_t * model(x, t) / sqrt_one_minus_alphas_cumprod_t
    )
    
    if t_index == 0:
        return model_mean
    else:
        posterior_variance_t = extract(posterior_variance, t, x.shape)
        noise = torch.randn_like(x)
        return model_mean + torch.sqrt(posterior_variance_t) * noise`,
    
    loss: `# Training loss function
def p_losses(denoise_model, x_start, t, noise=None):
    if noise is None:
        noise = torch.randn_like(x_start)
    
    x_noisy = q_sample(x_start=x_start, t=t, noise=noise)
    predicted_noise = denoise_model(x_noisy, t)
    
    loss = F.mse_loss(noise, predicted_noise)
    return loss`
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Navigation */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Contents</h3>
        <div className="space-y-2">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                  activeSection === section.id
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <IconComponent size={20} />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-3 space-y-8">
        {activeSection === 'basics' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">What are Diffusion Models?</h2>
              <div className="space-y-4 text-slate-300">
                <p className="text-lg">
                  Diffusion models are a class of generative AI models that learn to create data by 
                  reversing a gradual noise corruption process. They've become the foundation for 
                  state-of-the-art image generation systems like DALL-E 2, Midjourney, and Stable Diffusion.
                </p>
                
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Key Concepts</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-500/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-200 mb-2">Forward Process</h4>
                    <p className="text-sm">
                      Gradually adds Gaussian noise to data over T timesteps until it becomes pure noise.
                    </p>
                  </div>
                  <div className="bg-green-500/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-200 mb-2">Reverse Process</h4>
                    <p className="text-sm">
                      Learns to reverse the noise addition, generating data from noise.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-200 mb-2">U-Net Architecture</h4>
                    <p className="text-sm">
                      The neural network that learns to predict and remove noise at each step.
                    </p>
                  </div>
                  <div className="bg-yellow-500/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-200 mb-2">Noise Schedule</h4>
                    <p className="text-sm">
                      Controls how much noise is added at each timestep during training.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">How They Work</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Training Phase</h4>
                    <p className="text-slate-300">
                      During training, the model learns to predict the noise that was added to images. 
                      It sees images at various noise levels and learns to identify what noise to remove.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Generation Phase</h4>
                    <p className="text-slate-300">
                      To generate new images, we start with pure noise and iteratively apply the trained 
                      model to remove noise, gradually revealing a coherent image.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Conditioning</h4>
                    <p className="text-slate-300">
                      Modern diffusion models can be conditioned on text prompts, allowing for 
                      controllable generation of images that match textual descriptions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'math' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">Mathematical Foundation</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Forward Diffusion Process</h3>
                  <div className="bg-purple-500/20 p-4 rounded-lg">
                    <p className="text-purple-200 mb-2">The forward process gradually corrupts data:</p>
                    <code className="text-purple-100 block text-sm font-mono">
                      q(x₁:ₜ | x₀) = ∏ᵢ₌₁ᵀ q(xᵢ | xᵢ₋₁)
                    </code>
                    <code className="text-purple-100 block text-sm font-mono mt-2">
                      q(xᵢ | xᵢ₋₁) = N(xᵢ; √(1-βᵢ)xᵢ₋₁, βᵢI)
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Reverse Process</h3>
                  <div className="bg-green-500/20 p-4 rounded-lg">
                    <p className="text-green-200 mb-2">The reverse process learns to denoise:</p>
                    <code className="text-green-100 block text-sm font-mono">
                      pθ(x₀:ₜ₋₁ | xᵢ) = ∏ᵢ₌₁ᵀ pθ(xᵢ₋₁ | xᵢ)
                    </code>
                    <code className="text-green-100 block text-sm font-mono mt-2">
                      pθ(xᵢ₋₁ | xᵢ) = N(xᵢ₋₁; μθ(xᵢ,t), Σθ(xᵢ,t))
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Training Objective</h3>
                  <div className="bg-blue-500/20 p-4 rounded-lg">
                    <p className="text-blue-200 mb-2">Simplified loss function (DDPM):</p>
                    <code className="text-blue-100 block text-sm font-mono">
                      L = Eₜ,x₀,ε [||ε - εθ(√ᾱₜx₀ + √(1-ᾱₜ)ε, t)||²]
                    </code>
                    <p className="text-blue-200 text-sm mt-2">
                      Where ε is sampled noise, εθ is the predicted noise, and ᾱₜ = ∏ᵢ₌₁ᵗ(1-βᵢ)
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Key Properties</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-yellow-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-200 mb-2">Markov Chain</h4>
                      <p className="text-yellow-100 text-sm">
                        Each step only depends on the previous step, forming a chain of transitions.
                      </p>
                    </div>
                    <div className="bg-red-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-200 mb-2">Variational Bound</h4>
                      <p className="text-red-100 text-sm">
                        The training objective provides a variational lower bound on the data likelihood.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'implementation' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">Implementation Details</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Forward Process Implementation</h3>
                  <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      <code>{codeExamples.forward}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Sampling Implementation</h3>
                  <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-blue-400 text-sm">
                      <code>{codeExamples.reverse}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Training Loss</h3>
                  <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-purple-400 text-sm">
                      <code>{codeExamples.loss}</code>
                    </pre>
                  </div>
                </div>

                <div className="bg-yellow-500/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-200 mb-2">Implementation Tips</h4>
                  <ul className="text-yellow-100 text-sm space-y-1">
                    <li>• Use exponential moving average (EMA) for model weights</li>
                    <li>• Implement gradient clipping to stabilize training</li>
                    <li>• Consider using mixed precision training for efficiency</li>
                    <li>• Cache noise schedules for faster sampling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'resources' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">Learning Resources</h2>
              
              <div className="space-y-4">
                {resources.map((resource, index) => (
                  <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-white">{resource.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            resource.type === 'Paper' 
                              ? 'bg-blue-500/20 text-blue-300' 
                              : 'bg-green-500/20 text-green-300'
                          }`}>
                            {resource.type}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">by {resource.authors}</p>
                        <p className="text-slate-300 text-sm">{resource.description}</p>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 p-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-400/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Download className="text-purple-400" />
                  <span>Quick Start</span>
                </h3>
                <p className="text-slate-300 mb-4">
                  Ready to start implementing diffusion models? Here are some recommended starting points:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-purple-200">Try the Hugging Face Diffusers library for pre-trained models</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-blue-200">Implement a simple DDPM from scratch using PyTorch</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-green-200">Experiment with different noise schedules and architectures</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationalContent;