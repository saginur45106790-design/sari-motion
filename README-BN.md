# SariMotion Studio 02

এটি আগের Sari Studio-এর বড় 3D আপডেট। কোনো AI API, paid service, CDN বা server-side rendering dependency নেই। Render শুধু ফাইল পরিবেশন করে; তোমার ফোনের browser scene তৈরি ও ভিডিও রেকর্ড করে।

**এখনও স্টাইলাইজড 3D। বাস্তব মানুষের ভিডিও, AI video model বা রেফারেন্স ছবির হুবহু মুখ নয়।** উন্নত মানবমডেল নিজে import করার সুবিধা আছে; বাস্তবসম্মত rigged model এই ZIP-এ দেওয়া নেই।

## এই আপডেটে যা বদলেছে
1. শরীর ও মুখের নতুন continuous mesh, আঙুল, অলংকার ও চোখের পাতা নড়ার animation।
2. ফুলের কাজ, বোনা নকশা ও সাদামাটা কাপড়; texture কোডে আঁকা হয়।
3. সিল্ক ও সুতি material-এর আলাদা roughness ও sheen।
4. শাড়ির pleats ও curved shoulder drape; আঁচল ও চুলের দোলা। এটি আনুমানিক procedural motion, পূর্ণ physical cloth simulation নয়।
5. খোলা চুল, ফুলের খোঁপা ও বেণি।
6. স্বাভাবিক/ধীর/দ্রুত হাঁটা, ঘুরে তাকানো, স্থির দাঁড়ানো।
7. সোনালি বিকেল, দিনের ছাদ, রাতের উঠান ও স্টুডিও।
8. ক্যামেরার দিক, orbit, framing, অনুসরণ ও আলো নিয়ন্ত্রণ।
9. হালকা mobile mode ও বেশি ব্যয়বহুল shadow mode।
10. PNG ছবি সেভ, ভিডিও preview, format ও file size প্রদর্শন।
11. সেটিং JSON export/import এবং ফোনের browser-এ সেটিং মনে রাখা।
12. Embedded uncompressed GLB import ও সেই মডেলের animation clip বেছে নেওয়া।
13. Recording-এ controls lock, tab background হলে early stop, WebGL error handling।
14. SariMotion নাম, নতুন responsive UI ও চারটি preset।

## তোমার বর্তমান লাইভ সাইট আপডেট
তোমার সাইট: https://sari-motion.onrender.com/

এই ZIP তৈরি করলে নিজে থেকে GitHub/Render-এর live code বদলায় না।

1. ZIP ডাউনলোড করে Extract করো।
2. GitHub-এ **যে repository-টি এই Render site-এর সঙ্গে যুক্ত**, সেটি খোলো। নতুন repository বানানোর প্রয়োজন নেই।
3. ZIP-এর ফাইলগুলো একই path-এ upload করে পুরোনো ফাইল replace করো। পুরো `public` ফোল্ডারের ফাইল নিতে হবে, শুধু `app.js` নয়।
4. Repository root-এ `public/index.html` থাকতে হবে। ZIP নিজে upload কোরো না এবং অতিরিক্ত বাইরের folder তৈরি কোরো না।
5. `public/vendor`-এ Three.js, GLTFLoader, BufferGeometryUtils ও license থাকতে হবে। পুরোনো `commands.js` আর ব্যবহৃত হয় না; থাকলেও সমস্যা নেই।
6. Commit করো। Auto Deploy চালু থাকলে Render নতুন commit deploy করবে। না হলে Render-এর service dashboard থেকে Manual Deploy → Deploy latest commit করো।
7. Deployment শেষ হলে Chrome-এ সাইট reload করো। Header-এ **SariMotion** ও **STUDIO 02** দেখতে পাবে। পুরোনো UI থাকলে নতুন tab বা incognito-তে URL খোলো।

| Render setting | মান |
|---|---|
| Type | Static Site |
| Root Directory | খালি |
| Build Command | `echo "Static files ready"` |
| Publish Directory | `public` |
| Environment Variables | প্রয়োজন নেই |

## realme C75-এ প্রথম পরীক্ষা
1. Android Chrome-এ site খোলো।
2. Resolution: **360 × 640**; Render mode: **মোবাইল · হালকা ছায়া**।
3. **সোনালি বিকেল** preset নির্বাচন করো।
4. প্রথমে **৫ সেকেন্ড** রেকর্ড করো। এই সময় tab ও screen খোলা রাখো।
5. ভালো গতি থাকলে 540p পরীক্ষা করো। 720p বা উন্নত ছায়া চালালে তাপ, memory ও encoding-এর চাপ বাড়বে।
6. রেকর্ড চলাকালে অন্য tab/app-এ গেলে পাওয়া অংশটুকু save-এর জন্য প্রস্তুত হবে।

## বাংলা নির্দেশ উদাহরণ
`লাল সিল্ক শাড়ি, খোঁপা, ধীরে হাঁটা, সোনালি বিকেল, পেছন থেকে, ১০ সেকেন্ড`

`নীল শাড়ি, খোলা চুল, ঘুরে তাকাবে, রাত, চারপাশে, ১৫ সেকেন্ড`

এটি নির্দিষ্ট শব্দ চিনে dropdown বদলায়; সাধারণ ভাষা বোঝার AI নয়। পরিচিত শব্দগুলোর তালিকা ফলাফলে দেখায়। এক setting-এর বিপরীত একাধিক নির্দেশ লিখো না; dropdown-এ শেষ ফল দেখো।

## উন্নত GLB চরিত্র
নিজের একটি বৈধভাবে ব্যবহারযোগ্য GLB ফাইল থাকলে “নিজের উন্নত 3D মডেল ব্যবহার” খোলো।
- GLB v2, maximum 25 MB; textures ও buffers embedded থাকতে হবে।
- Draco, Meshopt ও KTX2/Basis compression প্রয়োজন এমন ফাইল এখানে সমর্থিত নয়।
- সাধারণ texture-যুক্ত, যথাযথ scale ও root motion ছাড়া in-place walk clip-সহ rigged model সবচেয়ে সুবিধাজনক।
- মডেল load হলে height 1.72 scene unit করে centered করা হয়।
- Clip থাকলে প্রথমটি চালু হয়; তালিকা থেকে অন্য clip বেছে নিতে পারো।
- Clip না থাকলে স্থির model দেখাবে। কোড নিজে arbitrary model-কে rig বা walk করায় না।
- Imported model-এর clothing, hair ও pose তার নিজের asset-এর অংশ; built-in sari/hair controls তখন disabled থাকে।
- Imported model file server-এ upload হয় না। Page refresh করলে পুনরায় import করতে হবে। Settings JSON-এ model file ঢোকে না।

## ভিডিও ও ডেটা
- লক্ষ্য 24 FPS; প্রকৃত FPS hardware ও browser-এর ওপর নির্ভর করে।
- Browser সমর্থন করলে MP4/H.264; না হলে VP8/VP9 WebM। MP4 নিশ্চয়তা নেই।
- WebM file-কে rename করে .mp4 করলে conversion হয় না।
- Sound, audio track বা background music এই সংস্করণে নেই।
- প্রতিবার recording নতুন preview দিয়ে আগের preview বদলায়। প্রয়োজনীয় video আগে download করো।
- Page বন্ধ/refresh করলে download না করা video হারাবে।
- Settings শুধু localStorage-এ থাকে; account, database ও analytics নেই।
- Video canvas থেকে রেকর্ড হয়; phone camera বা microphone permission লাগে না।

## পরীক্ষা ও সীমা
`npm test` → preset round-trip, settings validation, বাংলা নির্দেশ এবং malformed/external/compressed GLB rejection পরীক্ষা।

Node-এ syntax checks পাস করেছে। ৩৬টি pose/hair/walk combination-এ mesh ও transformation finite থাকার পরীক্ষা পাস করেছে। আলাদা CPU render-এ সামনে/পেছনের মডেল দেখে পোশাকের clipping সংশোধন করা হয়েছে; এটি browser rendering-এর বিকল্প প্রমাণ নয়। Renderer ও encoder mock করে app initialization, বাংলা নির্দেশ, recording controls lock/unlock এবং stream cleanup পরীক্ষা পাস হয়েছে। Cloud browser-এ live v1 ও নতুন UI দেখা গেছে, এবং WebGL অনুপস্থিতিতে error handling যাচাই হয়েছে। এই browser-এ WebGL নেই বলে actual browser rendering, MP4/WebM encoding ও realme C75 performance যাচাই করা যায়নি।

## ফাইলের দায়িত্ব
- `public/app.js`: UI, camera, recording, saving, import lifecycle
- `public/character.js`: built-in character, fabric texture, animation
- `public/environment.js`: scene, lights, shadows, moving details
- `public/config.js`: default settings, preset, validation, command parser
- `public/import-model.js`: GLB validation, loading, disposal
- `public/vendor/`: bundled Three.js 0.170.0 and loaders; MIT license included

এই প্যাকেজকে “হুবহু বাস্তব মানুষ” বা “AI দিয়ে যেকোনো নতুন ভিডিও বানানো সম্পন্ন” বলা যাবে না। সেই মানের জন্য character asset, motion quality ও rendering ক্ষমতা আলাদাভাবে উন্নত করতে হবে।
