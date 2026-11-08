import * as THREE from './vendor/three.module.js';
import {parseCommand} from './commands.js';
const $=id=>document.getElementById(id);
const keys=['color','hair','walk','camera','scene','duration','quality','wind'];
let renderer,recorder=null,stream=null,recordTimer=null,wakeLock=null,downloadURL=null,recordFailed=false;
let playing=true,t=0,last=performance.now(),recordStart=0,frames=0,fpsStart=last,dragAngle=0,drag=null;
const state=()=>Object.fromEntries(keys.map(k=>[k,$(k).value]));
function status(message){$('status').textContent=message;}
try{renderer=new THREE.WebGLRenderer({canvas:$('canvas'),antialias:true,preserveDrawingBuffer:true});}catch(e){status('এই ব্রাউজারে 3D চালু হয়নি। WebGL-সমর্থিত Chrome ব্যবহার করো।');$('record').disabled=true;throw e;}
renderer.setPixelRatio(1);renderer.setSize(360,640,false);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,9/16,.1,60);
const hemi=new THREE.HemisphereLight(0xe9f4ff,0x7d765d,2.2);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe9cb,3);sun.position.set(-3,7,4);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-5,right:5,top:5,bottom:-5});sun.shadow.bias=-.0005;scene.add(sun);
const fill=new THREE.DirectionalLight(0xc3ddff,.8);fill.position.set(3,3,-4);scene.add(fill);
const mat=(color,roughness=.75,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const skin=mat('#c89475'),hairMat=mat('#20191c',.53),sari=mat('#922e58',.6),gold=mat('#d9af59',.4,.55),blouse=mat('#64253e'),eye=mat('#29211e'),white=mat('#e4cfc0');
function mesh(geo,material,parent,pos=[0,0,0]){const m=new THREE.Mesh(geo,material);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function ell(parent,material,pos,scale){const m=mesh(new THREE.SphereGeometry(1,24,16),material,parent,pos);m.scale.set(...scale);return m;}
function box(parent,material,pos,scale){const m=mesh(new THREE.BoxGeometry(...scale),material,parent,pos);return m;}
function group(parent,pos=[0,0,0]){const g=new THREE.Group();g.position.set(...pos);parent.add(g);return g;}
const character=group(scene);
// One reusable procedural character. No photographs or pretrained AI model are used.
const torso=group(character,[0,.97,0]);
ell(torso,skin,[0,.2,0],[.16,.27,.105]);ell(torso,blouse,[0,.37,0],[.205,.19,.115]);
mesh(new THREE.CylinderGeometry(.057,.065,.15,16),skin,torso,[0,.57,0]);
const head=group(torso,[0,.72,.005]);ell(head,skin,[0,0,0],[.113,.151,.104]);
ell(head,hairMat,[0,.055,-.015],[.121,.12,.107]);
// Face details are deliberately stylized, not a likeness of the supplied reference.
for(const s of [-1,1]){ell(head,skin,[s*.108,-.015,0],[.021,.035,.018]);ell(head,white,[s*.042,.006,.094],[.024,.010,.012]);ell(head,eye,[s*.041,.006,.103],[.009,.009,.005]);const brow=box(head,hairMat,[s*.042,.031,.094],[.047,.006,.009]);brow.rotation.z=s*.09;mesh(new THREE.TorusGeometry(.021,.004,7,16),gold,head,[s*.116,-.067,.005]);}
ell(head,skin,[0,-.025,.108],[.014,.025,.019]);ell(head,mat('#995554'),[0,-.065,.089],[.028,.006,.009]);ell(head,mat('#7c1d37'),[0,.045,.101],[.005,.005,.003]);
const loose=group(head),bun=group(head),braid=group(head);
for(let i=0;i<9;i++){const strand=ell(loose,hairMat,[(i-4)*.025,-.14,-.09],[.032,.25+(i%3)*.01,.045]);strand.rotation.z=(i-4)*.018;}
ell(bun,hairMat,[0,-.015,-.136],[.093,.086,.07]);for(let i=0;i<12;i++){const a=i*Math.PI/6;ell(bun,mat('#eee6d4'),[Math.cos(a)*.083,-.015+Math.sin(a)*.074,-.18],[.012,.012,.012]);}
for(let i=0;i<12;i++)ell(braid,hairMat,[Math.sin(i*2.1)*.018,-.09-i*.033,-.113],[.033-i*.0013,.027,.024]);
const arms=[];for(const s of [-1,1]){const arm=group(torso,[s*.192,.38,0]);const sleeve=ell(arm,blouse,[s*.015,-.055,0],[.065,.105,.068]);ell(arm,skin,[s*.018,-.15,0],[.044,.13,.045]);const elbow=group(arm,[s*.018,-.25,0]);ell(elbow,skin,[0,-.1,0],[.036,.12,.035]);ell(elbow,skin,[0,-.22,0],[.036,.048,.018]);for(let j=0;j<3;j++){const b=mesh(new THREE.TorusGeometry(.035,.004,7,18),gold,elbow,[0,-.17-j*.012,0]);b.rotation.x=Math.PI/2;}arms.push({arm,elbow,s});}
const legs=[];for(const s of [-1,1]){const hip=group(character,[s*.075,.87,0]);ell(hip,skin,[0,-.2,0],[.062,.24,.064]);const knee=group(hip,[0,-.4,0]);ell(knee,skin,[0,-.18,0],[.043,.2,.045]);ell(knee,skin,[0,-.375,.05],[.048,.035,.095]);ell(knee,gold,[0,-.396,.05],[.051,.009,.1]);legs.push({hip,knee,s});}
const skirtGeo=new THREE.CylinderGeometry(.151,.255,.86,64,16,true);
const skirt=mesh(skirtGeo,sari,character,[0,.55,0]);const skirtBase=skirtGeo.attributes.position.array.slice();
const border=mesh(new THREE.CylinderGeometry(.252,.26,.034,64,1,true),gold,character,[0,.126,0]);
// Sari shoulder drape: tapered cloth surface over the torso, with gold edges.
function ribbon(parent,material,a,b,width){const delta=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));const m=mesh(new THREE.PlaneGeometry(width,delta.length(),10,18),material,parent);m.position.copy(new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());m.material.side=THREE.DoubleSide;return m;}
ribbon(torso,sari,[-.145,.51,.12],[.12,.01,.127],.19);
ribbon(torso,gold,[-.23,.47,.124],[.035,-.03,.132],.016);
const pallu=mesh(new THREE.PlaneGeometry(.28,.83,12,26),sari,torso,[-.16,.08,-.14]);pallu.material.side=THREE.DoubleSide;const palluBase=pallu.geometry.attributes.position.array.slice();
// Gold pleats and embroidered motifs remain attached to the sari.
for(let i=0;i<8;i++){const pleat=box(character,gold,[(i-3.5)*.018,.47,.213],[.003,.64,.004]);pleat.rotation.x=-.08;}
for(let row=0;row<5;row++)for(let j=0;j<18;j++){const a=j/18*Math.PI*2,r=.166+row*.018;const m=ell(character,gold,[Math.sin(a)*r,.88-row*.14,Math.cos(a)*r],[.009,.012,.004]);m.rotation.y=a;}
const world=group(scene);const roofMat=mat('#c4c4ac'),wallMat=mat('#e8d9ba');
box(world,roofMat,[0,-.045,0],[12,.08,30]);
for(const x of [-2.6,2.6])box(world,wallMat,[x,.35,0],[.14,.7,28]);
const moving=group(world);for(let z=-12;z<14;z+=2){box(moving,mat('#aaac98'),[0,.003,z],[5,.005,.012]);}
const plants=group(world);for(let i=0;i<10;i++){const z=-10+i*2.5,x=(i%2?1:-1)*2.15;mesh(new THREE.CylinderGeometry(.15,.1,.25,12),mat('#ae7656'),plants,[x,.125,z]);for(let j=0;j<5;j++)ell(plants,mat(j%2?'#48634a':'#6c8052'),[x+Math.sin(j*2)*.1,.38+j*.04,z+Math.cos(j*2)*.1],[.12,.22,.08]);}
const skyline=group(world);for(let i=0;i<16;i++){const x=(i%2?1:-1)*(4+(i%3)*1.6),z=-12+i*1.8,h=.8+(i%4)*.7;box(skyline,mat(['#b6b9aa','#cab49a','#93a79d'][i%3]),[x,h/2-.1,z],[1.7,h,1.7]);}
const lights=group(world);for(let i=0;i<15;i++){const m=ell(lights,new THREE.MeshBasicMaterial({color:i%2?'#ffbe66':'#ffe8aa'}),[-2.4,1.7,-12+i*1.9],[.045,.045,.045]);}
function updateSettings(){const s=state();sari.color.set(s.color);blouse.color.set(s.color).multiplyScalar(.64);loose.visible=s.hair==='loose';bun.visible=s.hair==='bun';braid.visible=s.hair==='braid';
 const night=s.scene==='night',studio=s.scene==='studio';scene.background=new THREE.Color(night?'#182b36':studio?'#d9d5c9':'#c8dbd4');scene.fog=new THREE.Fog(scene.background,9,25);hemi.intensity=night?.7:2.2;sun.intensity=night?1.2:3;sun.color.set(night?'#ffc48a':'#ffe9cb');lights.visible=night;plants.visible=!studio;skyline.visible=!studio;roofMat.color.set(studio?'#d9d5c9':night?'#535e60':'#c4c4ac');$('sceneLabel').textContent=$('scene').selectedOptions[0].textContent;dragAngle=0;renderer.setSize(Number(s.quality),Number(s.quality)*16/9,false);
}
keys.forEach(k=>$(k).addEventListener('input',updateSettings));
$('apply').onclick=()=>{const parsed=parseCommand($('prompt').value);for(const [k,v]of Object.entries(parsed.values))$(k).value=v;updateSettings();$('promptStatus').textContent=parsed.matches.length?'প্রয়োগ হয়েছে: '+parsed.matches.join(' · ')+'। তালিকার বাইরের নির্দেশ প্রয়োগ হয়নি।':'কোনো পরিচিত নির্দেশ পাওয়া যায়নি। রং, চুল, হাঁটা, ক্যামেরা বা ৫/১০/১৫ সেকেন্ড লিখো।';};
$('play').onclick=()=>{playing=!playing;$('play').textContent=playing?'বিরতি':'চালাও';};$('reset').onclick=()=>{t=0;dragAngle=0;};
$('canvas').addEventListener('pointerdown',e=>{if(recorder)return;drag=e.clientX;$('canvas').setPointerCapture(e.pointerId);});$('canvas').addEventListener('pointermove',e=>{if(drag===null)return;dragAngle+=(e.clientX-drag)*.009;drag=e.clientX;});for(const ev of ['pointerup','pointercancel'])$('canvas').addEventListener(ev,()=>drag=null);
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;if(playing)t+=dt;const s=state(),speed=s.walk==='slow'?1.9:s.walk==='confident'?3.8:2.8,phase=t*speed,wind=Number(s.wind);
 character.position.y=Math.abs(Math.sin(phase))*.012;character.rotation.z=Math.sin(phase)*.014;torso.rotation.y=Math.sin(phase)*.035;
 for(const {hip,knee,s:side} of legs){hip.rotation.x=Math.sin(phase+(side<0?Math.PI:0))*.3;knee.rotation.x=Math.max(0,-Math.sin(phase+(side<0?Math.PI:0)))*.35;}
 for(const {arm,elbow,s:side} of arms){arm.rotation.x=-Math.sin(phase+(side<0?Math.PI:0))*.25;arm.rotation.z=side*.065;elbow.rotation.x=-.1-Math.max(0,Math.sin(phase))* .04;}
 loose.rotation.x=Math.sin(phase-.4)*.035+wind*.03;loose.rotation.z=Math.sin(t*2)*wind*.07;braid.rotation.z=Math.sin(phase)*.06;
 const pos=skirtGeo.attributes.position;for(let i=0;i<pos.count;i++){const x=skirtBase[i*3],y=skirtBase[i*3+1],z=skirtBase[i*3+2],w=(.43-y)/.86;pos.setXYZ(i,x+Math.sin(phase)*w*.014,y,z+Math.sin(phase+x*9)*w*.015);}pos.needsUpdate=true;
 const pp=pallu.geometry.attributes.position;for(let i=0;i<pp.count;i++){const x=palluBase[i*3],y=palluBase[i*3+1],z=palluBase[i*3+2],w=(.415-y)/.83;pp.setXYZ(i,x+Math.sin(t*2.5+y*5)*w*wind*.04,y,z-Math.sin(t*2+y*7)*w*(.025+wind*.09));}pp.needsUpdate=true;
 moving.position.z=(t*speed*.16)%2;
 let angle={front:0,back:Math.PI,side:Math.PI/2,orbit:t*.25}[s.camera]+dragAngle;camera.position.set(Math.sin(angle)*3.35,1.36,Math.cos(angle)*3.35);camera.lookAt(0,.89,0);renderer.render(scene,camera);
 $('time').textContent='00:'+String(Math.floor(t)%60).padStart(2,'0');frames++;if(now-fpsStart>1000){$('fps').textContent=Math.round(frames*1000/(now-fpsStart))+' FPS';frames=0;fpsStart=now;}
 if(recorder&&recorder.state==='recording')$('progress').value=Math.min(1,(now-recordStart)/(Number(s.duration)*1000));
}
function lockUI(locked){$('settings').disabled=locked;for(const id of ['apply','prompt','play','reset','record'])$(id).disabled=locked;$('stop').hidden=!locked;$('progress').hidden=!locked;}
async function cleanup(){clearTimeout(recordTimer);stream?.getTracks().forEach(track=>track.stop());stream=null;recorder=null;lockUI(false);if(wakeLock){await wakeLock.release().catch(()=>{});wakeLock=null;}}
function stop(){if(recorder?.state==='recording')recorder.stop();}
$('stop').onclick=stop;
$('record').onclick=async()=>{if(!window.MediaRecorder||!$('canvas').captureStream){status('এই ব্রাউজারে ভিডিও রেকর্ড সমর্থিত নয়। আপডেট করা Android Chrome-এ চেষ্টা করো।');return;}
 const mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'].find(x=>MediaRecorder.isTypeSupported(x));if(!mime){status('সমর্থিত ভিডিও ফরম্যাট পাওয়া যায়নি।');return;}
 try{t=0;playing=true;drag=null;$('play').textContent='বিরতি';updateSettings();stream=$('canvas').captureStream(24);recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:Number($('quality').value)>=720?5000000:2500000});const chunks=[];recordFailed=false;recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
 recorder.onerror=()=>{recordFailed=true;status('রেকর্ডিং ব্যর্থ হয়েছে। ছোট রেজল্যুশনে আবার চেষ্টা করো।');cleanup();};
 recorder.onstop=async()=>{const actual=recorder?.mimeType||mime;await cleanup();if(recordFailed)return;if(!chunks.length){status('কোনো ভিডিও পাওয়া যায়নি। আবার চেষ্টা করো।');return;}if(downloadURL)URL.revokeObjectURL(downloadURL);downloadURL=URL.createObjectURL(new Blob(chunks,{type:actual}));$('video').src=downloadURL;$('download').href=downloadURL;$('download').download='sari-studio-'+Date.now()+(actual.includes('mp4')?'.mp4':'.webm');$('result').hidden=false;status('ভিডিও তৈরি হয়েছে। প্রিভিউ দেখে ডাউনলোড করো।');};
 recorder.start(250);recordStart=performance.now();lockUI(true);$('progress').value=0;status('রেকর্ড হচ্ছে… ট্যাবটি খোলা রাখো।');recordTimer=setTimeout(stop,Number($('duration').value)*1000);
 if(navigator.wakeLock){const lock=await navigator.wakeLock.request('screen').catch(()=>null);if(recorder)wakeLock=lock;else await lock?.release();}
 }catch(e){await cleanup();status('রেকর্ডিং চালু হয়নি: '+e.message);}
};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&recorder){stop();status('ট্যাব আড়ালে যাওয়ায় রেকর্ডিং থামানো হয়েছে।');}});
$('canvas').addEventListener('webglcontextlost',e=>{e.preventDefault();recordFailed=true;stop();playing=false;$('record').disabled=true;status('3D সংযোগ হারিয়েছে। পেজ রিলোড করে কম রেজল্যুশন বেছে নাও।');});
updateSettings();status('প্রস্তুত। দৃশ্য বেছে নিয়ে ভিডিও রেকর্ড করো।');requestAnimationFrame(animate);
