import { useState } from "react";

const TAGS = ["😔 Overwhelmed","😰 Anxious","😞 Sad","😤 Frustrated","😕 Stuck","😌 Calm","🙏 Grateful","🌱 Hopeful"];

const DEMO_ENTRIES = [
  { date: "May 18, 2026 · 9:14 AM", tags: ["🙏 Grateful","🌱 Hopeful"], text: "Had a really good morning. Took time to breathe and felt more present than usual. Small wins." },
  { date: "May 17, 2026 · 11:32 PM", tags: ["😰 Anxious","😕 Stuck"], text: "Hard day. Couldn't stop thinking about the presentation. Tried the reset mode and it helped a little." },
  { date: "May 15, 2026 · 7:45 PM",  tags: ["😌 Calm"], text: "Quiet evening. Feeling okay. Just wanted to write something down." },
];

const c = {
  bg:"#f5f0e8", surface:"#ede6da", border:"#ddd5c4",
  text:"#3a3020", textSec:"#9a8a74", textMuted:"#b8a990",
  accent:"#c8960c", accentHov:"#b8860b", accentLight:"#fff8e6",
  font:"'Poppins',sans-serif",
};

export default function ReflectMockup() {
  const [view, setView] = useState("write"); // write | saved | entries
  const [selectedTags, setSelectedTags] = useState([]);
  const [text, setText] = useState("");
  const [entries, setEntries] = useState(DEMO_ENTRIES);

  const today = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})
    + " · " + new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});

  function toggleTag(tag) {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t=>t!==tag) : [...prev, tag]);
  }

  function save() {
    const entry = {
      date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) + " · " + new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),
      tags: selectedTags,
      text,
    };
    setEntries(prev => [entry, ...prev]);
    setView("saved");
  }

  function newEntry() {
    setSelectedTags([]); setText(""); setView("write");
  }

  const canSave = text.trim().length > 0 || selectedTags.length > 0;

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 16px",background:"#e8e0d4",minHeight:"100vh",fontFamily:c.font}}>
      <div style={{width:320,height:660,background:c.bg,borderRadius:40,border:`1.5px solid ${c.border}`,display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.12)"}}>

        {/* Status bar */}
        <div style={{display:"flex",justifyContent:"space-between",padding:"12px 20px 4px"}}>
          <span style={{color:c.text,fontSize:11,fontWeight:600}}>10:01</span>
          <span style={{color:c.textMuted,fontSize:7,letterSpacing:2}}>●●●</span>
        </div>

        {/* ── WRITE ── */}
        {view === "write" && <>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 18px 10px"}}>
            <span style={{color:c.text,fontSize:14,fontWeight:600}}>Reflect</span>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <button onClick={()=>setView("entries")} style={{background:"none",border:"none",color:c.textMuted,fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:c.font}}>History</button>
              <button onClick={save} disabled={!canSave} style={{background:canSave?c.accent:"#ddd5c4",border:"none",borderRadius:16,color:canSave?"#fff":c.textMuted,fontSize:11,fontWeight:600,padding:"6px 16px",cursor:canSave?"pointer":"default",fontFamily:c.font}}>Save</button>
            </div>
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto"}}>
            <p style={{padding:"0 18px 8px",color:c.textMuted,fontSize:10,fontWeight:500,letterSpacing:0.4}}>{today}</p>
            <p style={{padding:"0 18px 8px",color:c.textSec,fontSize:11,fontWeight:500}}>How are you feeling?</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:7,padding:"0 18px 16px"}}>
              {TAGS.map(tag => (
                <button key={tag} onClick={()=>toggleTag(tag)} style={{background:selectedTags.includes(tag)?c.accentLight:c.surface,border:`1.5px solid ${selectedTags.includes(tag)?c.accent:c.border}`,borderRadius:20,color:selectedTags.includes(tag)?c.accent:c.textSec,fontSize:11,fontWeight:selectedTags.includes(tag)?600:500,padding:"6px 11px",cursor:"pointer",fontFamily:c.font}}>{tag}</button>
              ))}
            </div>
            <div style={{height:1,background:c.border,margin:"0 18px 14px"}} />
            <textarea
              value={text}
              onChange={e=>setText(e.target.value)}
              maxLength={1000}
              placeholder="What's on your mind right now..."
              style={{flex:1,border:"none",background:"transparent",color:c.text,fontSize:14,fontFamily:c.font,lineHeight:1.7,padding:"0 18px",resize:"none",outline:"none",minHeight:160}}
            />
            <p style={{padding:"4px 18px 8px",color:"#c8b89a",fontSize:10,textAlign:"right"}}>{text.length} / 1000</p>
          </div>
        </>}

        {/* ── SAVED ── */}
        {view === "saved" && <>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 18px 10px"}}>
            <span style={{color:c.text,fontSize:14,fontWeight:600}}>Reflect</span>
            <button onClick={()=>setView("entries")} style={{background:"none",border:"none",color:c.accent,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:c.font}}>All entries</button>
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,gap:12}}>
            <div style={{color:c.accent,fontSize:28,marginBottom:4}}>✦</div>
            <p style={{color:c.text,fontSize:18,fontWeight:600,textAlign:"center"}}>Entry saved.</p>
            <p style={{color:c.textSec,fontSize:12,textAlign:"center",lineHeight:1.6,marginBottom:8}}>Your words are safe and private.<br/>Only you can read them.</p>
            <button onClick={newEntry} style={{background:c.accent,border:"none",borderRadius:28,color:"#fff",fontSize:13,fontWeight:600,padding:"12px 36px",cursor:"pointer",fontFamily:c.font,width:"100%"}}>Write another</button>
            <button onClick={()=>setView("entries")} style={{background:"none",border:`1px solid ${c.border}`,borderRadius:28,color:c.textSec,fontSize:12,fontWeight:500,padding:"11px 36px",cursor:"pointer",fontFamily:c.font,width:"100%"}}>View past entries</button>
          </div>
        </>}

        {/* ── ENTRIES ── */}
        {view === "entries" && <>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 18px 10px"}}>
            <span style={{color:c.text,fontSize:14,fontWeight:600}}>Past Entries</span>
            <button onClick={newEntry} style={{background:"none",border:"none",color:c.accent,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:c.font}}>+ New</button>
          </div>
          <div style={{flex:1,overflowY:"auto",paddingTop:4}}>
            {entries.length === 0 ? (
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:8}}>
                <span style={{fontSize:28,color:c.border}}>✎</span>
                <p style={{color:c.textMuted,fontSize:13,textAlign:"center"}}>No entries yet.<br/>Your first one is waiting.</p>
              </div>
            ) : entries.map((e,i) => (
              <div key={i} style={{background:c.surface,border:`1px solid ${c.border}`,borderRadius:14,padding:"12px 14px",margin:"0 18px 10px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{color:c.textMuted,fontSize:10,fontWeight:500}}>{e.date}</span>
                  <div style={{display:"flex",gap:5}}>
                    {e.tags.map(t=>(
                      <span key={t} style={{background:c.accentLight,border:`1px solid #e8c84a`,borderRadius:10,color:c.accent,fontSize:9,fontWeight:600,padding:"2px 7px"}}>{t}</span>
                    ))}
                  </div>
                </div>
                <p style={{color:"#6a5a48",fontSize:12,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{e.text || <em style={{color:"#c8b89a"}}>No text</em>}</p>
              </div>
            ))}
          </div>
        </>}

        {/* Bottom nav */}
        <div style={{display:"flex",justifyContent:"space-around",padding:"8px 4px 16px",borderTop:`1px solid ${c.border}`,background:c.surface}}>
          {[["⌂","Home"],["◎","Chat"],["↺","Reset"],["◈","Learn"],["✎","Reflect"]].map(([icon,label])=>(
            <button key={label} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"4px 6px"}}>
              <span style={{fontSize:16,color:label==="Reflect"?c.accent:"#c8b89a"}}>{icon}</span>
              <span style={{fontSize:8,color:label==="Reflect"?c.accent:"#c8b89a",fontFamily:c.font,fontWeight:500}}>{label}</span>
            </button>
          ))}
        </div>
      </div>
      <p style={{color:"#a09080",fontSize:10,marginTop:14,fontFamily:c.font,letterSpacing:0.4}}>AMFH · Reflect · Interactive Mockup</p>
    </div>
  );
}
