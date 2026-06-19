export default function PostCard({ post }){
  return (
    <div className="bg-white p-4 rounded mb-4">
      <div className="font-medium">{post.author || 'You'}</div>
      <div className="mt-2">{post.text}</div>
    </div>
  )
}
