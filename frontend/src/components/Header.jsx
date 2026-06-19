export default function Header(){
  return (
    <header className="bg-white border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-blue-600">LinkedIn</div>
          <div className="hidden md:block">
            <input className="border rounded px-3 py-1 w-64" placeholder="Search" />
          </div>
        </div>
        <nav className="flex items-center gap-4"> 
          <a className="text-sm text-slate-600">Home</a>
          <a className="text-sm text-slate-600">My Network</a>
          <a className="text-sm text-slate-600">Jobs</a>
          <a className="text-sm text-slate-600">Messages</a>
        </nav>
      </div>
    </header>
  )
}
