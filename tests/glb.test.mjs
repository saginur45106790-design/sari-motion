import assert from 'node:assert/strict';
import {inspectGLB} from '../public/import-model.js';
function glb(data){const str=JSON.stringify(data),padded=str+' '.repeat((4-str.length%4)%4),bytes=new TextEncoder().encode(padded),buffer=new ArrayBuffer(bytes.length+20),v=new DataView(buffer);v.setUint32(0,0x46546c67,true);v.setUint32(4,2,true);v.setUint32(8,buffer.byteLength,true);v.setUint32(12,bytes.length,true);v.setUint32(16,0x4e4f534a,true);new Uint8Array(buffer,20).set(bytes);return buffer;}
assert.equal(inspectGLB(glb({asset:{version:'2.0'}})).asset.version,'2.0');
assert.throws(()=>inspectGLB(new ArrayBuffer(8)));
assert.throws(()=>inspectGLB(glb({images:[{uri:'https://example.org/a.png'}]})),/embedded/);
assert.throws(()=>inspectGLB(glb({buffers:[{uri:'local.bin'}]})),/embedded/);
assert.throws(()=>inspectGLB(glb({extensionsRequired:['KHR_draco_mesh_compression']})),/Compressed/);
const truncated=glb({asset:{version:'2.0'}}).slice(0,24);assert.throws(()=>inspectGLB(truncated));
console.log('GLB validation: embedded assets accepted; malformed, external and unsupported compressed files rejected.');
