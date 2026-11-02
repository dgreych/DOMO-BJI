export const createProgress=()=>({seeds:0,unlocks:[]});
export function normalizeProgress(p){if(!p||typeof p!=='object'||!Number.isFinite(p.seeds)||p.seeds<0||!Array.isArray(p.unlocks)||p.unlocks.some(x=>typeof x!=='string'))return createProgress();return {seeds:Math.min(100000,Math.floor(p.seeds)),unlocks:[...new Set(p.unlocks)].slice(0,300)};}
export function award(p,id,amount){if(p.unlocks.includes(id)||!Number.isFinite(amount)||amount<=0)return false;p.unlocks.push(id);p.seeds+=amount;return true;}
export function readProgress(){try{return normalizeProgress(JSON.parse(localStorage.getItem('garden-v1')));}catch{return createProgress();}}
export function saveProgress(p){try{localStorage.setItem('garden-v1',JSON.stringify(p));return true;}catch{return false;}}
