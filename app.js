/* ── WMO CODES ── */
const WMO={0:{l:'Clear Sky',i:'☀️',bg:'clear'},1:{l:'Mainly Clear',i:'🌤',bg:'clear'},2:{l:'Partly Cloudy',i:'⛅',bg:'cloudy'},3:{l:'Overcast',i:'☁️',bg:'overcast'},45:{l:'Foggy',i:'🌫',bg:'fog'},48:{l:'Icy Fog',i:'🌫',bg:'fog'},51:{l:'Light Drizzle',i:'🌦',bg:'rain'},53:{l:'Drizzle',i:'🌦',bg:'rain'},55:{l:'Heavy Drizzle',i:'🌧',bg:'rain'},61:{l:'Light Rain',i:'🌧',bg:'rain'},63:{l:'Rain',i:'🌧',bg:'rain'},65:{l:'Heavy Rain',i:'🌧',bg:'heavyrain'},71:{l:'Light Snow',i:'🌨',bg:'snow'},73:{l:'Snow',i:'❄️',bg:'snow'},75:{l:'Heavy Snow',i:'❄️',bg:'snow'},77:{l:'Snow Grains',i:'🌨',bg:'snow'},80:{l:'Showers',i:'🌦',bg:'rain'},81:{l:'Rain Showers',i:'🌧',bg:'rain'},82:{l:'Violent Showers',i:'⛈',bg:'thunder'},85:{l:'Snow Showers',i:'🌨',bg:'snow'},86:{l:'Heavy Snow',i:'❄️',bg:'snow'},95:{l:'Thunderstorm',i:'⛈',bg:'thunder'},96:{l:'Thunderstorm',i:'⛈',bg:'thunder'},99:{l:'Thunderstorm',i:'⛈',bg:'thunder'}};
const gW=c=>WMO[c]||{l:'Unknown',i:'🌡',bg:'cloudy'};

/* ── SCENE CONFIGS ── */
const DARK_SCENES={
  clear:      {top:'#0d1828',mid:'#0f2040',base:'#0a1630',sun:true,stars:true},
  cloudy:     {top:'#0c1220',mid:'#131a2e',base:'#0f1625'},
  overcast:   {top:'#080c16',mid:'#0e1220',base:'#0a0e1a'},
  rain:       {top:'#060a12',mid:'#0a0f1c',base:'#070c18',rain:true,lite:120},
  heavyrain:  {top:'#04080e',mid:'#070c16',base:'#050a12',rain:true,lite:300},
  thunder:    {top:'#04060c',mid:'#070a14',base:'#050810',rain:true,lite:300,lightning:true},
  snow:       {top:'#0e1528',mid:'#141d32',base:'#101828',snow:true},
  fog:        {top:'#0c1020',mid:'#13182a',base:'#0f1524',fog:true},
  night_clear:{top:'#02030a',mid:'#040610',base:'#030508',moon:true,stars:true},
};
const LIGHT_SCENES={
  clear:      {top:'#4a9fd4',mid:'#6ab8e8',base:'#88c8f0',sun:true},
  cloudy:     {top:'#7a9ab4',mid:'#92afc7',base:'#a8c4d8'},
  overcast:   {top:'#6a7e90',mid:'#7e94a8',base:'#92a8bc'},
  rain:       {top:'#4a5e72',mid:'#5a7080',base:'#6a8090',rain:true,lite:120},
  heavyrain:  {top:'#38505e',mid:'#48606e',base:'#587080',rain:true,lite:280},
  thunder:    {top:'#303848',mid:'#404858',base:'#505868',rain:true,lite:280,lightning:true},
  snow:       {top:'#7898b8',mid:'#90aecc',base:'#a8c4de',snow:true},
  fog:        {top:'#8898a8',mid:'#9aaab8',base:'#acbcc8',fog:true},
  night_clear:{top:'#1a2848',mid:'#243260',base:'#1c2850',moon:true,stars:true},
};

const GRADS=[['#0d3060','#061840'],['#1a3a1a','#0a1e0a'],['#3a1a0a','#1e0a06'],['#1a0a3a','#0e0620'],['#0a2a3a','#061520'],['#3a0a1a','#200610'],['#0a3a2a','#061e14'],['#2a1a0a','#150d06']];

/* ── STATE ── */
let places=JSON.parse(localStorage.getItem('wx4_p')||'null')||[{id:'chs',name:'Charleston',region:'Illinois',country:'US',lat:39.4942,lon:-88.1761,isDefault:true}];
localStorage.removeItem('wx3_c');let wxCache=JSON.parse(localStorage.getItem('wx4_c2')||'{}');
let unit=localStorage.getItem('wx4_u')||'C';
let mode=localStorage.getItem('wx4_m')||'dark';
let idx=0,editing=false,tx=0,ty=0,drag=false,ddx=0;

/* ── UTILS ── */
const cF=c=>Math.round(c*9/5+32);
const fmt=(c,u)=>u==='F'?cF(c):Math.round(c);
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const dayN=(s,i)=>i===0?'Today':DAYS[new Date(s+'T12:00:00').getDay()];
const hLbl=s=>{const h=new Date(s).getHours();if(h===0)return'12AM';if(h===12)return'12PM';return h>12?(h-12)+'PM':h+'AM';};
const nowH=()=>new Date().getHours();
function fmtTime(iso){if(!iso)return'—';const d=new Date(iso);let h=d.getHours(),m=d.getMinutes(),ap=h>=12?'PM':'AM';h=h%12||12;return`${h}:${String(m).padStart(2,'0')} ${ap}`;}

/* ── MOON PHASE ── */
function moonPhase(date){
  const known=new Date(2000,0,6,18,14,0);
  const diff=(date-known)/86400000;
  const cycle=29.53058867;
  const phase=((diff%cycle)+cycle)%cycle;
  let name,icon,illum;
  if(phase<1.85){name='New Moon';icon='🌑';illum=0;}
  else if(phase<7.38){name='Waxing Crescent';icon='🌒';illum=Math.round((phase/7.38)*50);}
  else if(phase<9.22){name='First Quarter';icon='🌓';illum=50;}
  else if(phase<14.77){name='Waxing Gibbous';icon='🌔';illum=Math.round(50+(phase-9.22)/5.55*50);}
  else if(phase<16.61){name='Full Moon';icon='🌕';illum=100;}
  else if(phase<22.15){name='Waning Gibbous';icon='🌖';illum=Math.round(100-(phase-16.61)/5.54*50);}
  else if(phase<23.99){name='Last Quarter';icon='🌗';illum=50;}
  else if(phase<29.53){name='Waning Crescent';icon='🌘';illum=Math.round(50-(phase-23.99)/5.54*50);}
  else{name='New Moon';icon='🌑';illum=0;}
  const nextFull=new Date(date.getTime()+(14.77-phase+cycle)%cycle*86400000);
  const daysToFull=Math.round(((14.77-phase+cycle)%cycle));
  return{name,icon,illum:Math.max(0,Math.min(100,illum)),daysToFull,nextFull};
}

/* ── DAILY SUMMARY ── */
function buildSummary(data){
  const c=data.current;
  const h=nowH();
  const wmo=gW(c.weather_code);
  const hPop=data.hourly.precipitation_probability;
  const hStart=data.hourly.time.findIndex(t=>new Date(t)>=new Date());
  const next12Pop=hPop.slice(hStart,hStart+12);
  const maxPop=Math.max(...next12Pop);
  const rainHr=next12Pop.findIndex(p=>p>50);
  let txt=`Currently ${wmo.l.toLowerCase()} at ${Math.round(c.temperature_2m)}°C (${cF(c.temperature_2m)}°F).`;
  if(maxPop>60&&rainHr>=0){
    const hLabel=rainHr===0?'shortly':rainHr===1?'in about an hour':`in about ${rainHr} hours`;
    txt+=` Rain likely ${hLabel}.`;
  } else if(maxPop>30){
    txt+=` A chance of rain in the next 12 hours.`;
  } else {
    txt+=` No precipitation expected in the next 12 hours.`;
  }
  const hi=Math.round(data.daily.temperature_2m_max[0]);
  const lo=Math.round(data.daily.temperature_2m_min[0]);
  txt+=` High of ${fmt(hi,unit)}°, low of ${fmt(lo,unit)}° today.`;
  return txt;
}

/* ── AQI ── */
function aqiInfo(val){
  if(val<=50) return{label:'Good',color:'#4caf50',desc:'Air quality is satisfactory.'};
  if(val<=100)return{label:'Moderate',color:'#ffeb3b',desc:'Acceptable for most people.'};
  if(val<=150)return{label:'Unhealthy for Sensitive Groups',color:'#ff9800',desc:'Sensitive groups may experience issues.'};
  if(val<=200)return{label:'Unhealthy',color:'#f44336',desc:'Everyone may experience effects.'};
  if(val<=300)return{label:'Very Unhealthy',color:'#9c27b0',desc:'Health alert for everyone.'};
  return{label:'Hazardous',color:'#7b1fa2',desc:'Emergency conditions.'};
}

/* ── SCENE ENGINE ── */
let rAF=null,sAF=null,ltTimer=null;
function applyScene(code){
  const w=gW(code),h=nowH();
  let k=w.bg;
  if(k==='clear'&&(h<6||h>=21))k='night_clear';
  const scenes=mode==='light'?LIGHT_SCENES:DARK_SCENES;
  const s=scenes[k]||scenes.cloudy;
  document.getElementById('scene').style.background=`linear-gradient(180deg,${s.top} 0%,${s.mid} 45%,${s.base} 100%)`;
  tog('sun',!!s.sun); tog('moon',!!s.moon);
  buildStars(!!(s.stars||s.moon));
  if(s.rain){document.getElementById('rain-canvas').classList.add('on');startRain(s.lite||150);}
  else{document.getElementById('rain-canvas').classList.remove('on');stopRain();}
  if(s.snow){document.getElementById('snow-canvas').classList.add('on');startSnow();}
  else{document.getElementById('snow-canvas').classList.remove('on');stopSnow();}
  if(s.lightning)startLt();else stopLt();
  ['f1','f2','f3'].forEach((id,i)=>{const el=document.getElementById(id);el.classList.toggle('on',!!s.fog);if(s.fog)el.style.animation=`fogDrift ${6+i*2}s ease-in-out infinite`;});
}
function tog(id,on){document.getElementById(id).classList.toggle('on',on);}
function buildStars(show){
  const el=document.getElementById('stars');
  if(!show){el.classList.remove('on');return;}
  if(!el.childElementCount){const f=document.createDocumentFragment();for(let i=0;i<130;i++){const d=document.createElement('div');const sz=Math.random()*2+.8;d.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;border-radius:50%;background:#fff;left:${Math.random()*100}%;top:${Math.random()*65}%;opacity:${Math.random()*.55+.2};animation:twinkle ${2+Math.random()*3}s ease-in-out infinite;animation-delay:${Math.random()*4}s`;f.appendChild(d);}el.appendChild(f);}
  el.classList.add('on');
}
let rD=[];
function startRain(n){stopRain();const cv=document.getElementById('rain-canvas');cv.width=window.innerWidth;cv.height=window.innerHeight;const ctx=cv.getContext('2d');rD=Array.from({length:n},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,l:Math.random()*18+8,sp:Math.random()*9+7,op:Math.random()*.35+.12}));const draw=()=>{ctx.clearRect(0,0,cv.width,cv.height);rD.forEach(d=>{ctx.strokeStyle=`rgba(180,220,245,${d.op})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-1.5,d.y+d.l);ctx.stroke();d.y+=d.sp;if(d.y>cv.height){d.y=-d.l;d.x=Math.random()*cv.width;}});rAF=requestAnimationFrame(draw);};draw();}
function stopRain(){if(rAF){cancelAnimationFrame(rAF);rAF=null;}}
let sF=[];
function startSnow(){stopSnow();const cv=document.getElementById('snow-canvas');cv.width=window.innerWidth;cv.height=window.innerHeight;const ctx=cv.getContext('2d');sF=Array.from({length:70},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*2.5+.8,sp:Math.random()*1.2+.4,dr:Math.random()*.6-.3,op:Math.random()*.5+.25}));const draw=()=>{ctx.clearRect(0,0,cv.width,cv.height);sF.forEach(f=>{ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,Math.PI*2);ctx.fillStyle=`rgba(215,230,255,${f.op})`;ctx.fill();f.y+=f.sp;f.x+=f.dr;if(f.y>cv.height){f.y=-4;f.x=Math.random()*cv.width;}if(f.x>cv.width)f.x=0;if(f.x<0)f.x=cv.width;});sAF=requestAnimationFrame(draw);};draw();}
function stopSnow(){if(sAF){cancelAnimationFrame(sAF);sAF=null;}}
function startLt(){stopLt();const el=document.getElementById('lightning');const flash=()=>{el.style.opacity='1';setTimeout(()=>{el.style.opacity='0';},75);setTimeout(()=>{el.style.opacity='.5';},120);setTimeout(()=>{el.style.opacity='0';},190);ltTimer=setTimeout(flash,2800+Math.random()*5000);};ltTimer=setTimeout(flash,800+Math.random()*2500);}
function stopLt(){if(ltTimer){clearTimeout(ltTimer);ltTimer=null;}document.getElementById('lightning').style.opacity='0';}

/* ── API ── */
async function wxFetch(lat,lon){
  const k=`${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const c=wxCache[k];if(c&&Date.now()-c.ts<600000)return c.data;
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index,visibility&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=10`;
  const res=await fetch(url);if(!res.ok)throw new Error();
  const data=await res.json();
  // Also fetch AQI
  try{
    const aqiUrl=`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi&timezone=auto`;
    const aqiRes=await fetch(aqiUrl);if(aqiRes.ok){const aqiData=await aqiRes.json();data._aqi=aqiData.current?.european_aqi??null;}
  }catch{}
  // Historical climate normals (Open-Meteo archive)
  try{
    const today=new Date();
    const yr=today.getFullYear()-1;
    const mm=String(today.getMonth()+1).padStart(2,'0');
    const dd=String(today.getDate()).padStart(2,'0');
    const histUrl=`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${yr}-${mm}-${dd}&end_date=${yr}-${mm}-${dd}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    const hr=await fetch(histUrl);if(hr.ok){const hd=await hr.json();data._hist=hd.daily;}
  }catch{}
  data._fetchedAt=Date.now();
  wxCache[k]={ts:Date.now(),data};
  try{localStorage.setItem('wx4_c2',JSON.stringify(wxCache));}catch{}
  return data;
}
async function geo(q){const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en`);const d=await r.json();return d.results||[];}

/* ── SLIDE BUILDER ── */

/* ── FEELS LIKE REASON ── */
function feelsReason(actual, apparent, windKph, humidity){
  const diff=apparent-actual;
  if(windKph>20&&diff<-2)return`Feels ${Math.abs(Math.round(diff))}° colder due to ${Math.round(windKph)} km/h winds`;
  if(humidity>75&&diff>2)return`Feels ${Math.round(diff)}° warmer due to high humidity (${humidity}%)`;
  if(diff<-4)return`Wind chill makes it feel significantly colder`;
  if(diff>3)return`Humidity is making it feel warmer`;
  return`Similar to the actual temperature`;
}
function comfortPct(tempC){
  // 18-22°C = 100% comfort. Map to 0-100
  if(tempC<=0)return 5;
  if(tempC>=38)return 95;
  const ideal=20;
  return Math.round(Math.max(5,Math.min(95,50+((tempC-ideal)/ideal)*40)));
}

/* ── LAST UPDATED LABEL ── */
function updatedLabel(ts){
  if(!ts)return{txt:'Fetching…',stale:false};
  const mins=Math.round((Date.now()-ts)/60000);
  const stale=mins>15;
  const txt=mins<1?'Updated just now':mins===1?'Updated 1 min ago':`Updated ${mins} min ago`;
  return{txt,stale};
}

/* ── HISTORY CARD ── */
function buildHistory(data){
  if(!data._hist||!data._hist.temperature_2m_max)return'';
  const avgHi=data._hist.temperature_2m_max[0];
  const avgLo=data._hist.temperature_2m_min[0];
  const todayHi=data.daily.temperature_2m_max[0];
  const todayLo=data.daily.temperature_2m_min[0];
  if(avgHi==null)return'';
  const hiDiff=Math.round(todayHi-avgHi);
  const hiCls=hiDiff>1?'warm':hiDiff<-1?'cool':'normal';
  const hiLbl=hiDiff>1?`+${hiDiff}° above avg`:hiDiff<-1?`${hiDiff}° below avg`:'Near average';
  const hiDesc=hiDiff>1?`Warmer than usual. Avg high for today is ${Math.round(avgHi)}°.`
    :hiDiff<-1?`Cooler than usual. Avg high for today is ${Math.round(avgHi)}°.`
    :`Close to the typical high of ${Math.round(avgHi)}° for this time of year.`;
  const precip=data.daily.precipitation_sum?.[0]??0;
  const avgPrecip=data._hist.precipitation_sum?.[0]??0;
  const precipDiff=precip-avgPrecip;
  const precipCls=precipDiff>1?'cool':precipDiff<-0.5?'warm':'normal';
  const precipLbl=precipDiff>1?'Wetter':'Drier';
  const precipDesc=precipDiff>1?`More rain than average (avg ${avgPrecip.toFixed(1)}mm).`
    :`Less rain than the typical ${avgPrecip.toFixed(1)}mm for this date.`;
  return`<div class="card"><div class="clabel">📊 Historical Context</div>
    <div class="hist-body">
      <div class="hist-row">
        <div class="hist-badge ${hiCls}"><div class="hist-badge-t">${hiLbl}</div></div>
        <div class="hist-desc">${hiDesc}</div>
      </div>
      <div class="hist-row">
        <div class="hist-badge ${precipCls}"><div class="hist-badge-t">${precipLbl}</div></div>
        <div class="hist-desc">${precipDesc}</div>
      </div>
    </div>
  </div>`;
}

/* ── DAILY GRAPH ── */
function buildGraph(daily, unit){
  const aHi=daily.temperature_2m_max||[];
  const aLo=daily.temperature_2m_min||[];
  const days=(daily.time||[]).slice(0,7);
  if(!days.length)return'';
  const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const allVals=[...aHi,...aLo].filter(v=>v!=null);
  const vMin=Math.min(...allVals)-2, vMax=Math.max(...allVals)+2;
  const vRange=vMax-vMin||1;
  const W=300, H=70, PAD=20, bw=(W-PAD*2)/Math.max(days.length-1,1);
  const yOf=v=>((vMax-v)/vRange*(H-14)+7).toFixed(1);
  const xOf=i=>(PAD+i*bw).toFixed(1);
  const hiPts=aHi.slice(0,7).map((v,i)=>`${xOf(i)},${yOf(v)}`).join(' ');
  const loPts=aLo.slice(0,7).map((v,i)=>`${xOf(i)},${yOf(v)}`).join(' ');
  const hiDots=aHi.slice(0,7).map((v,i)=>`<circle cx="${xOf(i)}" cy="${yOf(v)}" r="3" fill="#f97316"/>`).join('');
  const loDots=aLo.slice(0,7).map((v,i)=>`<circle cx="${xOf(i)}" cy="${yOf(v)}" r="3" fill="#60a5fa"/>`).join('');
  const labels=days.map((t,i)=>{
    const d=new Date(t+'T12:00:00');
    const lbl=i===0?'Today':DAYS[d.getDay()];
    return`<text x="${xOf(i)}" y="${H+10}" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.38)" font-family="-apple-system,sans-serif">${lbl}</text>`;
  }).join('');
  const hiLabels=aHi.slice(0,7).map((v,i)=>{
    const disp=unit==='F'?Math.round(v*9/5+32):Math.round(v);
    return`<text x="${xOf(i)}" y="${(parseFloat(yOf(v))-5).toFixed(1)}" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.6)" font-family="-apple-system,sans-serif">${disp}°</text>`;
  }).join('');
  return`<div class="card"><div class="clabel">📈 7-Day Temperature</div>
    <div class="graph-card-body">
      <svg width="100%" viewBox="0 0 ${W} ${H+16}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
        <polyline points="${hiPts}" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="${loPts}" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        ${hiDots}${loDots}${labels}${hiLabels}
      </svg>
      <div class="graph-legend">
        <div class="gl-item"><div class="gl-line" style="background:#f97316"></div>High</div>
        <div class="gl-item"><div class="gl-line" style="background:#60a5fa"></div>Low</div>
      </div>
    </div>
  </div>`;
}

function buildSlide(p,data){
  const c=data.current,w=gW(c.weather_code),u=unit;
  const tC=Math.round(c.temperature_2m),tF=cF(c.temperature_2m);
  const disp=u==='C'?tC:tF;
  const hiC=fmt(data.daily.temperature_2m_max[0],u),loC=fmt(data.daily.temperature_2m_min[0],u);
  const dirs=['N','NE','E','SE','S','SW','W','NW'];
  const wDir=dirs[Math.round(c.wind_direction_10m/45)%8];
  const uv=data.daily.uv_index_max?.[0]??c.uv_index??0;
  const uvL=uv<=2?'Low':uv<=5?'Moderate':uv<=7?'High':uv<=10?'Very High':'Extreme';
  const fDisp=fmt(c.apparent_temperature,u);
  const fDesc=fDisp<disp-2?'Feels colder':fDisp>disp+2?'Feels warmer':'Feels similar';

  // Summary
  const summary=buildSummary(data);

  // Sunrise/sunset
  const sunrise=data.daily.sunrise?.[0];
  const sunset=data.daily.sunset?.[0];
  const srTime=fmtTime(sunrise);
  const ssTime=fmtTime(sunset);
  // Arc position (0-1) based on current time
  let arcPct=0.5;
  if(sunrise&&sunset){
    const srMs=new Date(sunrise).getTime();
    const ssMs=new Date(sunset).getTime();
    const nowMs=Date.now();
    arcPct=Math.max(0,Math.min(1,(nowMs-srMs)/(ssMs-srMs)));
  }
  const arcRad=arcPct*Math.PI;
  const arcX=(30+arcRad/Math.PI*240).toFixed(1);
  const arcY=(60-Math.sin(arcRad)*50).toFixed(1);

  // Hourly
  const now=new Date();
  const hStart=data.hourly.time.findIndex(t=>new Date(t)>=now);
  const hT=data.hourly.time.slice(hStart,hStart+24);
  const hTmp=data.hourly.temperature_2m.slice(hStart,hStart+24);
  const hCd=data.hourly.weather_code.slice(hStart,hStart+24);
  const hPop=data.hourly.precipitation_probability.slice(hStart,hStart+24);
  const hWind=(data.hourly.wind_speed_10m||[]).slice(hStart,hStart+24);
  const hourHTML=hT.map((t,i)=>{const wh=gW(hCd[i]);const main=fmt(hTmp[i],u);const alt=u==='C'?cF(hTmp[i]):Math.round(hTmp[i]);const ws=Math.round(hWind[i]||0);const wStrong=ws>=30;return`<div class="hc${i===0?' now':''}"><div class="ht">${i===0?'Now':hLbl(t)}</div>${hPop[i]>15?`<div class="hpop">${hPop[i]}%</div>`:`<div class="hpop" style="visibility:hidden">0</div>`}<div class="hi-e">${wh.i}</div><div class="htemp">${main}°</div><div class="htempsub">${alt}${u==='C'?'°F':'°C'}</div>${ws?`<div class="hwind${wStrong?' strong':''}">${ws}km/h</div>`:''}</div>`;}).join('');

  // Daily
  const aHi=data.daily.temperature_2m_max||[],aLo=data.daily.temperature_2m_min||[];
  const aMax=aHi.length?Math.max(...aHi):1,aMin=aLo.length?Math.min(...aLo):0;
  const tempRange=aMax-aMin||1;
  const dayHTML=(data.daily.time||[]).map((t,i)=>{const wd=gW(data.daily.weather_code[i]);const hi=fmt(aHi[i],u),lo=fmt(aLo[i],u);const left=((aLo[i]-aMin)/tempRange*100).toFixed(1);const wide=Math.max((aHi[i]-aLo[i])/tempRange*100,8).toFixed(1);return`<div class="di"><div class="di-d">${dayN(t,i)}</div><div class="di-i">${wd.i}</div><div class="di-c">${wd.l}</div><div class="di-t"><span class="di-lo">${lo}°</span><div class="di-bar"><div class="di-fill" style="margin-left:${left}%;width:${wide}%"></div></div><span class="di-hi">${hi}°</span></div></div>`;}).join('');

  // AQI
  let aqiHTML='';
  if(data._aqi!=null){
    const ai=aqiInfo(data._aqi);
    const pct=Math.min(100,data._aqi/500*100).toFixed(1);
    aqiHTML=`<div class="card"><div class="clabel">🌬 Air Quality</div>
      <div class="aqi-row">
        <div class="aqi-circle" style="background:${ai.color}22;border:2px solid ${ai.color}55">
          <div class="aqi-num" style="color:${ai.color}">${data._aqi}</div>
          <div class="aqi-unit" style="color:${ai.color}">AQI</div>
        </div>
        <div class="aqi-info">
          <div class="aqi-label">${ai.label}</div>
          <div class="aqi-desc">${ai.desc}</div>
        </div>
      </div>
      <div class="aqi-bar-wrap">
        <div class="aqi-bar-outer"><div class="aqi-pointer" style="left:${pct}%"></div></div>
      </div>
    </div>`;
  }

  // Moon phase
  const mp=moonPhase(new Date());
  const moonHTML=`<div class="card"><div class="clabel">🌙 Moon Phase</div>
    <div class="moon-card-body">
      <div class="moon-icon-wrap">${mp.icon}</div>
      <div class="moon-info">
        <div class="moon-phase-name">${mp.name}</div>
        <div class="moon-illum">${mp.illum}% illuminated</div>
        <div class="moon-next">${mp.daysToFull===0?'Full moon tonight':`Full moon in ${mp.daysToFull} day${mp.daysToFull===1?'':'s'}`}</div>
      </div>
    </div>
  </div>`;

  // Other cities
  const others=places.filter((_,i)=>i!==idx).filter(p=>p._data);
  const chipsHTML=others.map(op=>{const od=op._data.current,ow=gW(od.weather_code);const ot=fmt(od.temperature_2m,u);const oAlt=u==='C'?cF(od.temperature_2m):Math.round(od.temperature_2m);const oIdx=places.indexOf(op);return`<div class="chip" data-idx="${oIdx}"><div class="chip-name">${op.name}</div><div class="chip-cond">${ow.i} ${ow.l}</div><div class="chip-temp">${ot}°</div><div class="chip-alt">${oAlt}${u==='C'?'°F':'°C'}</div></div>`;}).join('');

  return`<div class="fadein">
    <div class="topbar">
      <div class="tb-icon" id="menuBtn">☰</div>
      <div class="topbar-right">
        <div class="tb-icon" id="themeToggle">${mode==='dark'?'☀️':'🌙'}</div>
      </div>
    </div>
    <div class="hero">
      <div class="city-name">${p.name}</div>
      <div class="city-sub">${p.isDefault?'Default · ':''}${p.region||p.country||''}</div>
      <div class="temp-row">
        <div class="temp-big">${disp}°</div>
        <div class="dual-stack">
          <div class="dp${u==='C'?' active':''}" data-u="C"><span>${tC}°</span><span class="ul">C</span></div>
          <div class="dp${u==='F'?' active':''}" data-u="F"><span>${tF}°</span><span class="ul">F</span></div>
        </div>
      </div>
      <div class="cond-line"><span class="ci">${w.i}</span><span>${w.l}</span></div>
      <div class="hilow">H: ${hiC}°  ·  L: ${loC}°</div>
    </div>

    <div class="summary">${summary}</div>

    <div class="updated-bar">
      <span class="updated-txt" id="updTxt-${p.id||idx}">Updated just now</span>
      <div class="updated-dot${data._fetchedAt&&(Date.now()-data._fetchedAt)>900000?' stale':''}" ></div>
    </div>

    <div class="card" style="margin-top:10px">
      <div class="clabel">🌡 Feels Like</div>
      <div class="feels-card-body">
        <div class="feels-big">${fDisp}°</div>
        <div class="feels-right">
          <div class="feels-reason">${feelsReason(c.temperature_2m,c.apparent_temperature,c.wind_speed_10m,c.relative_humidity_2m)}</div>
          <div class="feels-comfort-wrap">
            <div class="feels-track"><div class="feels-fill" style="width:${comfortPct(c.apparent_temperature)}%"></div></div>
            <div class="feels-labels"><span class="feels-lbl">Very cold</span><span class="feels-lbl">Comfortable</span><span class="feels-lbl">Very hot</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:10px">
      <div class="stats">
        <div class="stat"><div class="s-ic">💧</div><div class="s-v">${c.relative_humidity_2m}%</div><div class="s-l">Humidity</div></div>
        <div class="stat"><div class="s-ic">💨</div><div class="s-v">${Math.round(c.wind_speed_10m)}</div><div class="s-l">km/h ${wDir}</div></div>
        <div class="stat"><div class="s-ic">🌡</div><div class="s-v">${fDisp}°</div><div class="s-l">Feels like</div></div>
        <div class="stat"><div class="s-ic">☀️</div><div class="s-v">${Math.round(uv)}</div><div class="s-l">${uvL} UV</div></div>
        <div class="stat"><div class="s-ic">🌊</div><div class="s-v">${Math.round(c.surface_pressure)}</div><div class="s-l">hPa</div></div>
        <div class="stat"><div class="s-ic">🌧</div><div class="s-v">${c.precipitation}</div><div class="s-l">mm/hr</div></div>
      </div>
    </div>

    <div class="card">
      <div class="clabel">🌅 Sunrise & Sunset</div>
      <div class="sun-arc-wrap">
        <div class="sun-progress"><div class="sun-progress-fill" style="width:${(arcPct*100).toFixed(1)}%"></div></div>
      </div>
      <div class="sun-row">
        <div class="sun-item"><div class="sun-ic">🌅</div><div class="sun-time">${srTime}</div><div class="sun-lbl">Sunrise</div></div>
        <div class="sun-divider"></div>
        <div class="sun-item"><div class="sun-ic">🌇</div><div class="sun-time">${ssTime}</div><div class="sun-lbl">Sunset</div></div>
      </div>
    </div>

    <div class="card">
      <div class="clabel">🕐 Hourly Forecast</div>
      <div class="hscroll"><div class="hrow">${hourHTML}</div></div>
    </div>

    <div class="card">
      <div class="clabel">📅 10-Day Forecast</div>
      ${dayHTML}
    </div>

    ${buildGraph(data.daily,unit)}
    ${buildHistory(data)}
    ${aqiHTML}
    ${moonHTML}

    <div class="card">
      <div class="sheet-hint" id="sheetHint" onclick="toggleSheet()">
        <div class="sheet-handle"></div>
        <span class="sheet-lbl">more details</span>
      </div>
      <div id="detail-sheet">
        <div class="detail-grid">
          <div class="dg-cell"><div class="dg-ic">👁</div><div class="dg-val">${c.visibility!=null?Math.round(c.visibility/1000)+' km':'—'}</div><div class="dg-lbl">Visibility</div></div>
          <div class="dg-cell"><div class="dg-ic">🌊</div><div class="dg-val">${Math.round(c.surface_pressure)} hPa</div><div class="dg-lbl">Pressure</div></div>
          <div class="dg-cell"><div class="dg-ic">💨</div><div class="dg-val">${Math.round(c.wind_speed_10m)} km/h</div><div class="dg-lbl">Wind ${dirs[Math.round(c.wind_direction_10m/45)%8]}</div></div>
          <div class="dg-cell"><div class="dg-ic">💧</div><div class="dg-val">${c.relative_humidity_2m}%</div><div class="dg-lbl">Humidity</div></div>
          <div class="dg-cell"><div class="dg-ic">🌧</div><div class="dg-val">${c.precipitation} mm</div><div class="dg-lbl">Precip/hr</div></div>
          <div class="dg-cell"><div class="dg-ic">☀️</div><div class="dg-val">${Math.round(uv)}</div><div class="dg-lbl">${uvL} UV</div></div>
        </div>
      </div>
    </div>

    <div class="oc-section">
      <div class="oc-head">
        <div class="oc-title">Other Cities</div>
        <div class="oc-add" id="ocAdd">+</div>
      </div>
      ${others.length?`<div class="oc-chips">${chipsHTML}</div>`:`<div style="font-size:13px;color:var(--tx3);padding:4px 0">Tap + to add cities</div>`}
    </div>
    <div style="height:6px"></div>
  </div>`;
}

/* ── DECK ── */
const deck=document.getElementById('deck'),dotsEl=document.getElementById('dots');
function rebuildDeck(){
  deck.innerHTML='';dotsEl.innerHTML='';
  places.forEach((p,i)=>{
    const s=document.createElement('div');s.className='slide';s.id=`s${i}`;
    s.innerHTML=`<div class="ptr-wrap"><div class="ptr-inner"><div class="ptr-arrow"></div><span>Release to refresh</span></div></div><div class="lscreen"><div class="spin"></div><div style="font-size:13px;margin-top:8px">${p.name}</div></div>`;
    deck.appendChild(s);
    const d=document.createElement('div');d.className=`dot${p.isDefault?' ml':''}${i===idx?' active':''}`;
    d.addEventListener('click',()=>goTo(i));dotsEl.appendChild(d);
  });
  goTo(idx,false);places.forEach((p,i)=>loadSlide(p,i));
}
async function loadSlide(p,i){
  const s=document.getElementById(`s${i}`);if(!s)return;
  try{const data=await wxFetch(p.lat,p.lon);p._data=data;s.innerHTML=buildSlide(p,data);attachEv(s);if(i===idx)applyScene(data.current.weather_code);}
  catch{s.innerHTML=`<div class="lscreen" style="color:rgba(255,100,100,0.7)">⚠️ Failed<br>${p.name}</div>`;}
}
function attachEv(s){
  s.querySelectorAll('.dp').forEach(b=>b.addEventListener('click',()=>{unit=b.dataset.u;localStorage.setItem('wx4_u',unit);syncUnit();reRender();}));
  s.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>goTo(Number(c.dataset.idx))));
  const mb=s.querySelector('#menuBtn');if(mb)mb.addEventListener('click',openList);
  const tt=s.querySelector('#themeToggle');if(tt)tt.addEventListener('click',toggleTheme);
  const oc=s.querySelector('#ocAdd');if(oc)oc.addEventListener('click',openList);
}
function reRender(){const p=places[idx];if(!p||!p._data)return;const s=document.getElementById(`s${idx}`);s.innerHTML=buildSlide(p,p._data);attachEv(s);}
function goTo(i,anim=true){
  idx=Math.max(0,Math.min(i,places.length-1));
  deck.style.transition=anim?'transform .42s cubic-bezier(.4,0,.2,1)':'none';
  deck.style.transform=`translateX(-${idx*100}vw)`;
  dotsEl.querySelectorAll('.dot').forEach((d,j)=>d.classList.toggle('active',j===idx));
  const p=places[idx];if(p&&p._data)applyScene(p._data.current.weather_code);
}

/* ── SWIPE (smarter detection) ── */
(()=>{
  let startX=0,startY=0,dx=0,dy=0,direction=null,dragging=false;
  const THRESHOLD=55; // px to trigger a page change
  const SLIDE_LOCK=6; // minimal movement to decide direction
  deck.addEventListener('touchstart',e=>{
    startX=e.touches[0].clientX;startY=e.touches[0].clientY;dx=0;dy=0;direction=null;dragging=false;deck.style.transition='none';
  },{passive:true});
  deck.addEventListener('touchmove',e=>{
    const cx=e.touches[0].clientX, cy=e.touches[0].clientY;
    dx=cx-startX; dy=cy-startY;
    if(!direction){
      // wait until enough movement to determine intent
      if(Math.abs(dx)<SLIDE_LOCK && Math.abs(dy)<SLIDE_LOCK) return;
      direction = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      if(direction==='vertical'){
        // let native vertical scroll handle it — reset any transform so deck stays in place
        deck.style.transform = `translateX(-${idx*100}vw)`;
        return;
      } else {
        dragging = true;
      }
    }
    if(direction==='horizontal' && dragging){
      // translate deck with finger
      deck.style.transform = `translateX(calc(-${idx*100}vw + ${dx}px))`;
    }
  },{passive:true});
  deck.addEventListener('touchend',e=>{
    if(!dragging) return; // vertical scroll or no intent
    // commit
    deck.style.transition='transform .42s cubic-bezier(.4,0,.2,1)';
    if(dx<-THRESHOLD) goTo(idx+1);
    else if(dx>THRESHOLD) goTo(idx-1);
    else goTo(idx);
    dragging=false; direction=null;
  });
})();

/* ── THEME ── */
function applyMode(m){
  mode=m;
  document.documentElement.setAttribute('data-mode',m);
  document.getElementById('themeColor').content=m==='dark'?'#0a0a0f':'#88c8f0';
  document.body.style.background=m==='dark'?'#0a0a0f':'#88c8f0';
  localStorage.setItem('wx4_m',m);
  document.getElementById('themeBtn').textContent=m==='dark'?'☀️ Light':'🌙 Dark';
  syncUnit();
  const p=places[idx];if(p&&p._data)applyScene(p._data.current.weather_code);
  reRender();
}
function toggleTheme(){applyMode(mode==='dark'?'light':'dark');}
document.getElementById('themeBtn').addEventListener('click',toggleTheme);

/* ── LIST ── */
function openList(){editing=false;document.getElementById('edBtn').textContent='Edit';renderList();document.getElementById('lv').classList.add('open');syncUnit();}
function closeList(){document.getElementById('lv').classList.remove('open');rebuildDeck();}
document.getElementById('listBtn').addEventListener('click',openList);
document.getElementById('lvDone').addEventListener('click',closeList);
function renderList(){
  const container=document.getElementById('plist');container.innerHTML='';
  places.forEach((p,i)=>{
    const[g1,g2]=GRADS[i%GRADS.length];
    const data=p._data;
    const tC=data?Math.round(data.current.temperature_2m):null;
    const tF=tC!==null?cF(tC):null;
    const disp=tC!==null?(unit==='C'?tC:tF):'—';
    const alt=tC!==null?(unit==='C'?tF:tC):'';
    const altU=unit==='C'?'°F':'°C';
    const cond=data?gW(data.current.weather_code):{l:'Loading…',i:''};
    const hi=data?fmt(data.daily.temperature_2m_max[0],unit):'';
    const lo=data?fmt(data.daily.temperature_2m_min[0],unit):'';
    const card=document.createElement('div');
    card.className=`pc${editing?' editing':''}`;
    card.innerHTML=`<div class="pc-bg" style="background:linear-gradient(135deg,${g1},${g2})"></div><div class="pc-body"><div class="pc-l"><div class="pc-city">${p.name}</div><div class="pc-reg">${p.isDefault?'Default · ':''}${p.region||p.country||''}</div><div class="pc-cnd">${cond.i} ${cond.l}</div></div><div class="pc-r"><div class="pc-t">${disp}°</div>${tC!==null?`<div class="pc-b">${alt}${altU} · H:${hi}° L:${lo}°</div>`:''}</div></div>${!p.isDefault?`<div class="pc-del" data-i="${i}">✕</div>`:''}`;
    card.addEventListener('click',e=>{if(e.target.classList.contains('pc-del'))return;idx=i;closeList();});
    const del=card.querySelector('.pc-del');if(del)del.addEventListener('click',e=>{e.stopPropagation();places.splice(i,1);savP();if(idx>=places.length)idx=places.length-1;renderList();});
    container.appendChild(card);
  });
}
document.getElementById('edBtn').addEventListener('click',()=>{editing=!editing;document.getElementById('edBtn').textContent=editing?'Done':'Edit';renderList();});
function savP(){localStorage.setItem('wx4_p',JSON.stringify(places.map(p=>({id:p.id,name:p.name,region:p.region,country:p.country,lat:p.lat,lon:p.lon,isDefault:p.isDefault}))));}

/* ── SEARCH ── */
let sT;
const si=document.getElementById('si'),sres=document.getElementById('sres');
si.addEventListener('input',()=>{clearTimeout(sT);const q=si.value.trim();if(q.length<2){sres.style.display='none';return;}sres.style.display='block';sres.innerHTML='<div style="padding:13px 16px"><span class="spin"></span></div>';sT=setTimeout(async()=>{try{const rs=await geo(q);if(!rs.length){sres.innerHTML='<div style="padding:13px 16px;color:var(--tx3)">No results</div>';return;}sres.innerHTML=rs.map((r,i)=>`<div class="sri" data-i="${i}"><div class="sri-n">${r.name}${r.admin1?', '+r.admin1:''}</div><div class="sri-r">${r.country||''}</div></div>`).join('');sres.querySelectorAll('.sri').forEach((el,i)=>el.addEventListener('click',()=>addP(rs[i])));}catch{sres.innerHTML='<div style="padding:13px 16px;color:var(--tx3)">Search failed</div>';}},380);});
async function addP(r){if(places.find(p=>Math.abs(p.lat-r.latitude)<.05&&Math.abs(p.lon-r.longitude)<.05)){si.value='';sres.style.display='none';return;}const np={id:`${r.name}-${Date.now()}`,name:r.name,region:r.admin1||'',country:r.country_code||'',lat:r.latitude,lon:r.longitude};places.push(np);savP();si.value='';sres.style.display='none';try{const d=await wxFetch(np.lat,np.lon);np._data=d;}catch{}renderList();}

/* ── UNIT + GPS ── */
function syncUnit(){document.getElementById('gC').classList.toggle('active',unit==='C');document.getElementById('gF').classList.toggle('active',unit==='F');}
document.getElementById('gC').addEventListener('click',()=>{unit='C';localStorage.setItem('wx4_u','C');syncUnit();renderList();reRender();});
document.getElementById('gF').addEventListener('click',()=>{unit='F';localStorage.setItem('wx4_u','F');syncUnit();renderList();reRender();});
document.getElementById('locBtn').addEventListener('click',()=>{if(!navigator.geolocation)return;navigator.geolocation.getCurrentPosition(async pos=>{const{latitude:lat,longitude:lon}=pos.coords;try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);const d=await r.json();const city=d.address.city||d.address.town||d.address.village||'My Location';const country=d.address.country_code?.toUpperCase()||'';if(!places.find(p=>Math.abs(p.lat-lat)<.1&&Math.abs(p.lon-lon)<.1)){const np={id:'gps',name:city,region:d.address.state||'',country,lat,lon};places.unshift(np);savP();idx=0;rebuildDeck();}}catch{}});});


/* ── SHEET TOGGLE ── */
function toggleSheet(){
  const sheet=document.getElementById('detail-sheet');
  const hint=document.getElementById('sheetHint');
  if(!sheet)return;
  const open=sheet.classList.toggle('open');
  if(hint){const lbl=hint.querySelector('.sheet-lbl');if(lbl)lbl.textContent=open?'less details':'more details';}
}

/* ── PULL TO REFRESH ── */
(function(){
  let startY=0,pulling=false,released=false;
  const THRESHOLD=70;
  function getSlide(){return document.getElementById('s'+idx);}
  document.addEventListener('touchstart',e=>{
    const sl=getSlide();if(!sl)return;
    if(sl.scrollTop===0){startY=e.touches[0].clientY;pulling=true;released=false;}
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    if(!pulling)return;
    const sl=getSlide();if(!sl)return;
    const dy=e.touches[0].clientY-startY;
    if(dy<0){pulling=false;return;}
    const ptr=sl.querySelector('.ptr-wrap');if(!ptr)return;
    const arrow=sl.querySelector('.ptr-arrow');
    if(dy>20){ptr.classList.add('showing');}
    if(arrow){arrow.classList.toggle('ready',dy>THRESHOLD);}
  },{passive:true});
  document.addEventListener('touchend',e=>{
    if(!pulling)return;pulling=false;
    const sl=getSlide();if(!sl)return;
    const ptr=sl.querySelector('.ptr-wrap');if(ptr)ptr.classList.remove('showing');
    const arrow=sl.querySelector('.ptr-arrow');
    const dy=e.changedTouches[0].clientY-startY;
    if(dy>THRESHOLD&&!released){
      released=true;
      const p=places[idx];if(!p)return;
      const k=`${p.lat.toFixed(2)}_${p.lon.toFixed(2)}`;
      delete wxCache[k];
      try{localStorage.setItem('wx4_c2',JSON.stringify(wxCache));}catch{}
      loadSlide(p,idx);
      showToast('🔄 Refreshing…');
    }
  },{passive:true});
})();

/* ── UPDATE TIMESTAMPS ── */
function updateTimestamps(){
  places.forEach((p,i)=>{
    const el=document.getElementById('updTxt-'+(p.id||i));
    if(!el||!p._data)return;
    const{txt,stale}=updatedLabel(p._data._fetchedAt);
    el.textContent=txt;
    const dot=el.nextElementSibling;
    if(dot){dot.classList.toggle('stale',stale);}
  });
}
setInterval(updateTimestamps,60000);

/* ── INIT ── */
applyMode(mode);
syncUnit();
rebuildDeck();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

