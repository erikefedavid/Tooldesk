import { Tools } from "@/data/tools";
import { Tool } from "@/type/tool";

export interface ConciergeRecommendation {
  tool: Tool;
  reason: string;
  paywallWarning: string;
  cheatCodeTip: string;
  secondaryTool?: Tool;
}

// Curated problem-pattern rules that outsmart commercial paywall traps
interface ProblemRule {
  patterns: RegExp[];
  toolId: string;
  secondaryToolId?: string;
  reason: string;
  paywallWarning: string;
  cheatCodeTip: string;
}

const PROBLEM_RULES: ProblemRule[] = [
  {
    patterns: [/youtube/i, /yt/i, /download.*video/i, /save.*video/i, /tiktok.*download/i, /twitter.*video/i, /instagram.*video/i, /convert.*mp4/i],
    toolId: "cobalt",
    reason: "Cobalt is 100% open-source, completely ad-free, and directly downloads pristine 1080p/4K video and audio from YouTube, TikTok, Twitter/X, and Instagram.",
    paywallWarning: "Typical ad-supported download sites are infested with fake download buttons, notification spam, and adware redirect tabs.",
    cheatCodeTip: "Just paste your link into Cobalt, select your format (MP4 or MP3), and it downloads immediately with zero intermediaries.",
  },
  {
    patterns: [/merge.*pdf/i, /compress.*pdf/i, /pdf.*merge/i, /pdf.*tool/i, /pdf.*split/i, /edit.*pdf/i, /convert.*pdf/i, /sign.*pdf/i],
    toolId: "pdf24-tools",
    secondaryToolId: "fullyfreetools",
    reason: "PDF24 Tools offers 30+ unlimited PDF utilities (merge, compress, convert, protect, unlock) with zero file size caps and zero watermarks.",
    paywallWarning: "Commercial PDF tools like Adobe or Smallpdf lock you out with monthly paywalls ($15–$25/mo) after just 1 or 2 files.",
    cheatCodeTip: "PDF24 has zero daily limits and also offers a 100% free offline Windows app that processes sensitive documents completely locally without uploading.",
  },
  {
    patterns: [/remove.*bg/i, /remove.*background/i, /transparent.*image/i, /erase.*photo/i, /magic.*eraser/i, /watermark.*remover/i, /remove.*watermark/i, /erase.*object/i, /photo.*enhancer/i, /upscale.*photo/i],
    toolId: "ezmaker-ai",
    secondaryToolId: "unscreen",
    reason: "EzMaker AI has a free AI magic eraser, background remover, and watermark cleaner running right in the browser with zero sign-up.",
    paywallWarning: "Popular commercial alternatives limit free exports to tiny 0.2 megapixel previews and charge recurring credits for high-resolution originals.",
    cheatCodeTip: "Use the Magic Eraser brush on any photo to remove unwanted people, text, or photobombers without leaving smudges or watermarks.",
  },
  {
    patterns: [/photoshop.*free/i, /ps.*free/i, /edit.*photo/i, /psd.*editor/i, /photo.*editor/i, /open.*psd/i],
    toolId: "photopea",
    reason: "Photopea is a full Photoshop clone in the browser that opens and saves PSD, AI, XD, RAW, and Sketch files with complete layer, mask, and filter support.",
    paywallWarning: "Adobe Photoshop requires a costly Creative Cloud subscription ($22.99/mo) and heavily consumes computer storage.",
    cheatCodeTip: "Works completely offline as a PWA (Progressive Web App). You can press Install in your browser and use it without an internet connection.",
  },
  {
    patterns: [/test.*ai/i, /compare.*ai/i, /free.*gpt/i, /free.*claude/i, /test.*gpt-4o/i, /arena/i, /llm.*benchmark/i, /blind.*test/i],
    toolId: "lmarena-ai",
    secondaryToolId: "venice-ai",
    reason: "LMSYS Chatbot Arena lets you chat with GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, and DeepSeek side-by-side completely free without logging in.",
    paywallWarning: "Accessing frontier models individually usually requires multiple separate subscriptions ($20/mo each to OpenAI, Anthropic, etc.).",
    cheatCodeTip: "Use 'Direct Chat' mode if you just want to talk directly to a specific frontier model for free without the A/B battle screen.",
  },
  {
    patterns: [/api.*key/i, /free.*api/i, /gemini.*api/i, /developer.*playground/i, /prototype.*ai/i, /free.*llm.*api/i],
    toolId: "google-ai-studio",
    reason: "Google AI Studio gives you a developer web playground plus free API keys for Gemini 1.5 Pro, Flash, and Thinking models with up to 15 requests/minute without a credit card.",
    paywallWarning: "Most commercial LLM APIs immediately require entering a credit card and prepaying compute credits before you can make a single call.",
    cheatCodeTip: "You can upload whole video files, 1,000-page PDF books, or audio clips directly into the 2M token context window for deep reasoning.",
  },
  {
    patterns: [/3d.*particle/i, /particle.*simulation/i, /creative.*coding/i, /webgl.*swarm/i, /threejs.*particle/i],
    toolId: "particles-casberry",
    reason: "Particles Casberry is a real-time browser sandbox simulating 20,000+ 3D particles with hand/mouse physics, exporting directly into React or Three.js code.",
    paywallWarning: "Commercial 3D asset tools and particle plugins often require heavy desktop software licenses like After Effects or Houdini.",
    cheatCodeTip: "You can prompt equations in plain English, adjust camera gravity, and click export to drop the code straight into your website.",
  },
  {
    patterns: [/music/i, /song/i, /generate.*song/i, /ai.*music/i, /split.*stem/i, /beat/i, /audio.*generator/i],
    toolId: "google-flow-music",
    reason: "Google Flow Music (powered by DeepMind Lyria 3.5) generates full multi-section songs with vocals, arrangements, and stem editing from simple text prompts.",
    paywallWarning: "Commercial music platforms burn through tight monthly credits fast and charge $10–$30/mo for downloads.",
    cheatCodeTip: "You can use conversational editing to replace a single lyric or solo while preserving the rest of the generated track.",
  },
  {
    patterns: [/secret.*note/i, /burn.*note/i, /private.*message/i, /self.*destruct/i, /send.*password/i],
    toolId: "privnote",
    reason: "Privnote sends peer-to-peer encrypted notes that automatically self-destruct from the internet the exact moment the recipient reads them.",
    paywallWarning: "Sending passwords over chat or email leaves an unencrypted permanent audit log that can be breached or screenshotted.",
    cheatCodeTip: "Enable 'Notify me when this note is destroyed' to verify when your recipient opened the credential link.",
  },
  {
    patterns: [/coding.*interview/i, /leetcode/i, /dsa/i, /algorithm.*practice/i, /blind.*75/i],
    toolId: "neetcode",
    secondaryToolId: "roadmap-sh",
    reason: "NeetCode provides free structured roadmaps and visual video explanations for the famous Blind 75 and NeetCode 150 algorithms.",
    paywallWarning: "LeetCode Premium charges $35/month just to view company-tagged questions and video explanations.",
    cheatCodeTip: "Follow the NeetCode Roadmap tree: start from Arrays & Hashing and work up to Dynamic Programming with the free embedded video guides.",
  },
  {
    patterns: [/learn.*code/i, /learn.*programming/i, /full.*stack.*free/i, /software.*engineering.*course/i, /web.*dev.*course/i],
    toolId: "the-odin-project",
    secondaryToolId: "full-stack-open",
    reason: "The Odin Project is a completely free, open-source full-stack web development curriculum that has trained thousands of working engineers.",
    paywallWarning: "Commercial coding bootcamps charge $15,000–$25,000 in tuition for essentially the same syllabus that The Odin Project provides for free.",
    cheatCodeTip: "Build every project and push them to your personal GitHub portfolio. The community Discord has thousands of mentors helping daily.",
  },
  {
    patterns: [/decode/i, /base64/i, /hash/i, /crypto.*chef/i, /hex/i, /cybersecurity.*tool/i, /format.*json/i],
    toolId: "cyberchef",
    secondaryToolId: "transform-tools",
    reason: "CyberChef ('The Cyber Swiss Army Knife') runs hundreds of data transforms, hashes, decodings, and formatters entirely client-side.",
    paywallWarning: "Sketchy online converters send your sensitive API keys, tokens, and data to third-party ad servers.",
    cheatCodeTip: "Chain multiple 'recipes' together: e.g. Base64 Decode -> Gunzip -> Format JSON all in one automated pipeline.",
  },
  {
    patterns: [/free.*video.*generator/i, /ai.*video/i, /text.*to.*video/i, /video.*ai/i],
    toolId: "wan-ai",
    secondaryToolId: "melius",
    reason: "Wan 2.1 AI is the groundbreaking open-weights video model that rivals commercial engines like Sora, runnable with open Hugging Face web demos.",
    paywallWarning: "Commercial video generators charge expensive monthly credit packs ($20–$95/mo) for only a few seconds of video.",
    cheatCodeTip: "Use Wan 2.1 Hugging Face spaces or Pinokio 1-click local installer to generate 1080p clips with zero watermark or monthly fee.",
  },
  {
    patterns: [/cut.*video/i, /trim.*video/i, /lossless.*cut/i, /fast.*video.*trim/i, /split.*video/i],
    toolId: "lossless-cut",
    secondaryToolId: "handbrake",
    reason: "LosslessCut slices and trims huge 4K video and audio files in milliseconds without re-encoding, preserving 100% of the original video quality.",
    paywallWarning: "Online video trimmers re-encode your videos with lossy compression, watermark your clips, or take forever uploading gigabytes of data.",
    cheatCodeTip: "Set your in and out points with 'I' and 'O' hotkeys and click Export — it finishes instantly using direct stream copy.",
  },
  {
    patterns: [/airdrop/i, /send.*file/i, /share.*file.*wifi/i, /local.*send/i, /transfer.*file/i],
    toolId: "localsend",
    secondaryToolId: "snapdrop",
    reason: "LocalSend is an open-source, encrypted cross-platform file sharing app for Windows, Mac, Linux, iOS, and Android that works over your local Wi-Fi.",
    paywallWarning: "Cloud storage providers require uploading your personal files to the internet, creating accounts, and hitting storage caps.",
    cheatCodeTip: "Both devices just need to be on the same Wi-Fi network. No internet connection or accounts required.",
  },
  {
    patterns: [/edit.*audio/i, /audio.*editor/i, /cut.*audio/i, /trim.*audio/i, /waveform/i, /record.*audio/i],
    toolId: "audiomass",
    secondaryToolId: "vocal-remover",
    reason: "AudioMass is a full waveform audio editor in the browser (like Audacity) with zero download, zero telemetry, and 100% local processing.",
    paywallWarning: "Most browser-based audio tools require paid subscriptions to export high-bitrate MP3 or WAV files.",
    cheatCodeTip: "Drop in any audio track, highlight the segment you want, apply fade-in/out or compressor effects, and export immediately.",
  },
  {
    patterns: [/diagram/i, /flowchart/i, /draw.*io/i, /architecture.*diagram/i, /draw.*flow/i],
    toolId: "diagrams-net",
    secondaryToolId: "excalidraw",
    reason: "Diagrams.net (draw.io) provides a completely free, unlimited diagramming platform with full AWS, GCP, Azure, and UML icon libraries.",
    paywallWarning: "Tools like Lucidchart or Miro limit free accounts to only 3 editable boards before demanding $10–$15/month.",
    cheatCodeTip: "Save directly to your local computer or GitHub repository to keep full ownership of your diagrams without cloud lock-in.",
  },
  {
    patterns: [/add.*watermark/i, /watermark.*batch/i, /watermark.*bulk/i, /bulk.*watermark/i, /watermark.*photo/i, /watermark.*pix/i, /watermark.*image/i, /stamp.*photo/i],
    toolId: "pixelbatch",
    reason: "PixelBatch watermarks hundreds of photos locally in your browser in seconds with custom text/logos, zero server uploads, and unlimited batch export.",
    paywallWarning: "Commercial watermark apps limit you to 5 photos or demand monthly subscriptions to unlock batch processing.",
    cheatCodeTip: "Drop your entire photo folder, set opacity to 45% with bottom-right positioning, and export the entire batch as a ZIP.",
  },
  {
    patterns: [/remove.*watermark/i, /watermark.*remover/i, /erase.*watermark/i, /clean.*watermark/i, /delete.*watermark/i],
    toolId: "watermarkout",
    secondaryToolId: "dewatermark-ai",
    reason: "WatermarkOut uses open-source in-browser AI to cleanly erase watermarks and timestamps from photos and videos completely offline.",
    paywallWarning: "Commercial watermark removers charge expensive credit packs ($10–$30) and downscale your exported photo quality.",
    cheatCodeTip: "Brush over the watermark — the neural network runs in-browser via WebAssembly and reconstructs background textures with zero server uploads.",
  },
  {
    patterns: [/youtube.*download/i, /download.*youtube/i, /ytdown/i, /save.*video/i, /download.*instagram/i, /download.*video/i, /convert.*youtube.*mp3/i, /extract.*audio.*video/i],
    toolId: "cobalt",
    secondaryToolId: "tikwm",
    reason: "Cobalt is the world's cleanest, open-source media downloader. Paste any YouTube, TikTok, Instagram, or X link to save up to 4K 60fps or pure audio with zero ads, zero trackers, and zero popups.",
    paywallWarning: "Traditional 'ytdown' websites bombard you with sketchy popup ads, fake virus notifications, and crypto mining scripts.",
    cheatCodeTip: "Paste your link into Cobalt, select 'Audio only' if you just want MP3/Opus, or choose your target resolution up to 4K.",
  },
  {
    patterns: [/tiktok/i, /tiktok.*watermark/i, /video.*without.*watermark/i, /download.*tiktok/i, /save.*tiktok/i, /no.*watermark.*video/i, /download.*video.*no.*watermark/i],
    toolId: "tikwm",
    secondaryToolId: "cobalt",
    reason: "TikWM cleanly strips the native moving TikTok watermark and usernames from any video or photo carousel, delivering pure Full HD MP4 and MP3 audio tracks.",
    paywallWarning: "Shady TikTok download apps bombard your phone with redirect ads, force you to install unwanted VPN profiles, or add their own watermark.",
    cheatCodeTip: "Paste the TikTok link into TikWM and click 'Download Server 1' to grab the crisp HD file without any watermarks or overlays.",
  },
  {
    patterns: [/artcraft/i, /ai.*studio.*local/i, /composition.*ai/i, /character.*consistency/i, /open.*source.*adobe/i, /stage.*3d.*ai/i],
    toolId: "artcraft",
    reason: "ArtCraft is an open-source, local-first creative AI studio written in Rust. It lets you compose 2D sketches and stage 3D scenes before AI generation to maintain character consistency across projects.",
    paywallWarning: "Adobe Creative Cloud costs over $600/year and cloud AI image platforms lock you into monthly recurring credit tokens.",
    cheatCodeTip: "Use ArtCraft's 3D viewport to lock down character poses and camera perspectives, then plug in your choice of local or cloud AI models.",
  },
  {
    patterns: [/download.*book/i, /free.*book/i, /read.*book/i, /textbook/i, /find.*book/i, /epub/i, /pdf.*book/i, /ebook/i],
    toolId: "annas-archive",
    secondaryToolId: "standard-ebooks",
    reason: "Anna's Archive is the world's largest open-source shadow library aggregating 30+ million books, textbooks, and scientific papers with zero paywalls. For beautifully typeset literature, Standard Ebooks provides modern typographic editions.",
    paywallWarning: "College textbooks and commercial ebook stores charge $80–$250 per semester for digital editions that expire after exams.",
    cheatCodeTip: "Search Anna's Archive by ISBN, author, or title to find direct PDF and EPUB downloads without creating an account.",
  },
  {
    patterns: [/photo/i, /camera.*simulator/i, /learn.*photography/i, /aperture/i, /shutter.*speed/i, /iso/i, /exposure.*triangle/i, /dslr/i],
    toolId: "photoskop",
    reason: "Photoskop is an interactive browser-based camera mechanics simulator and photography academy. It lets you test aperture, shutter speed, ISO, depth of field, and studio lighting in real-time.",
    paywallWarning: "Photography masterclasses and textbook bundles charge hundreds of dollars for theory that Photoskop demonstrates interactively for free.",
    cheatCodeTip: "Use the interactive camera player to test f-stop depth of field and motion blur live before heading out on a photo shoot.",
  },
  {
    patterns: [/music.*theory/i, /circle.*of.*fifths/i, /chords/i, /fretboard/i, /guitar.*scales/i, /piano.*chords/i, /learn.*music/i, /beat.*maker/i],
    toolId: "muted-io",
    secondaryToolId: "audiomass",
    reason: "Muted.io is a colorful, interactive collection of visual music theory tools, virtual guitar/bass fretboards, interactive piano chord visualizers, and browser drum sequencers.",
    paywallWarning: "Music schools and chord apps push you into monthly subscriptions just to view chord charts and scale fingerings.",
    cheatCodeTip: "Use the interactive Circle of Fifths to discover harmonic key modulations, or map scale notes onto the virtual guitar fretboard with one click.",
  },
  {
    patterns: [/draw.*anime/i, /draw.*manga/i, /anime.*eyes/i, /manga.*tutorial/i, /sketch.*anime/i, /anime.*proportions/i, /how.*to.*draw/i],
    toolId: "animeoutline",
    secondaryToolId: "artcraft",
    reason: "AnimeOutline provides clean, step-by-step manga illustration guides breaking down facial features, eye expressions, hair styling, and body proportions line by line.",
    paywallWarning: "Art academy platforms lock step-by-step anatomy references behind monthly Patreon or course paywalls.",
    cheatCodeTip: "Follow the initial construction lines and head proportion guidelines first before adding hair or fine detail.",
  },
];

/**
 * Intelligent Semantic Problem-to-Tool Solver
 * Matches natural-language human complaints to the exact free cheat-code tool.
 */
export function solveProblem(query: string): ConciergeRecommendation {
  const cleanQuery = query.trim().toLowerCase();
  const toolsById = new Map<string, Tool>(Tools.map((t) => [t.id, t]));

  // 1. Check curated problem-to-cheat-code rules first
  for (const rule of PROBLEM_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(cleanQuery))) {
      const tool = toolsById.get(rule.toolId);
      if (tool) {
        const secondary = rule.secondaryToolId ? toolsById.get(rule.secondaryToolId) : undefined;
        return {
          tool,
          reason: rule.reason,
          paywallWarning: rule.paywallWarning,
          cheatCodeTip: rule.cheatCodeTip,
          secondaryTool: secondary,
        };
      }
    }
  }

  // 2. High-speed multi-token fuzzy matching against all tools
  const tokens = cleanQuery.split(/\s+/).filter((t) => t.length > 2);
  let bestTool: Tool | null = null;
  let highestScore = -1;

  for (const tool of Tools) {
    let score = 0;
    const nameLower = tool.name.toLowerCase();
    const taglineLower = tool.tagline.toLowerCase();
    const descLower = tool.description.toLowerCase();
    const tagsLower = tool.tags.map((t) => t.toLowerCase());
    const featuresLower = tool.feature.map((f) => f.toLowerCase()).join(" ");

    for (const token of tokens) {
      if (nameLower.includes(token)) score += 8;
      if (tagsLower.some((t) => t.includes(token))) score += 5;
      if (taglineLower.includes(token)) score += 4;
      if (featuresLower.includes(token)) score += 3;
      if (descLower.includes(token)) score += 2;
    }

    if (score > highestScore) {
      highestScore = score;
      bestTool = tool;
    }
  }

  // Fallback to Cobalt or EzMaker if query was ambiguous
  const fallbackTool = bestTool || toolsById.get("cobalt") || Tools[0];

  return {
    tool: fallbackTool,
    reason: `${fallbackTool.name} is the top free recommendation for this task in our curated deck. It offers ${fallbackTool.feature[0].toLowerCase()} without hidden charges.`,
    paywallWarning: "Most commercial software pushes users into recurring subscriptions or trials that demand a credit card.",
    cheatCodeTip: `Directly launch ${fallbackTool.name} to complete your task with zero watermarks and no mandatory fees.`,
  };
}
