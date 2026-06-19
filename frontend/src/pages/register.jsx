import { useState } from 'react'
import Layout from '@/components/Layout'

export default function Register(){
  const [email, setEmail] = useState('')
  const submit = (e)=>{
    e.preventDefault();
  }
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={submit} className="mt-4 max-w-md">
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded mb-2" placeholder="Email" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </Layout>
  )
}
