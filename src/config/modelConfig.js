export const modelConfig = {
  turbo: {
    name: "SD-3.5Large-turbo",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large-turbo",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: null,
    tagline: "Fast generation with good quality",
    image: "https://i.ibb.co.com/3C2N2LJ/1734417062623.jpg",
    example: "make high quality flawless prompt, use quality and style tags like: high quality, studio lighting, professional portrait, Anime style or 3D style, make it not too long not too short, provide fine details like environment, lighting, colors, visual elements, if included charachters then styling, clothings, appearance, activity e.t.c",
    steps: 4,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  flux: {
    name: "Flux.1 Schnell",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Balanced speed and quality",
    image: "https://i.ibb.co.com/51P0fS0/out-0.webp",
    example: "make high quality flawless prompt, use quality and style tags like: high quality, studio lighting, professional portrait, Anime style or 3D style, make it not too long not too short, provide fine details like environment, lighting, colors, visual elements, if included charachters then styling, clothings, appearance, activity e.t.c",
    steps: 4,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false
  },
  sd35l: {
    name: "SD-3.5Large",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: null,
    tagline: "Latest Stable diffusion model",
    image: "https://i.ibb.co.com/XDLVk6m/R8-sd3-5-L-00001.webp",
    example: "make high quality flawless prompt, use quality and style tags like: high quality, studio lighting, professional portrait, Anime style or 3D style, make it not too long not too short, provide fine details like environment, lighting, colors, visual elements, if included charachters then styling, clothings, appearance, activity e.t.c",
    steps: 40,
    use_guidance: true,
    defaultguidance: 4.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  fluxDev: {
    name: "FLx.1 Dev",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Flux dev by black forest labs",
    image: "https://i.ibb.co.com/gjrM8R5/out-0-1.webp",
    example: "make high quality flawless prompt, use quality and style tags like: high quality, studio lighting, professional portrait, Anime style or 3D style, make it not too long not too short, provide fine details like environment, lighting, colors, visual elements, if included charachters then styling, clothings, appearance, activity e.t.c",
    steps: 28,
    use_guidance: false,
    use_negative_prompt: false
  },
  ultra: {
    name: "Flux.1 Pro",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Ultimate-LoRA-Collection",
    qualityLimits: null,
    isPremium: true,
    promptSuffix: null,
    tagline: "A merge of multiple models",
    image: "https://i.ibb.co.com/Tqb5Pgk/sample.jpg",
    example: "Make high quality flawless prompt, use quality and style tags like: high quality, studio lighting, professional portrait, Anime style or 3D style, make it not too long not too short, provide fine details like environment, lighting, colors, visual elements, if included charachters then styling, clothings, appearance, activity e.t.c",
    steps: 30,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  midjourney: {
    name: "Midjourney-V6",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Midjourney-Mix2-LoRA",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", MJ v6",
    tagline: "Latest version of Midjourney for free",
    image: "https://i.ibb.co.com/8PnDLkf/1.png",
    example: "Start with 'MJ v6,'. Make high quality flawless prompts that will go well wth Midjourney, use quality and style tags like: high quality, studio lighting, professional portrait, e.t.c make it not too long not too short, provide fine details like environment, lighting, colors, visual elements, if included charachters then styling, clothings, appearance, activity e.t.c. End with '--ar 47:64 --v 6.0 --style raw' this is an example: 'MJ v6, A photo of an attractive man in his thirties, wearing a black coat and yellow scarf with a brown pattern inside a building talking on a phone standing near a modern glass skyscraper in London, shot from below looking up at him in the style of street photography, cinematic.  --ar 85:128 --v 6.0 --style raw'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  dalle: {
    name: "Dall-E 3",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/Nercy/flux-dalle",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", dalle",
    tagline: "Open AI Dall-E 3",
    image: "https://i.ibb.co.com/18gFNNS/images-example-kz79mj1mz.jpg",
    example: "Make high quality flawless prompt, use quality and style tags like: high quality, studio lighting, professional portrait, Anime style or 3D style, make it not too long not too short, provide fine details like environment, lighting, colors, visual elements, if included charachters then styling, clothings, appearance, activity e.t.c",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  leonardoillust: {
    name: "Lenoardo illust",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/goofyai/Leonardo_Ai_Style_Illustration",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", leonardo style, illustration, vector art",
    tagline: "Leonardo Style illustration",
    image: "https://i.ibb.co.com/p4TMjdp/leo-1.png",
    example: "tailor the prompt to make vector illustration type images, Make high quality flawless prompt not too long not too short ",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  fastReal: {
    name: "Realism turbo",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Canopus-LoRA-Flux-FaceRealism",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", photography, photorealistic",
    tagline: "make realistic images fast",
    image: "https://i.ibb.co.com/JrYsbmT/SD3.webp",
    example: "Start with 'A photorealistic portrait of' .Make high quality flawless prompt, use quality and style tags like: high quality, studio lighting, professional portrait. make it not too long not too short, provide fine details like environment, lighting, colors, visual elements, if included charachters then styling, clothings, appearance, activity e.t.c",
    steps: 4,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  Illustturbo: {
    name: "Illustration turbo",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Simple-Doodle-SD3.5-Turbo",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: ", Simple Doodle",
    tagline: "make simple illustrations fast",
    image: "https://i.ibb.co.com/Mhk3M6v/SD1.webp",
    example: "Start with 'Simple Doodle, A cartoon drawing of' then describe a simple illustration image",
    steps: 4,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  render3d: {
    name: "3D Render XL",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/goofyai/3D_Render_for_Flux",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", 3D render",
    tagline: "render 3D images",
    image: "https://i.ibb.co.com/sbmM5mp/3d-style-2.jpg",
    example: "Start with 'a 3D rendered scene of'. Make high quality flawless prompt, use quality and style tags like: high quality, studio lighting, 3D style, blender style, 3D rendered. make it not too long not too short, provide fine details like environment, lighting, colors, visual elements, if included charachters then styling, clothings, appearance, activity e.t.c. End with ', blender style'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  anime: {
    name: "Anime XL",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/Nishitbaria/LoRa-Flux-Anime-Style",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", ANMCH",
    tagline: "Flwaless Anime style images",
    image: "https://i.ibb.co.com/c1kPmWg/Euv-INv-Bs-CKZQusp-ZHN-u-F.png",
    example: "Make high quality flawless prompt, use quality and style tags like: high quality, studio ghibli, Vibrant Anime make it not too long not too short, provide fine details like environment, lighting, colors, visual elements, if included charachters then styling, clothings, appearance, activity e.t.c",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  anime2xl: {
    name: "Anime XL 2",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/Nishitbaria/AnimeXL",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", animexl",
    tagline: "Anime style images make fast",
    image: "https://i.ibb.co.com/hc3dWxr/images-example-zgfn69jth.jpg",
    example: "Make high quality flawless prompt, use quality and style tags like: high quality, studio ghibli, Vibrant Anime make it not too long not too short, provide fine details like environment, lighting, colors, visual elements, if included charachters then styling, clothings, appearance, activity e.t.c",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  dreamscape: {
    name: "Dreamscape",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/bingbangboom/flux_dreamscape",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", in the style of BSstyle004",
    tagline: "Dream up",
    image: "https://i.ibb.co.com/nkxPsYG/images-2.jpg",
    example: "Start with 'in the style of BSstyle004,'. follow this example: 'white-haired young man, extremely simple, large-scale blue, brightly colored board, dark white and light blue'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  cinestill: {
    name: "CineStill",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/adirik/flux-cinestill",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", CNSTLL",
    tagline: "make distilled Cinematic scenes",
    image: "https://i.ibb.co.com/rs5g7Xz/3.png",
    example: "Start with 'CNSTLL,'. Best suited for generating night and dusk time photograph-like images with a distinctive slight halation effect. Keywords that result in better generations 'cinestill 800t', 'night time', 'dusk', '4k', 'high resolution', 'analog film'. Example: 'in the style of CNSTLL , urban landscape, people fishing on Galata  bridge in Istanbul at night'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  pencilSketch: {
    name: "Pencil Sketch",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/Datou1111/shou_xin",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", shou_xin, pencil sketch",
    tagline: "sketch art pencil and colors",
    image: "https://i.ibb.co.com/P4xLs4W/img-00282.png",
    example: "Start with 'shou_xin A color pencil sketch of' then describe a minimal sketch image subject and End with ', close up, minimalist, impressionism, negative space' heres an example: 'shou_xin, a monochromatic pencil sketch of a crow, minimalist, impressionism, negative space', heres another example: 'shou_xin, A pencil sketch of steve jobs, minimalist, impressionism, negative space'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  vertorArt: {
    name: "Vector Art",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/lichorosario/flux-lora-simple-vector",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", v3ct0r, vector",
    tagline: "Create Vector arts",
    image: "https://i.ibb.co.com/wKszPV2/images-example-ylmvpzdqk.jpg",
    example: "Start with 'v3ct0r style, simple flat vector art, isolated on white bg,' Then describe the Vector Graphics element that should show in the image. Heres an example: 'v3ct0r style, simple flat vector art, isolated on white bg, rocket' heres another example: 'v3ct0r style, simple flat vector art, isolated on white bg, kawaii bread slice wearing black frame eyeglasses. Small smile. There is a blue flower pink center placed at the top right corner of the bread slice.'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  Isometric: {
    name: "Isometric",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Isometric-3D-LoRA",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Isometric 3D",
    tagline: "Isometric style, build your world",
    image: "https://i.ibb.co.com/88P57s7/ID2.png",
    example: "Start with 'Isometric 3D, a 3D model of' Then describe the things to appear in the image, heres an example: 'Isometric 3D, a 3D model of a tropical island is displayed on a light blue backdrop. The island features a small body of water, surrounded by gray rocks and green grass. There are palm trees and small bushes scattered throughout the island, adding a pop of color to the scene.'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  logodesign: {
    name: "Logo Design",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/Shakker-Labs/FLUX.1-dev-LoRA-Logo-Design",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", wablogo, logo, Minimalist",
    tagline: "Make your brand Identity",
    image: "https://i.ibb.co.com/277njvK/03.png",
    example: "Start with 'wablogo, logo, Minimalist' Then describe the logo to appear in the image, heres an example: 'logo,Minimalist,A pair of chopsticks and a bowl of rice with the word Lee', Usage suggestion: Dual Combination: something and something, e.g., cat and coffee, Font Combination: a shape plus a letter, e.g., a book with the word 'M', or The fingerprint pattern consists of the letters 'hp', Text Below Graphic: Below the graphic is the word 'coffee', directly using with the word 'XX' is also feasible",
    steps: 28,
    use_guidance: true,
    defaultguidance: 5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  mixreality: {
    name: "Mix Reality",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/Shakker-Labs/FLUX.1-dev-LoRA-Logo-Design",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Cross the boudary",
    image: "https://i.ibb.co.com/gw2DNvN/images-3.jpg",
    example: "Make prompt for making images where reality and anime or illustration mixes, example: 'A vivid photo of a 2D illustrated anime girl riding a bicycle, busy street, road signs. The photo is a blend of illustration and reality, in the style of HLFILSTHLFPHTO'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  sticker: {
    name: "Sticker",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Ton618-Only-Stickers-Flux-LoRA",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Only Sticker",
    tagline: "Make your brand Identity",
    image: "https://i.ibb.co.com/Ryx6b4B/111.png",
    example: "Start with 'Only Sticker, An animated image of a' Then describe the sticker to appear in the image, heres an example: 'Only Sticker, An animated illustration of a sloth in a mug with the words 'Sloth Fuel' written on it. The sloth is holding the mug with its left hand and its right hand resting on the mug. The mug is filled with coffee and there is a brown liquid dripping from the bottom of the cup. There is a white background behind the sloth with a smoke coming out of it. There are three coffee beans on the bottom left corner of the image.'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  handwriting: {
    name: "Handwriting",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/fofr/flux-handwriting",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", HWRIT handwriting",
    tagline: "Real lookin handwriting images",
    image: "https://i.ibb.co.com/mFPgMkj/0041358a-ee46-4cab-85f5-108c4f09b729.jpg",
    example: "make prompt like this: HWRIT very neat handwriting saying 'this is a handwriting model'(replace this with the text to write in the image), black(replace with suitable color) ink on white_paper(replace with on what to write)",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  teenoutfitGenerator: {
    name: "Teen Outfit",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Teen-Outfit",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Teen Outfit",
    tagline: "Make cool outfits and cloths",
    image: "https://i.ibb.co.com/MCWQZBN/TO3.png",
    example: "Start with 'Teen Outfit,' Then describe the outfit in very details, Example: 'Teen Outfit, a teal and white jacket is adorned with a white hoodie. The jacket has a white stripe down the left side of the jacket, and two white stripes on the right and left side. On the left sleeve, there is a text written in a cursive font that is in black ink that reads X and X. The jacket is positioned against a stark white backdrop, creating a striking contrast.'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  colorChaos: {
    name: "Color Chaos",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Digital-Chaos-Flux-LoRA",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Digital Chaos",
    tagline: "Chaos of Colors to make modern art",
    image: "https://i.ibb.co.com/TgcCsdf/HDRDC2.webp",
    example: "Start with 'Digital Chaos,' in the end describe background colors like this: 'The background is a mix of blue, purple, orange, and yellow, and white.' heres an example: 'Digital Chaos, An abstract painting of a womans face, the womans head is covered in black hair. The womans eyes are closed, and her lips are slightly parted. The background is a mix of blue, purple, orange, and yellow, and white. The painting has splashes of white, red, and blue, and black, creating a vibrant and colorful effect.'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  pixelArt: {
    name: "Pixel Art",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/nerijs/pixel-art-3.5L",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: ", pixel art",
    tagline: "Modern Pixel art",
    image: "https://i.ibb.co.com/DkdtLrG/Comfy-UI-00047.png",
    example: "Make high quality flawless prompt, use quality and style tags like: high quality, studio lighting, professional portrait, pixel art, make it not too long not too short, provide fine details like environment, lighting, colors, visual elements, if included charachters then styling, clothings, appearance, activity e.t.c, make pixel art style images prompt",
    steps: 40,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  iconkit: {
    name: "Icon Kit",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Icon-Kit-LoRA",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Icon kit",
    tagline: "3d Icons",
    image: "https://i.ibb.co.com/cxqCCnf/1-1.png",
    example: "Start with 'Icon Kit, An animated image of' then describe a minimal element as icon for the image and at the end describe a suitable calm background color, heres an example: 'Icon Kit, An animated image of a red canister with a black cap on the top. The canister has a black stripe on the side and a yellow hose attached to the cap. The background is a bright blue color.'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  aura: {
    name: "Aura 9999+",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/Aura-9999",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Aura 9999",
    tagline: "gives your creations some aura",
    image: "https://i.ibb.co.com/NNWjs4d/A3.png",
    example: "Start with 'Aura 9999,' then describe the image and add aura elements to the image suitably to generte an image that showcases Aura on the subject of the image. here an example: 'Aura 9999, a hamburger is captured in a vibrant blue-green glow. The hamburger bun is adorned with sesame seeds, adding a pop of color to the otherwise monochromatic scene. The burger is situated in the center of the frame, with a layer of lettuce surrounding it. The lettuce is a vibrant shade of green, while the tomato slices are a vibrant red. The sandwich is positioned in front of a backdrop of smoke, creating a stark contrast to the burger. The lighting is subdued in the foreground, adding depth to the composition.'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  blacked: {
    name: "Minimal blacked",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/prithivMLmods/SD3.5-Large-Minimal-Blacked-LoRA",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: ", blacked",
    tagline: "minimal black background",
    image: "https://i.ibb.co.com/qskQPqT/q4.webp",
    example: "Describe a minimal graphics element then use 'depicted against a dark blacked background' example: A bright green leaf logo is depicted against a dark blacked background. The leaf has smooth, organic lines with subtle veins running through it, giving it a natural and lifelike appearance. A soft glow surrounds the leaf, adding a gentle illumination that contrasts beautifully with the dark background. This contrast between the vibrant green and deep black creates a fresh and eco-friendly feel, making the logo appear both vibrant and serene.",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  disney: {
    name: "Disney",
    category: "General",
    apiUrl: "https://api-inference.huggingface.co/models/Keltezaa/all-disney-princess-xl-lora-model-from-ralph-breaks-the-internet",
    qualityLimits: ["HD"],
    isPremium: false,
    promptSuffix: null,
    tagline: "Disney princes, use name",
    image: "https://i.ibb.co.com/54bxzMk/4058459.jpg",
    example: "You have to make amazing disney style images prompt of disney princesses, if princess name not mentioned in original prompt then add suitable name like Elsa or Anna, heres an example: 'cinematic photo casual anna, ,   . 35mm photograph, film, bokeh, professional, 4k, highly detailed'",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  nsfwMaster: {
    name: "Real",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/aifeifei798/sldr_flux_nsfw_v2-studio",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Nsfw, naked,",
    tagline: "NSFW generation",
    image: "https://i.ibb.co.com/qm9ZjV4/b36e71ed-c142-49c4-8ba5-4f3a57bd6ae9.jpg",
    example: "craft high quality prompts to make images of naked girls in nudity related things",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  animeNsfw: {
    name: "Anime",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/John6666/mala-anime-mix-nsfw-pony-xl-v5-sdxl",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: null,
    tagline: "Anime-style NSFW generation",
    image: "https://i.ibb.co.com/Tt1gwLG/1730283256633.jpg",
    example: "craft high quality prompts to make images of naked girls in nudity or sex related things",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  },
  nudephotography: {
    name: "Nude Photography",
    category: "NSFW",
    apiUrl: "https://api-inference.huggingface.co/models/Keltezaa/Prof_Nude_photography_v3_flux",
    qualityLimits: null,
    isPremium: false,
    promptSuffix: ", Nude photograpy, naked",
    tagline: "Nude models for Photoshoot",
    image: "https://i.ibb.co.com/GW2LDP1/example-20kld8mba.jpg",
    example: "craft high quality prompts to make images of naked porn models girls",
    steps: 28,
    use_guidance: false,
    defaultguidance: 7.5,
    use_negative_prompt: false,
    default_negative_prompt: "ugly, bad anatomy, blurry, pixelated, poor quality, watermark, signature, text"
  }
};
