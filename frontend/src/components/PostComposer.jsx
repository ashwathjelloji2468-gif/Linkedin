import { useState } from "react";

export default function PostComposer({ onPost }){
  const [text, setText] = useState("");
  const submit = (e) =>{
    e.preventDefault();
    if(!text.trim()) return;
    onPost && onPost(text.trim());
    setText("");
  }
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded mb-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full border rounded p-2" rows={3} placeholder="Start a post" />
      <div className="mt-2 text-right">
        <button className="bg-blue-600 text-white px-4 py-1 rounded">Post</button>
      </div>
    </form>
  )
}
