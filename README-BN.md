# Sari Studio v1 — GitHub + Render

API ছাড়া কোডে তৈরি একটি স্টাইলাইজড 3D নারী চরিত্রের অ্যানিমেশন ওয়েবসাইট। এটি photorealistic AI video generator নয়। দেওয়া রেফারেন্স ছবির হুবহু মুখ এতে তৈরি করা হয়নি। একটি রেফারেন্স ছবি থেকে বাস্তবসম্মত 3D মানুষ নিজে তৈরি করার মডেল এই প্রকল্পে নেই।

## কী আছে
- কোড দিয়ে তৈরি একই 3D চরিত্র ও শাড়ি।
- শাড়ির রং, খোলা চুল/খোঁপা/বেণি, তিন হাঁটার গতি।
- সামনে/পেছনে/পাশে/চারপাশে ক্যামেরা; আঙুল দিয়ে ক্যামেরা ঘোরানো।
- দিনের ছাদ, রাতের উঠান ও স্টুডিও পরিবেশ।
- সীমিত বাংলা বা ইংরেজি শব্দ চিনে সেটিং বদলানো।
- ৫/১০/১৫ সেকেন্ডের নীরব ভিডিও রেকর্ড।
- 360×640, 540×960 বা 720×1280 আকার; লক্ষ্য 24 FPS। প্রকৃত FPS ফোনের ওপর নির্ভরশীল।
- WebM প্রথম পছন্দ; ব্রাউজারের সমর্থন থাকলে MP4 fallback। MP4 নিশ্চিত নয়।
- ভিডিও আগে দেখা এবং ডাউনলোড করা। আগের ডাউনলোড না করলে পরের রেকর্ড আগের প্রিভিউ বদলে দেবে।

## মোবাইল দিয়ে GitHub-এ আপলোড
1. ZIP ডাউনলোড করে ফোনের File Manager দিয়ে Extract করো।
2. GitHub-এ নতুন repository বানাও, নাম দাও `sari-studio`।
3. দরকার হলে Chrome-এর Desktop site চালু করো।
4. Extract করা ফাইল ও ফোল্ডার repository-এর মূল অংশে আপলোড করো। ZIP ফাইলটি একা আপলোড করলে সাইট চলবে না।
5. নিশ্চিত করো repository-তে সরাসরি `public/index.html` ও `render.yaml` আছে। বাড়তি `sari-studio/sari-studio/` স্তর বানিও না।
6. `public/vendor` ফোল্ডারও আপলোড করতেই হবে। এতে Three.js ও তার লাইসেন্স দেওয়া আছে।

## Render-এ চালানো
এই প্রকল্প **Static Site**। Web Service লাগবে না।

| ঘর | মান |
| --- | --- |
| Service type | Static Site |
| Repository | sari-studio |
| Branch | যে branch-এ আপলোড করেছ, সাধারণত main |
| Root Directory | খালি রাখো |
| Build Command | `echo "Static files ready"` |
| Publish Directory | `public` |
| Environment variables | লাগবে না |
| Start Command | Static Site-এ লাগে না |

Render-এ New → Static Site → GitHub repository সংযোগ → উপরের মানগুলো বসাও → Deploy করো। `render.yaml` দিয়ে Blueprint-ও ব্যবহার করা যায়।

## প্রথম ভিডিও
1. Deploy হওয়া HTTPS লিংক Android Chrome-এ খোলো। ফাইল ম্যানেজার থেকে index.html ট্যাপ করে চালিও না; ES module-এর জন্য HTTP/HTTPS প্রয়োজন।
2. প্রথমে 360×640 এবং ৫ সেকেন্ড বেছে নাও।
3. নির্দেশ লেখো: `লাল শাড়ি, খোঁপা, ধীরে হাঁটা, ছাদ, পেছন থেকে, ৫ সেকেন্ড`
4. নির্দেশ প্রয়োগ করো; চাইলে নিচের তালিকা থেকেও সেটিং বদলাও।
5. ভিডিও রেকর্ড করো। এই সময় অন্য অ্যাপে যেও না বা স্ক্রিন বন্ধ কোরো না।
6. তৈরি ভিডিও দেখে ডাউনলোড করো। WebM ফাইলকে শুধু নাম বদলে .mp4 করো না—তাতে MP4 হয় না।

## সীমা
- হাঁটা একটি procedural walk cycle; জটিল নাচ বা যেকোনো নতুন কাজের নির্দেশ তৈরি করতে পারে না।
- পোশাক, মুখ, চুল ও পরিবেশ স্টাইলাইজড; নমুনার মতো বাস্তব ভিডিও নয়।
- কাপড় ও চুলের দোলা সরল গাণিতিক অ্যানিমেশন, পূর্ণ physical simulation নয়।
- নির্দেশের পরিচিত শব্দগুলোই প্রয়োগ হয়। এক ঘরের একাধিক বিরোধী নির্দেশ এড়িয়ে চলো; চূড়ান্ত dropdown দেখে নিশ্চিত হও।
- Render ওয়েবসাইটের ফাইল দেয়। অ্যানিমেশন ও ভিডিও encoding হয় ফোনে।
- এই কোড ফ্রি; ফোনের হার্ডওয়্যার, ইন্টারনেট এবং হোস্টিংয়ের প্রযোজ্য সীমা আলাদা।
- ক্যামেরা/মাইক্রোফোন অনুমতি নেয় না; generated canvas রেকর্ড করে।
- অ্যাকাউন্ট, database, tracking বা ভিডিও upload ব্যবস্থা নেই। Refresh করলে রেকর্ড করা কিন্তু download না করা ভিডিও হারাবে।
- WebGL বা MediaRecorder না থাকলে ব্যবহারযোগ্য ত্রুটি দেখাবে। স্মার্টফোনে কার্যকারিতা নিজে পরীক্ষা করতে হবে।

## ফাইল
- public/index.html — বাংলা UI
- public/style.css — responsive design
- public/app.js — মডেল, পরিবেশ, animation, recording
- public/commands.js — সীমিত নির্দেশ parser
- public/vendor/three.module.js — Three.js 0.170.0, সঙ্গে MIT license
- render.yaml — Render static deployment
- tests/ — command parser পরীক্ষা

## ডেভেলপার পরীক্ষা
Node থাকলে `npm test` চালাও। `npm install` শুধু dependency উন্নয়ন/পুনরায় সংগ্রহের জন্য; deploy-তে প্রয়োজন নেই, কারণ vendor ফাইল অন্তর্ভুক্ত।

যাচাই: JavaScript syntax ও ৫টি command parser পরীক্ষা পাস করেছে। আলাদা CPU smoke check-এ ২৮৪টি mesh-এর scene initialization ও animation-এর সংখ্যাগত মান যাচাই হয়েছে; GPU renderer সেখানে mock ছিল। Cloud browser-এ UI লোড ও WebGL-অনুপস্থিতির ত্রুটি দেখা হয়েছে। সেই ব্রাউজারে WebGL না থাকায় প্রকৃত 3D rendering, video encoding এবং Android device performance যাচাই করা যায়নি।

## পরের মানোন্নয়ন
বাস্তবসম্মত মুখ ও কাপড়ের জন্য একটি মানসম্মত rigged character asset, sari garment ও matching animation দিয়ে procedural মডেল বদলাতে হবে। সেগুলো এই প্যাকেজে নেই।
