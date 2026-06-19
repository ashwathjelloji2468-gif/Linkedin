export default function LeftSidebar(){
  return (
    <div>
      <div className="bg-white p-4 rounded mb-4">
        <div className="font-medium">Your Profile</div>
        <div className="text-sm text-slate-500">View and edit profile</div>
      </div>
      <div className="bg-white p-4 rounded">
        <div className="font-medium mb-2">Quick Access</div>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>Connections</li>
          <li>Groups</li>
          <li>Events</li>
        </ul>
      </div>
    </div>
  )
}
