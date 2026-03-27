import { useState, useEffect, useRef, useCallback } from "react";

const THEMES = {
  forest: {
    label: "Enchanted Forest",
    bg: "from-[#0d2b1a] via-[#153d28] to-[#0a1f12]",
    accent: "#4ade80",
    glow: "#22c55e",
    stars: false,
    emoji: "🌲",
    particles: ["🍃", "✨", "🦋", "🌿", "⭐"],
  },
  nightsky: {
    label: "Night Sky",
    bg: "from-[#0a0f2e] via-[#0f1854] to-[#060b20]",
    accent: "#818cf8",
    glow: "#6366f1",
    stars: true,
    emoji: "🌙",
    particles: ["⭐", "✨", "💫", "🌟", "⭐"],
  },
  ocean: {
    label: "Deep Ocean",
    bg: "from-[#0c1e3c] via-[#0e2d54] to-[#071524]",
    accent: "#38bdf8",
    glow: "#0ea5e9",
    stars: false,
    emoji: "🌊",
    particles: ["🐠", "✨", "🐋", "💙", "🐬"],
  },
};

const ANIMALS = ["🐻 Bear","🦁 Lion","🐰 Bunny","🦊 Fox","🐼 Panda","🦄 Unicorn","🐉 Dragon","🦉 Owl"];
const STORY_THEMES = ["adventure","friendship","kindness","courage","magic","discovery","nature","space"];

function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, delay: Math.random() * 4, dur: 2 + Math.random() * 3,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div key={s.id} className="absolute rounded-full bg-white"
          style={{ left:`${s.x}%`, top:`${s.y}%`, width:s.size, height:s.size, opacity:0,
            animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
      ))}
    </div>
  );
}

function Particles({ theme }) {
  const items = THEMES[theme].particles;
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i, emoji: items[i % items.length], x: 10 + Math.random() * 80,
    delay: i * 0.8, dur: 6 + Math.random() * 4, size: 14 + Math.random() * 10,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div key={p.id} className="absolute"
          style={{ left:`${p.x}%`, bottom:"-10%", fontSize:p.size,
            animation:`floatUp ${p.dur}s ${p.delay}s ease-in-out infinite`, opacity:0 }}>
          {p.emoji}
        </div>
      ))}
    </div>
  );
}

function MoonGlow({ color }) {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
        style={{ background:`radial-gradient(circle at 40% 40%, #fff9e6, #fde68a, #f59e0b)`,
          boxShadow:`0 0 40px 20px ${color}55, 0 0 80px 40px ${color}22`,
          animation:"pulse-glow 3s ease-in-out infinite" }}>
        <span className="text-4xl">🌙</span>
      </div>
    </div>
  );
}

function WaveViz({ playing, color }) {
  const bars = Array.from({ length: 20 }, (_, i) => i);
  return (
    <div className="flex items-end justify-center gap-1 h-10 my-4">
      {bars.map((i) => (
        <div key={i} className="w-1.5 rounded-full"
          style={{ backgroundColor:color, height:playing?`${20+Math.random()*80}%`:"20%",
            animation:playing?`wave ${0.5+Math.random()*0.8}s ${i*0.05}s ease-in-out infinite alternate`:"none",
            transition:"height 0.3s ease", opacity:playing?0.9:0.3 }} />
      ))}
    </div>
  );
}

function SleepTimer({ onStop }) {
  const [left, setLeft] = useState(null);
  const ref = useRef(null);
  const options = [5, 10, 15, 30];
  const start = (m) => {
    setLeft(m * 60);
    clearInterval(ref.current);
    ref.current = setInterval(() => {
      setLeft((l) => { if (l <= 1) { clearInterval(ref.current); onStop(); return 0; } return l - 1; });
    }, 1000);
  };
  useEffect(() => () => clearInterval(ref.current), []);
  const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  return (
    <div className="text-center">
      {left !== null && left > 0 ? (
        <div className="text-sm opacity-70">
          😴 Sleep timer: <span className="font-bold">{fmt(left)}</span>
          <button onClick={() => { clearInterval(ref.current); setLeft(null); }}
            className="ml-2 text-xs opacity-50 hover:opacity-100">cancel</button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs opacity-50">😴 Sleep timer:</span>
          {options.map(m => (
            <button key={m} onClick={() => start(m)}
              className="text-xs px-2 py-0.5 rounded-full border border-white/20 hover:border-white/60 transition-all opacity-60 hover:opacity-100">
              {m}m
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ParentView({ profile, setProfile, stories, onGenerate, onSwitchChild, generating }) {
  const [editing, setEditing] = useState(!profile);
  const [form, setForm] = useState(profile || { name:"", age:"", animal:"", theme:"" });
  const save = () => { if (!form.name.trim()) return; setProfile(form); setEditing(false); };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f0] via-[#fef9f5] to-[#f0f4ff]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .title-font { font-family: 'Fraunces', Georgia, serif; }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .card { animation: slideUp 0.4s ease forwards; }
      `}</style>
      <div className="px-5 pt-10 pb-6 bg-white/60 backdrop-blur-sm border-b border-stone-100 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="title-font text-2xl text-stone-800">✨ DreamWeaver</h1>
            <p className="text-xs text-stone-400 mt-0.5">Bedtime stories, reimagined</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg">👋</div>
        </div>
      </div>
      <div className="max-w-md mx-auto px-5 py-6 space-y-5">
        <div className="card bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-rose-50 px-6 pt-5 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="title-font text-lg text-stone-700">Child's Profile</h2>
              {!editing && <button onClick={()=>setEditing(true)} className="text-xs text-amber-600 font-medium">Edit</button>}
            </div>
          </div>
          <div className="px-6 pb-6 pt-4">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Child's Name *</label>
                  <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                    placeholder="e.g. Amara" className="mt-1 w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Age</label>
                  <input value={form.age} onChange={e=>setForm({...form,age:e.target.value})}
                    placeholder="e.g. 5" type="number" min="1" max="12" className="mt-1 w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Favourite Animal</label>
                  <div className="mt-1 grid grid-cols-4 gap-1.5">
                    {ANIMALS.map(a => {
                      const [emoji,name] = a.split(" ");
                      return (
                        <button key={name} onClick={()=>setForm({...form,animal:name})}
                          className={`text-center py-2 rounded-xl text-sm transition-all ${form.animal===name?"bg-amber-100 ring-2 ring-amber-400":"bg-stone-50 hover:bg-stone-100"}`}>
                          {emoji}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Favourite Theme</label>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {STORY_THEMES.map(t => (
                      <button key={t} onClick={()=>setForm({...form,theme:t})}
                        className={`px-3 py-1 rounded-full text-xs capitalize transition-all ${form.theme===t?"bg-rose-100 text-rose-700 ring-2 ring-rose-300":"bg-stone-50 text-stone-500 hover:bg-stone-100"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={save} className="w-full py-3 bg-stone-800 text-white rounded-2xl text-sm font-medium hover:bg-stone-700 transition-all mt-2">
                  Save Profile ✓
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {ANIMALS.find(a=>a.includes(profile?.animal))?.split(" ")[0] || "🌟"}
                </div>
                <div>
                  <p className="title-font text-xl text-stone-800">{profile?.name}</p>
                  <p className="text-sm text-stone-400">{profile?.age?`Age ${profile.age}`:""}{profile?.animal?` · Loves ${profile.animal}s`:""}{profile?.theme?` · ${profile.theme} stories`:""}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {profile && !editing && (
          <div className="card" style={{animationDelay:"0.1s",opacity:0}}>
            <button onClick={onGenerate} disabled={generating}
              className="w-full py-5 rounded-3xl text-white font-medium text-lg shadow-lg transition-all active:scale-95"
              style={{background:generating?"#9ca3af":"linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)"}}>
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"/>
                  Weaving your story…
                </span>
              ) : <span>✨ Generate Tonight's Story</span>}
            </button>
            <p className="text-center text-xs text-stone-400 mt-2">Personalized just for {profile?.name}</p>
          </div>
        )}
        {stories.length > 0 && (
          <div className="card" style={{animationDelay:"0.2s",opacity:0}}>
            <h2 className="title-font text-lg text-stone-700 mb-3">Story Library</h2>
            <div className="space-y-2">
              {stories.map((s,i) => (
                <button key={i} onClick={()=>onSwitchChild(s)}
                  className="w-full text-left bg-white rounded-2xl border border-stone-100 px-4 py-3 hover:border-amber-200 hover:bg-amber-50/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-stone-700 group-hover:text-amber-700">{s.title}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{s.date} · {s.theme}</p>
                    </div>
                    <span className="text-stone-300 group-hover:text-amber-400 text-lg">▶</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChildView({ story, profile, onBack }) {
  const [playing, setPlaying] = useState(false);
  const [theme, setTheme] = useState("nightsky");
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [showText, setShowText] = useState(false);
  const [soundscape, setSoundscape] = useState(null);
  const utterRef = useRef(null);
  const t = THEMES[theme];
  const lines = story?.text?.split(/(?<=[.!?])\s+/) || [];
  const totalWords = story?.text?.split(" ").length || 0;
  const readingTime = Math.ceil(totalWords / 120);
  const speak = useCallback(() => {
    if (!story?.text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(story.text);
    utter.rate = 0.75; utter.pitch = 1.1; utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v=>v.name.includes("Samantha")||v.name.includes("Karen")||v.lang==="en-GB") || voices[0];
    if (preferred) utter.voice = preferred;
    utter.onend = () => { setPlaying(false); setProgress(100); };
    utter.onboundary = (e) => {
      setProgress(Math.min(100,(e.charIndex/story.text.length)*100));
      const lineIdx = lines.findIndex((_,li)=>lines.slice(0,li+1).join(" ").length>=e.charIndex);
      if (lineIdx>=0) setCurrentLine(lineIdx);
    };
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
    setPlaying(true);
  }, [story, lines]);
  const toggle = () => { if (!playing) { if (progress===0) speak(); else { window.speechSynthesis.resume(); setPlaying(true); } } else { window.speechSynthesis.pause(); setPlaying(false); } };
  const restart = () => { window.speechSynthesis.cancel(); setProgress(0); setCurrentLine(0); setPlaying(false); setTimeout(speak,100); };
  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);
  return (
    <div className={`min-h-screen bg-gradient-to-br ${t.bg} relative flex flex-col overflow-hidden`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@1,300;0,400&display=swap');
        .story-font { font-family: 'Crimson Pro', Georgia, serif; }
        @keyframes twinkle { 0%,100%{opacity:0.1} 50%{opacity:1} }
        @keyframes floatUp { 0%{opacity:0;transform:translateY(0)} 50%{opacity:0.7} 100%{opacity:0;transform:translateY(-100vh)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 40px 20px ${t.glow}55} 50%{box-shadow:0 0 60px 30px ${t.glow}88} }
        @keyframes wave { from{transform:scaleY(0.3)} to{transform:scaleY(1)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .line-highlight { animation: fadeIn 0.5s ease; }
      `}</style>
      {t.stars && <StarField />}
      <Particles theme={theme} />
      <div className="relative z-10 flex items-center justify-between px-5 pt-8 pb-2">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 backdrop-blur-sm">←</button>
        <div className="flex gap-1.5">
          {Object.entries(THEMES).map(([k,v])=>(
            <button key={k} onClick={()=>setTheme(k)} className={`w-7 h-7 rounded-full text-sm transition-all ${theme===k?"ring-2 ring-white scale-110":""}`}>{v.emoji}</button>
          ))}
        </div>
        <button onClick={()=>setShowText(!showText)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 backdrop-blur-sm text-sm">📖</button>
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4">
        <MoonGlow color={t.glow} />
        <h1 className="story-font text-white text-center text-2xl font-light italic mb-1 px-4">{story?.title || "A Magical Bedtime Story"}</h1>
        <p className="text-white/40 text-xs mb-6">For {profile?.name} · {readingTime} min</p>
        <WaveViz playing={playing} color={t.accent} />
        <div className="w-full max-w-xs h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{width:`${progress}%`,backgroundColor:t.accent}} />
        </div>
        <button onClick={toggle} className="w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-2xl transition-all active:scale-90"
          style={{background:`radial-gradient(circle at 35% 35%, ${t.accent}cc, ${t.glow}88)`,boxShadow:`0 0 50px ${t.glow}66`}}>
          <span style={{marginLeft:playing?0:6}}>{playing?"⏸":"▶"}</span>
        </button>
        <button onClick={restart} className="mt-4 text-white/40 hover:text-white/80 text-sm">↺ Start over</button>
        <div className="flex gap-3 mt-6">
          {[{id:"rain",emoji:"🌧",label:"Rain"},{id:"forest",emoji:"🌲",label:"Forest"},{id:"ocean",emoji:"🌊",label:"Ocean"}].map(s=>(
            <button key={s.id} onClick={()=>setSoundscape(soundscape===s.id?null:s.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-sm transition-all ${soundscape===s.id?"bg-white/20 ring-1 ring-white/40":"bg-white/5 hover:bg-white/15"}`}>
              <span>{s.emoji}</span><span className="text-white/50 text-xs">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
      {showText && (
        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col" onClick={()=>setShowText(false)}>
          <div className="flex-1 overflow-y-auto px-6 pt-16 pb-24" onClick={e=>e.stopPropagation()}>
            <h2 className="story-font text-white text-xl text-center mb-6 italic">{story?.title}</h2>
            {lines.map((line,i)=>(
              <p key={i} className={`story-font text-lg leading-relaxed mb-3 transition-all ${i===currentLine&&playing?"text-white line-highlight":"text-white/60"}`}>{line}</p>
            ))}
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button onClick={()=>setShowText(false)} className="px-6 py-2 bg-white/20 text-white rounded-full text-sm">✕ Close text</button>
          </div>
        </div>
      )}
      <div className="relative z-10 pb-8 px-6">
        <SleepTimer onStop={()=>{window.speechSynthesis.cancel();setPlaying(false);}} />
      </div>
    </div>
  );
}

async function generateStory(profile) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile })
  });
  const data = await response.json();
  const raw = data.content?.[0]?.text || '';
  const titleMatch = raw.match(/TITLE:\s*(.+)/);
  const title = titleMatch ? titleMatch[1].trim() : `${profile.name}'s Dream Adventure`;
  const text = raw.replace(/TITLE:.+\n+/, '').trim();
  return {
    title, text,
    theme: profile.theme || 'adventure',
    date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric' })
  };
}

export default function App() {
  const [view, setView] = useState("parent");
  const [profile, setProfile] = useState(null);
  const [story, setStory] = useState(null);
  const [stories, setStories] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const handleGenerate = async () => {
    if (!profile) return;
    setGenerating(true); setError(null);
    try {
      const s = await generateStory(profile);
      setStory(s);
      setStories(prev=>[s,...prev].slice(0,10));
      setView("child");
    } catch(e) {
      setError("Couldn't generate story. Check your connection and try again.");
    } finally { setGenerating(false); }
  };
  if (view==="child" && story) return <ChildView story={story} profile={profile} onBack={()=>setView("parent")} />;
  return (
    <>
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700 shadow-lg">
          {error} <button onClick={()=>setError(null)} className="float-right font-bold">✕</button>
        </div>
      )}
      <ParentView profile={profile} setProfile={setProfile} stories={stories}
        onGenerate={handleGenerate} onSwitchChild={s=>{setStory(s);setView("child");}} generating={generating} />
    </>
  );
                                                      }
