import Layout from "@/components/Layout";
import LeftSidebar from "@/components/LeftSidebar";
import Feed from "@/components/Feed";
import RightSidebar from "@/components/RightSidebar";

export default function Home() {
  return (
    <Layout>
      <div className="grid grid-cols-12 gap-5 items-start">
        {/* Left Sidebar Widget */}
        <aside className="col-span-12 md:col-span-3">
          <LeftSidebar />
        </aside>

        {/* Center Main Feed */}
        <section className="col-span-12 md:col-span-6">
          <Feed />
        </section>

        {/* Right Sidebar Widget */}
        <aside className="col-span-12 md:col-span-3 hidden md:block">
          <RightSidebar />
        </aside>
      </div>
    </Layout>
  );
}
