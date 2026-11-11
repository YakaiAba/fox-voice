// Fox-voice service worker: trang lấy từ mạng trước (chờ 4 giây), lỗi thì dùng bản lưu
const C='foxvoice-app-v9';
const FILES=['./','./index.html','./icon-180.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('foxvoice-app-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
 e.respondWith((async()=>{const c=await caches.open(C);
  try{const r=await Promise.race([fetch(e.request),new Promise((_,j)=>setTimeout(()=>j(new Error('timeout')),4000))]);if(r&&r.ok)c.put(e.request,r.clone());return r}
  catch(err){const m=await c.match(e.request,{ignoreSearch:true})||await c.match('./index.html');if(m)return m;throw err}})())});
