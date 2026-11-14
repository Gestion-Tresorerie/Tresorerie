/* Écran d'accès : verrou léger côté navigateur (dissuasion, pas une sécurité forte). */
(function(){
  var H='8645b9a2983215cea50f38117fa3bb086bdf7294c8ee51750ee7a719a446e431',S='9b71cde162de1a1cb1ed0e78b11a36eb',IT=310000,KEY='budget-gate-ok';
  if(!/\.github\.io$/.test(location.hostname))return;
  function hex(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return ('0'+x.toString(16)).slice(-2)}).join('')}
  function derive(code){
    var salt=new Uint8Array(S.match(/../g).map(function(h){return parseInt(h,16)}));
    return crypto.subtle.importKey('raw',new TextEncoder().encode(code),'PBKDF2',false,['deriveBits']).then(function(k){
      return crypto.subtle.deriveBits({name:'PBKDF2',salt:salt,iterations:IT,hash:'SHA-256'},k,256)}).then(hex);
  }
  try{if(localStorage.getItem(KEY)===H)return}catch(e){}
  var st=document.createElement('style');
  st.id='gate-style';
  st.textContent='header,main,.tabbar{display:none!important}'+
    '#gate{position:fixed;inset:0;z-index:99;display:flex;align-items:center;justify-content:center;padding:20px;background:var(--page,#0a0f1d);color:var(--ink,#e9eef7);font-family:var(--font,system-ui,sans-serif)}'+
    '#gate form{width:100%;max-width:340px;padding:24px;border-radius:20px;border:1px solid var(--glass-b,rgba(255,255,255,.16));background:var(--surface,rgba(255,255,255,.07));-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);box-shadow:var(--shadow,0 8px 30px rgba(0,0,0,.35));text-align:center}'+
    '#gate img{width:56px;height:56px;margin-bottom:8px}#gate h1{font-size:18px;margin:0 0 4px}#gate p{font-size:13px;color:var(--muted,#a3b0c4);margin:0 0 16px}'+
    '#gate input{width:100%;padding:12px;border-radius:12px;border:1px solid var(--line,rgba(255,255,255,.14));background:var(--bg,rgba(255,255,255,.06));color:inherit;font:inherit;font-size:16px;text-align:center;letter-spacing:.08em}'+
    '#gate button{width:100%;margin-top:12px;padding:12px;border:0;border-radius:12px;background:var(--accent,#7db0ff);color:var(--accent-ink,#0b1a30);font:inherit;font-weight:600;cursor:pointer}'+
    '#gate button:disabled{opacity:.5}#gate .err{min-height:18px;margin-top:10px;font-size:13px;color:var(--bad,#ff8d82)}';
  document.head.appendChild(st);
  var fails=0;
  document.addEventListener('DOMContentLoaded',function(){
    var icon=document.querySelector('.brand img');
    var g=document.createElement('div');g.id='gate';
    g.innerHTML='<form autocomplete="off">'+(icon?'<img alt="" src="'+icon.src+'">':'')+
      '<h1>Budget du foyer</h1><p>Accès réservé. Entre le code d’accès.</p>'+
      '<input type="password" name="code" autocomplete="current-password" autocapitalize="none" spellcheck="false" aria-label="Code d’accès" required>'+
      '<button type="submit">Ouvrir</button><div class="err" role="alert"></div></form>';
    document.body.appendChild(g);
    var f=g.querySelector('form'),inp=f.code,btn=f.querySelector('button'),err=f.querySelector('.err');
    inp.focus();
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var v=inp.value.trim();if(!v)return;
      btn.disabled=true;err.textContent='';
      derive(v).then(function(h){
        if(h===H){try{localStorage.setItem(KEY,H)}catch(x){}
          var s=document.getElementById('gate-style');if(s)s.remove();g.remove();return}
        fails++;err.textContent='Code incorrect.';inp.value='';
        setTimeout(function(){btn.disabled=false;inp.focus()},Math.min(8000,700*fails*fails));
      }).catch(function(){err.textContent='Navigateur non compatible.';btn.disabled=false});
    });
  });
})();
