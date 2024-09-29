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
  },
  simpleVector: {
    name: "Simple Vector",
    apiUrl: "https://api-inference.huggingface.co/models/renderartist/simplevectorflux",
    inferenceSteps: [25, 30, 35, 40, 45],
    defaultStep: 35,
    promptSuffix: ", vector, v3ct0r"
  },
  realismLora: {
    name: "Realism LoRA",
    apiUrl: "https://api-inference.huggingface.co/models/XLabs-AI/flux-RealismLora",
    inferenceSteps: [30, 35, 40, 45, 50],
    defaultStep: 40
  },
  ninetyAnimeArt: {
    name: "90s Anime Art",
    apiUrl: "https://api-inference.huggingface.co/models/glif/90s-anime-art",
    inferenceSteps: [25, 30, 35, 40, 45],
    defaultStep: 35
  },
  latentPop: {
    name: "Latent Pop",
    apiUrl: "https://api-inference.huggingface.co/models/jakedahn/flux-latentpop",
    inferenceSteps: [28, 33, 38, 43, 48],
    defaultStep: 38,
    promptSuffix: ", LNTP"
  },
  whiteBackground: {
    name: "White Background",
    apiUrl: "https://api-inference.huggingface.co/models/gokaygokay/Flux-White-Background-LoRA",
    inferenceSteps: [27, 32, 37, 42, 47],
    defaultStep: 37,
    promptSuffix: ", in the middle ,white background"
  },
  coloringBook: {
    name: "Coloring Book",
    apiUrl: "https://api-inference.huggingface.co/models/renderartist/coloringbookflux",
    inferenceSteps: [26, 31, 36, 41, 46],
    defaultStep: 36,
    promptSuffix: ", c0l0ringb00k"
  },
  ghibskyIllustration: {
    name: "Ghibsky Illustration",
    apiUrl: "https://api-inference.huggingface.co/models/aleksa-codes/flux-ghibsky-illustration",
    inferenceSteps: [29, 34, 39, 44, 49],
    defaultStep: 39,
    promptSuffix: ", GHIBSKY style"
  },
  logoDesign: {
    name: "Logo Design",
    apiUrl: "https://api-inference.huggingface.co/models/Shakker-Labs/FLUX.1-dev-LoRA-Logo-Design",
    inferenceSteps: [25, 30, 35, 40, 45],
    defaultStep: 35,
    promptSuffix: ", wablogo, logo"
  },
  cute3D: {
    name: "Cute 3D",
    apiUrl: "https://api-inference.huggingface.co/models/SebastianBodza/flux_cute3D",
    inferenceSteps: [28, 33, 38, 43, 48],
    defaultStep: 38,
    promptSuffix: ", NEOCUTE3D"
  },
  plushyWorld: {
    name: "Plushy World",
    apiUrl: "https://api-inference.huggingface.co/models/alvdansen/plushy-world-flux",
    inferenceSteps: [27, 32, 37, 42, 47],
    defaultStep: 37,
    promptSuffix: ", 3dcndylnd style"
  },
  hauntedLinework: {
    name: "Haunted Linework",
    apiUrl: "https://api-inference.huggingface.co/models/alvdansen/haunted_linework_flux",
    inferenceSteps: [26, 31, 36, 41, 46],
    defaultStep: 36,
    promptSuffix: ", hntdlnwrk style"
  },
  aquarelWatercolor: {
    name: "Aquarel Watercolor",
    apiUrl: "https://api-inference.huggingface.co/models/SebastianBodza/flux_lora_aquarel_watercolor",
    inferenceSteps: [29, 34, 39, 44, 49],
    defaultStep: 39,
    promptSuffix: ", AQUACOLTOK"
  },
  nsfwMaster: {
    name: "NSFW Master",
    apiUrl: "https://api-inference.huggingface.co/models/pimpilikipilapi1/NSFW_master",
    inferenceSteps: [30, 35, 40, 45, 50],
    defaultStep: 40
  },
  blendedRealisticIllustration: {
    name: "Blended Realistic Illustration",
    apiUrl: "https://api-inference.huggingface.co/models/youknownothing/FLUX.1-dev-LoRA-blended-realistic-illustration",
    inferenceSteps: [28, 33, 38, 43, 48],
    defaultStep: 38
  }
};