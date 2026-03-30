"use client";

type Conversation = {
  id: number;
  title: string;
};

type SidebarProps = {
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
};

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
}: SidebarProps) {
  return (
    <aside className="w-72 bg-white border-r flex flex-col">
      <div className="p-4">
        <button className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium">
          + New Chat
        </button>
      </div>

      <div className="px-2 pb-4 space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`px-3 py-2 rounded-lg cursor-pointer ${
              activeId === conv.id
                ? "bg-blue-50 border border-blue-200 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            {conv.title}
          </div>
        ))}
      </div>
    </aside>
  );
}