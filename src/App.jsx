import { useState, useRef } from "react";
import { Trash2, Plus } from "lucide-react";

const P={low:{l:"ต่ำ",c:"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"},medium:{l:"กลาง",c:"bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"},high:{l:"สูง",c:"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"}};
const ORDER=["low","medium","high"];
const TABS=[["all","ทั้งหมด"],["active","ยังไม่เสร็จ"],["done","เสร็จแล้ว"]];
const CATS=["งาน","ส่วนตัว","ช้อปปิ้ง","สุขภาพ"];
const fmt=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const off=n=>{const d=new Date();d.setDate(d.getDate()+n);return fmt(d)};
const show=s=>s.split("-").reverse().join("/");
const field="px-3 py-2 rounded-lg bg-transparent border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-500 dark:bg-slate-800";

function Donut({done,active,over}){
  const t=done+active+over||1;let acc=0;
  const seg=[[done,"stroke-green-500"],[active,"stroke-indigo-500"],[over,"stroke-red-500"]];
  return(<svg viewBox="0 0 36 36" className="w-24 h-24 shrink-0 -rotate-0">
    <circle cx="18" cy="18" r="15.9155" fill="none" strokeWidth="4" className="stroke-slate-200 dark:stroke-slate-700"/>
    {seg.map(([v,c],i)=>{const p=v/t*100;const el=p>0&&<circle key={i} cx="18" cy="18" r="15.9155" fill="none" strokeWidth="4" className={c} strokeDasharray={p+" "+(100-p)} strokeDashoffset={25-acc}/>;acc+=p;return el})}
  </svg>);
}

function App(){
  const [todos,setTodos]=useState([
    {id:1,text:"ทำ LAB 11 ให้เสร็จ",done:false,pri:"high",cat:"งาน",due:off(-1)},
    {id:2,text:"อัปโหลดงานขึ้น GitHub",done:false,pri:"medium",cat:"งาน",due:off(0)},
    {id:3,text:"ซื้อของเข้าบ้าน",done:false,pri:"low",cat:"ช้อปปิ้ง",due:off(3)},
    {id:4,text:"วิ่งออกกำลังกาย",done:true,pri:"low",cat:"สุขภาพ",due:""}]);
  const [text,setText]=useState(""),[pri,setPri]=useState("medium"),[cat,setCat]=useState(CATS[0]),[due,setDue]=useState("");
  const [filter,setFilter]=useState("all"),[catF,setCatF]=useState("all"),[q,setQ]=useState("");
  const [editId,setEditId]=useState(null),[editText,setEditText]=useState(""),[gone,setGone]=useState([]);
  const nid=useRef(5),today=fmt(new Date());
  const add=()=>{const t=text.trim();if(!t)return;setTodos([{id:nid.current++,text:t,done:false,pri,cat,due},...todos]);setText("");setDue("")};
  const toggle=id=>setTodos(todos.map(t=>t.id===id?{...t,done:!t.done}:t));
  const cycle=id=>setTodos(todos.map(t=>t.id===id?{...t,pri:ORDER[(ORDER.indexOf(t.pri)+1)%3]}:t));
  const remove=id=>{setGone(g=>[...g,id]);setTimeout(()=>{setTodos(ts=>ts.filter(t=>t.id!==id));setGone(g=>g.filter(i=>i!==id))},280)};
  const startEdit=t=>{setEditId(t.id);setEditText(t.text)};
  const saveEdit=()=>{const v=editText.trim();if(v)setTodos(todos.map(t=>t.id===editId?{...t,text:v}:t));setEditId(null)};
  const shown=todos.filter(t=>(catF==="all"||t.cat===catF)&&(filter==="all"||(filter==="done"?t.done:!t.done))&&t.text.toLowerCase().includes(q.trim().toLowerCase()));
  const left=todos.filter(t=>!t.done).length,hasDone=todos.some(t=>t.done);
  const done=todos.length-left,over=todos.filter(t=>!t.done&&t.due&&t.due<today).length,active=left-over;
  const pct=todos.length?Math.round(done/todos.length*100):0;
  const dueBadge=t=>{if(!t.due)return null;
    if(!t.done&&t.due<today)return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">เลยกำหนด {show(t.due)}</span>;
    if(!t.done&&t.due===today)return <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">วันนี้</span>;
    return <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{show(t.due)}</span>};
  const card="bg-white dark:bg-slate-800 rounded-2xl shadow-md";
  return(
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-1">รายการสิ่งที่ต้องทำ</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">จัดการงานของคุณให้เป็นระเบียบ</p>
      <div className="grid md:grid-cols-[230px_1fr] gap-5">
        <aside className="space-y-4">
          <div className={card+" p-4"}>
            <h2 className="font-semibold mb-3">สถิติ</h2>
            <div className="flex items-center gap-3">
              <Donut done={done} active={active} over={over}/>
              <div className="text-sm space-y-1">
                <div>ทั้งหมด <b>{todos.length}</b> งาน</div>
                <div>เสร็จแล้ว <b>{pct}%</b></div>
                <div className="text-green-600">● เสร็จ {done}</div>
                <div className="text-indigo-600">● ค้างอยู่ {active}</div>
                <div className="text-red-600">● เลยกำหนด {over}</div>
              </div>
            </div>
          </div>
          <div className={card+" p-4"}>
            <h2 className="font-semibold mb-3">หมวดหมู่</h2>
            <div className="flex md:flex-col flex-wrap gap-1">
              {["all",...CATS].map(c=>{const n=c==="all"?todos.length:todos.filter(t=>t.cat===c).length;
                return <button key={c} onClick={()=>setCatF(c)} className={"flex justify-between gap-3 px-3 py-1.5 rounded-lg text-sm transition "+(catF===c?"bg-indigo-600 text-white":"hover:bg-slate-100 dark:hover:bg-slate-700")}><span>{c==="all"?"ทั้งหมด":c}</span><span className="opacity-70">{n}</span></button>})}
            </div>
          </div>
        </aside>

        <main>
          <div className={card+" p-3 flex flex-wrap gap-2 mb-4"}>
            <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="เพิ่มงานใหม่..." className={field+" flex-1 min-w-[160px]"}/>
            <select value={cat} onChange={e=>setCat(e.target.value)} className={field} aria-label="หมวดหมู่">{CATS.map(c=><option key={c}>{c}</option>)}</select>
            <select value={pri} onChange={e=>setPri(e.target.value)} className={field} aria-label="ความสำคัญ">{ORDER.map(k=><option key={k} value={k}>{P[k].l}</option>)}</select>
            <input type="date" value={due} onChange={e=>setDue(e.target.value)} className={field} aria-label="วันครบกำหนด"/>
            <button onClick={add} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"><Plus className="w-5 h-5"/>เพิ่ม</button>
          </div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 ค้นหางาน..." className={field+" w-full mb-4"}/>
          <div className="flex gap-2 mb-4">
            {TABS.map(([k,l])=><button key={k} onClick={()=>setFilter(k)} className={"px-3 py-1.5 rounded-full text-sm font-medium transition "+(filter===k?"bg-indigo-600 text-white":"bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow")}>{l}</button>)}
          </div>
          <ul className="space-y-2">
            {shown.length===0&&<li className="text-center text-slate-400 py-10">ไม่มีรายการ</li>}
            {shown.map(t=>(
              <li key={t.id} className={"bg-white dark:bg-slate-800 rounded-xl shadow p-3 flex flex-wrap items-center gap-2 transition-all duration-300 "+(gone.includes(t.id)?"opacity-0 translate-x-8 scale-95":"opacity-100")}>
                <input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)} className="w-5 h-5 accent-indigo-600 cursor-pointer" aria-label="เสร็จแล้ว"/>
                {editId===t.id
                  ?<input autoFocus value={editText} onChange={e=>setEditText(e.target.value)} onBlur={saveEdit} onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditId(null)}} className="flex-1 px-2 py-1 rounded border border-indigo-500 bg-transparent outline-none"/>
                  :<span onDoubleClick={()=>startEdit(t)} title="ดับเบิลคลิกเพื่อแก้ไข" className={"flex-1 min-w-[120px] break-words select-none "+(t.done?"line-through text-slate-400":"")}>{t.text}</span>}
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">{t.cat}</span>
                {dueBadge(t)}
                <button onClick={()=>cycle(t.id)} title="คลิกเพื่อเปลี่ยนความสำคัญ" className={"text-xs font-semibold px-2 py-1 rounded-full "+P[t.pri].c}>{P[t.pri].l}</button>
                <button onClick={()=>remove(t.id)} aria-label="ลบ" className="text-slate-400 hover:text-red-500 transition"><Trash2 className="w-5 h-5"/></button>
              </li>))}
          </ul>
          <div className="flex justify-between items-center mt-5 text-sm text-slate-500 dark:text-slate-400">
            <span>{left} งานที่เหลือ</span>
            <button onClick={()=>setTodos(todos.filter(t=>!t.done))} disabled={!hasDone} className="hover:text-red-500 disabled:opacity-40 disabled:hover:text-inherit transition">ลบงานที่เสร็จแล้ว</button>
          </div>
        </main>
      </div>
    </div>);
}

export default App;
