import { useState, useRef } from "react";
import { Trash2, Plus } from "lucide-react";

const P={low:{l:"ต่ำ",c:"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"},medium:{l:"กลาง",c:"bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"},high:{l:"สูง",c:"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"}};
const ORDER=["low","medium","high"];
const TABS=[["all","ทั้งหมด"],["active","ยังไม่เสร็จ"],["done","เสร็จแล้ว"]];

function App(){
  const [todos,setTodos]=useState([
    {id:1,text:"ทำ LAB 11 ให้เสร็จ",done:false,pri:"high"},
    {id:2,text:"อัปโหลดงานขึ้น GitHub",done:false,pri:"medium"},
    {id:3,text:"อ่านหนังสือสอบ",done:true,pri:"low"}]);
  const [text,setText]=useState(""),[pri,setPri]=useState("medium"),[filter,setFilter]=useState("all");
  const [editId,setEditId]=useState(null),[editText,setEditText]=useState(""),[gone,setGone]=useState([]);
  const nid=useRef(4);
  const add=()=>{const t=text.trim();if(!t)return;setTodos([{id:nid.current++,text:t,done:false,pri},...todos]);setText("")};
  const toggle=id=>setTodos(todos.map(t=>t.id===id?{...t,done:!t.done}:t));
  const cycle=id=>setTodos(todos.map(t=>t.id===id?{...t,pri:ORDER[(ORDER.indexOf(t.pri)+1)%3]}:t));
  const remove=id=>{setGone(g=>[...g,id]);setTimeout(()=>{setTodos(ts=>ts.filter(t=>t.id!==id));setGone(g=>g.filter(i=>i!==id))},280)};
  const startEdit=t=>{setEditId(t.id);setEditText(t.text)};
  const saveEdit=()=>{const v=editText.trim();if(v)setTodos(todos.map(t=>t.id===editId?{...t,text:v}:t));setEditId(null)};
  const shown=todos.filter(t=>filter==="all"||(filter==="done"?t.done:!t.done));
  const left=todos.filter(t=>!t.done).length,hasDone=todos.some(t=>t.done);
  return(
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-1">รายการสิ่งที่ต้องทำ</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">จัดการงานของคุณให้เป็นระเบียบ</p>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-3 flex flex-wrap gap-2 mb-4">
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="เพิ่มงานใหม่..." className="flex-1 min-w-[160px] px-3 py-2 rounded-lg bg-transparent border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-500"/>
        <select value={pri} onChange={e=>setPri(e.target.value)} className="px-2 py-2 rounded-lg bg-transparent border border-slate-200 dark:border-slate-600 dark:bg-slate-800" aria-label="ความสำคัญ">
          {ORDER.map(k=><option key={k} value={k}>{P[k].l}</option>)}
        </select>
        <button onClick={add} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"><Plus className="w-5 h-5"/>เพิ่ม</button>
      </div>

      <div className="flex gap-2 mb-4">
        {TABS.map(([k,l])=><button key={k} onClick={()=>setFilter(k)} className={"px-3 py-1.5 rounded-full text-sm font-medium transition "+(filter===k?"bg-indigo-600 text-white":"bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow")}>{l}</button>)}
      </div>

      <ul className="space-y-2">
        {shown.length===0&&<li className="text-center text-slate-400 py-10">ไม่มีรายการ</li>}
        {shown.map(t=>(
          <li key={t.id} className={"bg-white dark:bg-slate-800 rounded-xl shadow p-3 flex items-center gap-3 transition-all duration-300 "+(gone.includes(t.id)?"opacity-0 translate-x-8 scale-95":"opacity-100")}>
            <input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)} className="w-5 h-5 accent-indigo-600 cursor-pointer" aria-label="เสร็จแล้ว"/>
            {editId===t.id
              ?<input autoFocus value={editText} onChange={e=>setEditText(e.target.value)} onBlur={saveEdit} onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditId(null)}} className="flex-1 px-2 py-1 rounded border border-indigo-500 bg-transparent outline-none"/>
              :<span onDoubleClick={()=>startEdit(t)} title="ดับเบิลคลิกเพื่อแก้ไข" className={"flex-1 break-words select-none "+(t.done?"line-through text-slate-400":"")}>{t.text}</span>}
            <button onClick={()=>cycle(t.id)} title="คลิกเพื่อเปลี่ยนความสำคัญ" className={"text-xs font-semibold px-2 py-1 rounded-full "+P[t.pri].c}>{P[t.pri].l}</button>
            <button onClick={()=>remove(t.id)} aria-label="ลบ" className="text-slate-400 hover:text-red-500 transition"><Trash2 className="w-5 h-5"/></button>
          </li>))}
      </ul>

      <div className="flex justify-between items-center mt-5 text-sm text-slate-500 dark:text-slate-400">
        <span>{left} งานที่เหลือ</span>
        <button onClick={()=>setTodos(todos.filter(t=>!t.done))} disabled={!hasDone} className="hover:text-red-500 disabled:opacity-40 disabled:hover:text-inherit transition">ลบงานที่เสร็จแล้ว</button>
      </div>
    </div>);
}

export default App;
