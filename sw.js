/* Service worker : réseau d'abord, copie locale en secours (fonctionne hors ligne après une première visite). */
var V='budget-v1';
var FILES=['./','index.html','gate.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET')return;
  e.respondWith(fetch(r).then(function(res){
    var same=new URL(r.url).origin===location.origin;
    if(res&&(res.ok||res.type==='opaque')&&(same||/fonts\.(googleapis|gstatic)\.com/.test(r.url))){
      var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)});
    }
    return res;
  }).catch(function(){
    return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('index.html')});
  }));
});
