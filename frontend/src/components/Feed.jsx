import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import api from "@/config";
import { addPost } from "@/config/redux/reducer/postReducer";

export default function Feed(){
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const reduxPosts = useSelector((s)=>s.posts.items);
  const dispatch = useDispatch();

  useEffect(()=>{
    let mounted = true;
    const load = async ()=>{
      try{
        const res = await api.get('/posts');
        if(mounted) setPosts(res.data || []);
      }catch(err){
        // fallback sample
        if(mounted) setPosts(["Welcome to the LinkedIn clone feed"]);
      }finally{ if(mounted) setLoading(false) }
    }
    load();
    return ()=> mounted = false;
  },[]);

  const handlePost = async (text) =>{
    try{
      const res = await api.post('/posts', { text });
      // optimistic: prepend returned post or text
      setPosts(prev => [(res.data && res.data.post) || { text, author: 'You' }, ...prev]);
      dispatch(addPost({ id: Date.now(), text, author: 'You' }));
    }catch(err){
      setPosts(prev => ([{ text, author: 'You (local)' }, ...prev]));
    }
  }

  if(loading) return <div>Loading feed...</div>;

  return (
    <div>
      <PostComposer onPost={handlePost} />
      {posts.map((p, i)=> (
        <div key={i} className="bg-white p-4 rounded mb-4">
          <div className="font-medium">{p.author || 'You'}</div>
          <div className="mt-2">{p.text || p}</div>
        </div>
      ))}
    </div>
  )
}
