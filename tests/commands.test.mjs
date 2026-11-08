import assert from 'node:assert/strict';
import {parseCommand} from '../public/commands.js';
assert.deepEqual(parseCommand('লাল শাড়ি, খোঁপা, ধীরে হাঁটা, ছাদ, পেছন থেকে, ৫ সেকেন্ড').values,{color:'#aa2441',hair:'bun',walk:'slow',camera:'back',scene:'roof',duration:'5'});
assert.deepEqual(parseCommand('blue sari loose hair fast front night 10 seconds').values,{color:'#254c98',hair:'loose',walk:'confident',camera:'front',scene:'night',duration:'10'});
assert.deepEqual(parseCommand('সাঁতার কাটো').values,{});
assert.equal(parseCommand('চারপাশে').values.camera,'orbit');
assert.equal(parseCommand('১০০ সেকেন্ড').values.duration,undefined);
console.log('5 command parser checks passed');
