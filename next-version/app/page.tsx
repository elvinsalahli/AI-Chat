import Sidebar from "./components/sidebar/Sidebar";

export default async function HomePage() {
  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar activeId={null} />

      <main className="flex-1 p-6">
        No conversations yet. Create one from the sidebar.
      </main>
    </div>
  );
}