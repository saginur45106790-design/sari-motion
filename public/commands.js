export function parseCommand(text){
 const p=text.toLowerCase();const values={};const matches=[];
 const rules=[['color',/লাল|red/,'#aa2441'],['color',/নীল|blue/,'#254c98'],['color',/সবুজ|green/,'#27604d'],['color',/হলুদ|yellow/,'#d8a22d'],['color',/বেগুনি|purple/,'#79468b'],['color',/গোলাপি|pink/,'#bb5784'],['color',/কালো|black/,'#24252f'],['color',/সাদা|white/,'#e5ded3'],['hair',/খোলা|loose/,'loose'],['hair',/খোঁপা|খোপা|bun/,'bun'],['hair',/বেণি|বেণী|braid/,'braid'],['walk',/স্বাভাবিক|natural/,'natural'],['walk',/ধীর|slow/,'slow'],['walk',/দ্রুত|fast/,'confident'],['camera',/পেছন|পিছন|back/,'back'],['camera',/সামন|front/,'front'],['camera',/পাশ|side/,'side'],['camera',/চারপাশ|orbit/,'orbit'],['scene',/ছাদ|roof/,'roof'],['scene',/রাত|night/,'night'],['scene',/স্টুডিও|studio/,'studio']];
 for(const [key,re,value] of rules){const m=p.match(re);if(m){values[key]=value;matches.push(m[0]);}}
 const normalized=p.replace(/[০-৯]/g,c=>'০১২৩৪৫৬৭৮৯'.indexOf(c));const seconds=normalized.match(/\b(5|10|15)\s*(?:সেকেন্ড|seconds?|s\b)/);if(seconds){values.duration=seconds[1];matches.push(seconds[0]);}
 return {values,matches};
}
