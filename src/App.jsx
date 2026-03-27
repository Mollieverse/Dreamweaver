import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  bg1: "#0f0c29", bg2: "#1a1050", bg3: "#2d1b69",
  gold: "#FBBF24", pink: "#F9A8D4", lavender: "#C4B5FD",
  indigo: "#6366F1", purple: "#7C3AED",
  text: "#F1F0FF", textMuted: "rgba(241,240,255,0.55)",
};

const ANIMALS = [
  {e:"🐻",n:"Bear"},{e:"🦁",n:"Lion"},{e:"🐰",n:"Bunny"},{e:"🦊",n:"Fox"},
  {e:"🐼",n:"Panda"},{e:"🦄",n:"Unicorn"},{e:"🐉",n:"Dragon"},{e:"🦉",n:"Owl"},
  {e:"🐬",n:"Dolphin"},{e:"🦋",n:"Butterfly"},{e:"🐸",n:"Frog"},{e:"🦒",n:"Giraffe"},
];
const THEMES = [
  {id:"adventure",e:"⚔️"},{id:"friendship",e:"🤝"},{id:"magic",e:"✨"},
  {id:"courage",e:"🦸"},{id:"kindness",e:"💛"},{id:"discovery",e:"🔭"},
  {id:"nature",e:"🌿"},{id:"space",e:"🚀"},
];
const SOUNDS = [{id:"rain",e:"🌧️",label:"Rain"},{id:"forest",e:"🌲",label:"Forest"},{id:"ocean",e:"🌊",label:"Ocean"}];

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: 'Nunito', sans-serif; background: #0f0c29; overflow-x: hidden; }
  input, button { font-family: 'Nunito', sans-serif; border: none; outline: none; cursor: pointer; }
  input { cursor: text; }
  .playfair { font-family: 'Playfair Display', Georgia, serif; }
  @keyframes twinkle { 0%,100%{opacity:0.15;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
  @keyframes drift { 0%{transform:translateY(0px) translateX(0px)} 33%{transform:translateY(-12px) translateX(6px)} 66%{transform:translateY(6px) translateX(-8px)} 100%{transform:translateY(0px) translateX(0px)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulseGlow { 0%,100%{box-shadow:0 0 30px 8px rgba(251,191,36,0.3),0 0 60px 16px rgba(251,191,36,0.1)} 50%{box-shadow:0 0 50px 16px rgba(251,191,36,0.55),0 0 90px 30px rgba(251,191,36,0.2)} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes wave { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
  @keyframes moonFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
  @keyframes btnPulse { 0%,100%{box-shadow:0 0 40px rgba(251,191,36,0.5),0 8px 32px rgba(0,0,0,0.4)} 50%{box-shadow:0 0 70px rgba(251,191,36,0.8),0 8px 40px rgba(0,0,0,0.5)} }
  .fade-up-1{animation:fadeSlideUp 0.5s 0.05s ease forwards;opacity:0}
  .fade-up-2{animation:fadeSlideUp 0.5s 0.12s ease forwards;opacity:0}
  .fade-up-3{animation:fadeSlideUp 0.5s 0.20s ease forwards;opacity:0}
  .fade-up-4{animation:fadeSlideUp 0.5s 0.28s ease forwards;opacity:0}
  .fade-up-5{animation:fadeSlideUp 0.5s 0.36s ease forwards;opacity:0}
  .fade-up-6{animation:fadeSlideUp 0.5s 0.44s ease forwards;opacity:0}
  .btn-press:active{transform:scale(0.93)!important}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:4px}
`;

function Stars() {
  const stars = useRef(Array.from({length:100},(_,i)=>({
    id:i,x:Math.random()*100,y:Math.random()*100,
    s:0.8+Math.random()*2.2,delay:Math.random()*6,dur:2+Math.random()*4,
  }))).current;
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      {stars.map(s=>(
        <div key={s.id} style={{
          position:"absolute",left:`${s.x}%`,top:`${s.y}%`,
          width:s.s,height:s.s,borderRadius:"50%",background:"white",
          animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
        }}/>
      ))}
    </div>
  );
}

function Orbs() {
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      {[
        {w:280,h:280,top:"5%",left:"-10%",c:"rgba(99,102,241,0.18)",dur:"18s",delay:"0s"},
        {w:200,h:200,top:"60%",right:"-8%",left:"auto",c:"rgba(196,181,253,0.14)",dur:"22s",delay:"3s"},
        {w:150,h:150,top:"35%",left:"60%",c:"rgba(249,168,212,0.12)",dur:"15s",delay:"6s"},
      ].map((o,i)=>(
        <div key={i} style={{
          position:"absolute",width:o.w,height:o.h,borderRadius:"50%",
          background:`radial-gradient(circle,${o.c},transparent 70%)`,
          top:o.top,left:o.left,right:o.right,
          animation:`drift ${o.dur} ${o.delay} ease-in-out infinite`,
        }}/>
      ))}
    </div>
  );
}

function GlassCard({children,style={}}) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.07)",
      backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
      border:"1px solid rgba(255,255,255,0.13)",
      borderRadius:24,padding:"20px 18px",
      boxShadow:"0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.1)",
      ...style
    }}>
      {children}
    </div>
  );
}

function GlassInput({value,onChange,placeholder,type="text"}) {
  const [focused,setFocused]=useState(false);
  return (
    <input value={value} onChange={onChange} placeholder={placeholder} type={type}
      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
      style={{
        width:"100%",padding:"14px 18px",borderRadius:16,
        background:focused?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.07)",
        border:`1px solid ${focused?"rgba(196,181,253,0.7)":"rgba(255,255,255,0.13)"}`,
        color:"#F1F0FF",fontSize:16,transition:"all 0.2s",
        boxShadow:focused?"0 0 0 3px rgba(196,181,253,0.15)":"none",
      }}/>
  );
}

function Waveform({playing}) {
  const bars = Array.from({length:28},(_,i)=>i);
  return (
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:3,height:40}}>
      {bars.map(i=>(
        <div key={i} style={{
          width:3,borderRadius:3,
          background:playing?"linear-gradient(to top,#FBBF24,#F9A8D4)":"rgba(255,255,255,0.2)",
          height:playing?`${25+Math.random()*75}%`:"20%",
          animation:playing?`wave ${0.4+Math.random()*0.6}s ${i*0.04}s ease-in-out infinite`:"none",
          transition:"height 0.3s ease,background 0.3s ease",
        }}/>
      ))}
    </div>
  );
}

function SleepTimer({onStop}) {
  const [left,setLeft]=useState(null);
  const [sel,setSel]=useState(null);
  const ref=useRef(null);
  const start=(m)=>{
    setSel(m);setLeft(m*60);clearInterval(ref.current);
    ref.current=setInterval(()=>{
      setLeft(l=>{if(l<=1){clearInterval(ref.current);onStop();return 0;}return l-1;});
    },1000);
  };
  useEffect(()=>()=>clearInterval(ref.current),[]);
  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  return (
    <div style={{textAlign:"center"}}>
      <p style={{color:C.textMuted,fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>😴 Sleep Timer</p>
      {left>0?(
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
          <span style={{color:C.lavender,fontSize:20,fontWeight:700}}>{fmt(left)}</span>
          <button onClick={()=>{clearInterval(ref.current);setLeft(null);setSel(null);}}
            style={{background:"rgba(255,255,255,0.1)",color:C.textMuted,padding:"5px 14px",borderRadius:20,fontSize:12}}>
            cancel
          </button>
        </div>
      ):(
        <div style={{display:"flex",gap:8,justifyContent:"center"}}>
          {[5,10,15,30].map(m=>(
            <button key={m} className="btn-press" onClick={()=>start(m)} style={{
              padding:"8px 16px",borderRadius:20,fontSize:13,fontWeight:600,
              background:sel===m?"linear-gradient(135deg,#7C3AED,#6366F1)":"rgba(255,255,255,0.08)",
              color:sel===m?"white":C.textMuted,
              border:`1px solid ${sel===m?"transparent":"rgba(255,255,255,0.12)"}`,
              transition:"all 0.2s",
            }}>{m}m</button>
          ))}
        </div>
      )}
    </div>
  );
}

function StoryText({text,currentChar}) {
  const sentences=text.split(/(?<=[.!?])\s+/);
  let charCount=0;
  return (
    <div style={{maxHeight:280,overflowY:"auto",lineHeight:1.9,fontSize:15.5,color:"rgba(241,240,255,0.88)",fontWeight:400}}>
      {sentences.map((s,i)=>{
        const start=charCount;
        charCount+=s.length+1;
        const visible=currentChar>=start;
        const active=currentChar>=start&&currentChar<charCount;
        return (
          <span key={i} style={{
            transition:"opacity 0.5s,color 0.4s",
            opacity:visible?1:0.2,
            color:active?"#FBBF24":"rgba(241,240,255,0.88)",
            fontWeight:active?600:400,
          }}>
            {s}{" "}
          </span>
        );
      })}
    </div>
  );
}

function ParentView({profile,setProfile,stories,onGenerate,onSelectStory,generating}) {
  const [form,setForm]=useState(profile||{name:"",age:"",animal:"",theme:""});
  const [saved,setSaved]=useState(!!profile);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const save=()=>{ if(!form.name.trim())return; setProfile(form);setSaved(true); };

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${C.bg1} 0%,${C.bg2} 50%,${C.bg3} 100%)`,position:"relative",overflowX:"hidden"}}>
      <Stars/><Orbs/>
      <div style={{position:"relative",zIndex:1,maxWidth:420,margin:"0 auto",padding:"0 18px 48px"}}>

        {/* Header */}
        <div style={{textAlign:"center",padding:"52px 0 32px",animation:"fadeSlideUp 0.6s ease forwards"}}>
          <div style={{fontSize:56,lineHeight:1,marginBottom:10,filter:"drop-shadow(0 0 24px rgba(251,191,36,0.7))",animation:"moonFloat 4s ease-in-out infinite",display:"inline-block"}}>🌙</div>
          <h1 className="playfair" style={{fontSize:36,color:"white",fontWeight:700,letterSpacing:"-0.5px",lineHeight:1.1}}>DreamWeaver</h1>
          <p style={{color:C.textMuted,fontSize:14,marginTop:8,letterSpacing:"0.3px"}}>Magical bedtime stories for little dreamers</p>
        </div>

        {/* Profile Card */}
        <div className="fade-up-1" style={{marginBottom:16}}>
          <GlassCard>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <h2 className="playfair" style={{color:"white",fontSize:20,fontWeight:700}}>✦ Child's Profile</h2>
              {saved&&(
                <button className="btn-press" onClick={()=>setSaved(false)} style={{
                  background:"rgba(196,181,253,0.15)",color:C.lavender,
                  padding:"6px 16px",borderRadius:20,fontSize:12,fontWeight:700,
                  border:"1px solid rgba(196,181,253,0.3)",
                }}>Edit</button>
              )}
            </div>

            {saved?(
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div style={{
                  width:64,height:64,borderRadius:20,fontSize:30,flexShrink:0,
                  background:"linear-gradient(135deg,rgba(251,191,36,0.2),rgba(196,181,253,0.2))",
                  border:"1px solid rgba(255,255,255,0.15)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                }}>
                  {ANIMALS.find(a=>a.n===form.animal)?.e||"🌟"}
                </div>
                <div>
                  <p className="playfair" style={{color:"white",fontSize:24,fontWeight:700}}>{form.name}</p>
                  <p style={{color:C.textMuted,fontSize:13,marginTop:4}}>
                    {form.age?`Age ${form.age}`:""}{form.animal?` · ${form.animal}s`:""}{form.theme?` · ${form.theme}`:""}
                  </p>
                </div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div>
                  <label style={{color:C.textMuted,fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",display:"block",marginBottom:8}}>Child's Name</label>
                  <GlassInput value={form.name} onChange={e=>f("name",e.target.value)} placeholder="e.g. Amara"/>
                </div>
                <div>
                  <label style={{color:C.textMuted,fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",display:"block",marginBottom:8}}>Age</label>
                  <GlassInput value={form.age} onChange={e=>f("age",e.target.value)} placeholder="e.g. 5" type="number"/>
                </div>
                <div>
                  <label style={{color:C.textMuted,fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",display:"block",marginBottom:10}}>Favourite Animal</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
                    {ANIMALS.map(a=>{
                      const sel=form.animal===a.n;
                      return (
                        <button key={a.n} onClick={()=>f("animal",a.n)} style={{
                          aspectRatio:"1",borderRadius:14,fontSize:22,
                          background:sel?"linear-gradient(135deg,rgba(251,191,36,0.3),rgba(196,181,253,0.3))":"rgba(255,255,255,0.07)",
                          border:`1px solid ${sel?"rgba(251,191,36,0.6)":"rgba(255,255,255,0.1)"}`,
                          boxShadow:sel?"0 0 16px rgba(251,191,36,0.3)":"none",
                          transform:sel?"scale(1.12)":"scale(1)",
                          transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",
                        }} title={a.n}>{a.e}</button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={{color:C.textMuted,fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",display:"block",marginBottom:10}}>Story Theme</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {THEMES.map(t=>{
                      const sel=form.theme===t.id;
                      return (
                        <button key={t.id} className="btn-press" onClick={()=>f("theme",t.id)} style={{
                          padding:"8px 14px",borderRadius:20,fontSize:13,fontWeight:600,
                          background:sel?"linear-gradient(135deg,#7C3AED,#6366F1)":"rgba(255,255,255,0.07)",
                          color:sel?"white":C.textMuted,
                          border:`1px solid ${sel?"transparent":"rgba(255,255,255,0.12)"}`,
                          boxShadow:sel?"0 4px 16px rgba(124,58,237,0.4)":"none",
                          transition:"all 0.2s",
                        }}>{t.e} {t.id}</button>
                      );
                    })}
                  </div>
                </div>
                <button className="btn-press" onClick={save} style={{
                  width:"100%",padding:"15px",borderRadius:18,fontSize:15,fontWeight:700,
                  background:"linear-gradient(135deg,rgba(196,181,253,0.25),rgba(99,102,241,0.25))",
                  color:"white",border:"1px solid rgba(196,181,253,0.35)",
                  boxShadow:"0 4px 20px rgba(99,102,241,0.2)",transition:"all 0.2s",marginTop:4,
                }}>Save Profile ✓</button>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Generate Button */}
        {saved&&(
          <div className="fade-up-2" style={{marginBottom:16}}>
            <button className="btn-press" onClick={onGenerate} disabled={generating} style={{
              width:"100%",padding:"20px",borderRadius:50,
              background:generating?"rgba(255,255,255,0.1)":"linear-gradient(135deg,#FBBF24 0%,#F472B6 50%,#818CF8 100%)",
              color:"white",fontSize:18,fontWeight:700,letterSpacing:"0.3px",
              boxShadow:generating?"none":"0 4px 30px rgba(251,191,36,0.45),0 0 60px rgba(244,114,182,0.2)",
              transition:"all 0.3s",display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            }}>
              {generating?(
                <>
                  <div style={{width:20,height:20,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"white",animation:"spin 0.8s linear infinite"}}/>
                  Weaving your story…
                </>
              ):(
                `✨ Generate ${form.name?""+form.name+"'s":"Tonight's"} Story`
              )}
            </button>
          </div>
        )}

        {/* Library */}
        {stories.length>0&&(
          <div className="fade-up-3">
            <GlassCard>
              <h2 className="playfair" style={{color:"white",fontSize:18,fontWeight:700,marginBottom:14}}>📚 Story Library</h2>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {stories.map((s,i)=>(
                  <button key={i} className="btn-press" onClick={()=>onSelectStory(s)} style={{
                    width:"100%",textAlign:"left",padding:"14px 16px",borderRadius:16,
                    background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",
                    transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"space-between",
                  }}>
                    <div>
                      <p style={{color:"white",fontSize:14,fontWeight:600,marginBottom:3}}>{s.title}</p>
                      <p style={{color:C.textMuted,fontSize:12}}>{s.date} · {s.theme}</p>
                    </div>
                    <span style={{color:C.gold,fontSize:20}}>▶</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}

function ChildView({story,profile,onBack}) {
  const [playing,setPlaying]=useState(false);
  const [progress,setProgress]=useState(0);
  const [currentChar,setCurrentChar]=useState(0);
  const [soundscape,setSoundscape]=useState(null);
  const utterRef=useRef(null);
  const totalWords=story?.text?.split(" ").length||0;
  const readingTime=Math.ceil(totalWords/120);

  const speak=useCallback(()=>{
    if(!story?.text)return;
    window.speechSynthesis.cancel();
    const utter=new SpeechSynthesisUtterance(story.text);
    utter.rate=0.72;utter.pitch=1.05;utter.volume=1;
    const voices=window.speechSynthesis.getVoices();
    const pick=voices.find(v=>v.name.includes("Samantha")||v.name.includes("Karen")||v.name.includes("Moira")||(v.lang.startsWith("en")&&v.localService))||voices.find(v=>v.lang.startsWith("en"))||voices[0];
    if(pick)utter.voice=pick;
    utter.onend=()=>{setPlaying(false);setProgress(100);setCurrentChar(story.text.length);};
    utter.onboundary=(e)=>{
      setProgress(Math.min(100,(e.charIndex/story.text.length)*100));
      setCurrentChar(e.charIndex);
    };
    utterRef.current=utter;
    window.speechSynthesis.speak(utter);
    setPlaying(true);
  },[story]);

  const toggle=()=>{
    if(!playing){if(progress===0)speak();else{window.speechSynthesis.resume();setPlaying(true);}}
    else{window.speechSynthesis.pause();setPlaying(false);}
  };
  const restart=()=>{window.speechSynthesis.cancel();setProgress(0);setCurrentChar(0);setPlaying(false);setTimeout(speak,150);};
  useEffect(()=>()=>window.speechSynthesis.cancel(),[]);

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${C.bg1} 0%,${C.bg2} 50%,${C.bg3} 100%)`,position:"relative",display:"flex",flexDirection:"column",overflowX:"hidden"}}>
      <Stars/><Orbs/>

      {/* Top bar */}
      <div style={{position:"relative",zIndex:2,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"48px 20px 12px"}}>
        <button className="btn-press" onClick={onBack} style={{
          width:42,height:42,borderRadius:14,
          background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",
          color:"rgba(255,255,255,0.7)",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",
        }}>←</button>
        <p style={{color:C.textMuted,fontSize:13,fontWeight:600,letterSpacing:"0.5px"}}>For {profile?.name} ✦</p>
        <div style={{width:42}}/>
      </div>

      <div style={{position:"relative",zIndex:2,flex:1,overflowY:"auto",padding:"0 18px 40px",maxWidth:420,margin:"0 auto",width:"100%"}}>

        {/* Moon */}
        <div style={{textAlign:"center",padding:"12px 0 16px",animation:"fadeSlideUp 0.5s ease forwards"}}>
          <div style={{fontSize:64,lineHeight:1,filter:"drop-shadow(0 0 30px rgba(251,191,36,0.7))",animation:"moonFloat 4s ease-in-out infinite",display:"inline-block"}}>🌙</div>
        </div>

        {/* Title */}
        <div className="fade-up-1" style={{textAlign:"center",marginBottom:20,padding:"0 8px"}}>
          <h1 className="playfair" style={{color:"white",fontSize:26,fontWeight:700,lineHeight:1.25,marginBottom:6}}>{story?.title}</h1>
          <p style={{color:C.textMuted,fontSize:13}}>{readingTime} min · {story?.theme}</p>
        </div>

        {/* Progress */}
        <div className="fade-up-2" style={{marginBottom:16}}>
          <div style={{height:4,borderRadius:4,background:"rgba(255,255,255,0.1)",overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:4,background:"linear-gradient(90deg,#FBBF24,#F9A8D4,#C4B5FD)",width:`${progress}%`,transition:"width 0.4s ease"}}/>
          </div>
        </div>

        {/* Waveform */}
        <div className="fade-up-2" style={{marginBottom:16}}><Waveform playing={playing}/></div>

        {/* Controls */}
        <div className="fade-up-3" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:20,marginBottom:24}}>
          <button className="btn-press" onClick={restart} style={{
            width:50,height:50,borderRadius:16,fontSize:20,
            background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",
            color:"rgba(255,255,255,0.6)",display:"flex",alignItems:"center",justifyContent:"center",
          }}>↺</button>
          <button className="btn-press" onClick={toggle} style={{
            width:90,height:90,borderRadius:28,fontSize:38,
            background:"linear-gradient(135deg,#FBBF24,#F472B6,#818CF8)",
            color:"white",
            boxShadow:playing?"0 0 60px rgba(251,191,36,0.7),0 8px 32px rgba(0,0,0,0.4)":"0 0 40px rgba(251,191,36,0.4),0 8px 32px rgba(0,0,0,0.4)",
            display:"flex",alignItems:"center",justifyContent:"center",
            animation:playing?"btnPulse 2s ease-in-out infinite":"none",
            transition:"all 0.2s",
          }}>
            <span style={{marginLeft:playing?0:4}}>{playing?"⏸":"▶"}</span>
          </button>
          <div style={{width:50,height:50}}/>
        </div>

        {/* Story Text */}
        <div className="fade-up-4" style={{marginBottom:14}}>
          <GlassCard>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <span style={{fontSize:16}}>📖</span>
              <p style={{color:C.textMuted,fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>Story</p>
            </div>
            <StoryText text={story?.text||""} currentChar={currentChar}/>
          </GlassCard>
        </div>

        {/* Soundscape */}
        <div className="fade-up-5" style={{marginBottom:14}}>
          <GlassCard>
            <p style={{color:C.textMuted,fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>🎵 Background Sounds</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {SOUNDS.map(s=>{
                const sel=soundscape===s.id;
                return (
                  <button key={s.id} className="btn-press" onClick={()=>setSoundscape(sel?null:s.id)} style={{
                    padding:"14px 8px",borderRadius:16,
                    background:sel?"linear-gradient(135deg,rgba(99,102,241,0.4),rgba(124,58,237,0.4))":"rgba(255,255,255,0.06)",
                    border:`1px solid ${sel?"rgba(196,181,253,0.5)":"rgba(255,255,255,0.1)"}`,
                    boxShadow:sel?"0 0 20px rgba(99,102,241,0.35)":"none",
                    display:"flex",flexDirection:"column",alignItems:"center",gap:6,transition:"all 0.2s",
                  }}>
                    <span style={{fontSize:26}}>{s.e}</span>
                    <span style={{color:sel?"white":C.textMuted,fontSize:12,fontWeight:600}}>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Sleep Timer */}
        <div className="fade-up-6">
          <GlassCard>
            <SleepTimer onStop={()=>{window.speechSynthesis.cancel();setPlaying(false);}}/>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

async function generateStory(profile) {
  const response = await fetch('/api/generate', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({profile}),
  });
  const data = await response.json();
  const raw = data.content?.[0]?.text||'';
  const titleMatch = raw.match(/TITLE:\s*(.+)/);
  const title = titleMatch?titleMatch[1].trim():`${profile.name}'s Dream Adventure`;
  const text = raw.replace(/TITLE:.+\n+/,'').trim();
  return {title,text,theme:profile.theme||'adventure',date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'})};
}

export default function App() {
  const [view,setView]=useState("parent");
  const [profile,setProfile]=useState(null);
  const [story,setStory]=useState(null);
  const [stories,setStories]=useState([]);
  const [generating,setGenerating]=useState(false);
  const [error,setError]=useState(null);

  const handleGenerate=async()=>{
    if(!profile)return;
    setGenerating(true);setError(null);
    try{
      const s=await generateStory(profile);
      setStory(s);setStories(p=>[s,...p].slice(0,10));setView("child");
    }catch(e){
      setError("Couldn't generate story. Check your connection and try again.");
    }finally{setGenerating(false);}
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {error&&(
        <div style={{position:"fixed",top:16,left:16,right:16,zIndex:999,background:"rgba(239,68,68,0.15)",backdropFilter:"blur(12px)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:16,padding:"14px 16px",color:"#FCA5A5",fontSize:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>{error}</span>
          <button onClick={()=>setError(null)} style={{color:"#FCA5A5",fontSize:18,background:"none",padding:"0 4px"}}>✕</button>
        </div>
      )}
      {view==="child"&&story
        ?<ChildView story={story} profile={profile} onBack={()=>setView("parent")}/>
        :<ParentView profile={profile} setProfile={setProfile} stories={stories} onGenerate={handleGenerate} onSelectStory={s=>{setStory(s);setView("child");}} generating={generating}/>
      }
    </>
  );
}
