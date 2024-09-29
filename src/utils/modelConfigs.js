export const modelConfigs = {
  flux: {
    name: "FLUX",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    inferenceSteps: [4, 8, 16, 20, 24],
    defaultStep: 8
  },
  canopusAnime: {
    name: "Canopus Anime",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Canopus-LoRA-Flux-Anime",
    inferenceSteps: [22, 28, 34, 40, 46],
    defaultStep: 28
  },
  dreamscape: {
    name: "Dreamscape",
    apiUrl: "https://api-inference.huggingface.co/models/bingbangboom/flux_dreamscape",
    inferenceSteps: [22, 28, 34, 40, 46],
    defaultStep: 28
  },
  boreal: {
    name: "Boreal",
    apiUrl: "https://api-inference.huggingface.co/models/kudzueye/boreal-flux-dev-v2",
    inferenceSteps: [26, 30, 36, 44, 50],
    defaultStep: 30
  },
  fluxAnime: {
    name: "FLUX Anime",
    apiUrl: "https://api-inference.huggingface.co/models/dataautogpt3/FLUX-anime2",
    inferenceSteps: [25, 30, 35, 40, 45],
    defaultStep: 30
  },
  malaAnimeMix: {
    name: "Mala Anime Mix",
    apiUrl: "https://api-inference.huggingface.co/models/John6666/mala-anime-mix-nsfw-pony-xl-v5new-sdxl-spo",
    inferenceSteps: [28, 32, 36, 40, 44],
    defaultStep: 32
  }
};