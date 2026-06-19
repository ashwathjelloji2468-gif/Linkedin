import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Feed from "./Feed";

export default function Layout({ children }){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-3"><LeftSidebar /></aside>
          <section className="col-span-6">{children}<Feed/></section>
          <aside className="col-span-3"><RightSidebar /></aside>
        </div>
      </main>
    </div>
  )
}
