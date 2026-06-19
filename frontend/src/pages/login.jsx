import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

export default function Login(){
  const [email, setEmail] = useState('')
  const router = useRouter()
  const submit = (e)=>{
    e.preventDefault();
    router.push('/')
  }
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={submit} className="mt-4 max-w-md">
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded mb-2" placeholder="Email" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </Layout>
  )
}
