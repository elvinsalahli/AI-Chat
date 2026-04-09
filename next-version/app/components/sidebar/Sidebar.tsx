"use client";

type Conversation = {
  id: number;
  title: string;
};

type SidebarProps = {
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onCreate: () => void;
  onDelete: (id: number) => void;
  isCreating?: boolean;
  deletingId?: number | null;
};

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  isCreating = false,
  deletingId = null,
}: SidebarProps) {
  return (
    <aside className="w-72 bg-white border-r flex flex-col">
      <div className="p-4">
        <button
          className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium disabled:opacity-60"
          onClick={onCreate}
          disabled={isCreating}
          type="button"
        >
          {isCreating ? "Creating..." : "+ New Chat"}
        </button>
      </div>

      <div className="px-2 pb-4 space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
              activeId === conv.id
                ? "bg-blue-50 border border-blue-200 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="truncate">{conv.title}</span>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(conv.id);
              }}
              className="ml-3 text-gray-500 hover:text-red-600 disabled:opacity-50"
              disabled={deletingId === conv.id}
            >
              {deletingId === conv.id ? "..." : "×"}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}