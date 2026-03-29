"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type Todo = {
  id: string;
  title: string;
  is_completed: boolean;
};

export default function TodoItem({ todo }: { todo: Todo }) {
  const router = useRouter();
  const supabase = createClient();

  async function toggleComplete() {
    await supabase
      .from("todos")
      .update({ is_completed: !todo.is_completed })
      .eq("id", todo.id);
    router.refresh();
  }

  async function deleteTodo() {
    await supabase.from("todos").delete().eq("id", todo.id);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <input
        type="checkbox"
        checked={todo.is_completed}
        onChange={toggleComplete}
        className="w-4 h-4 accent-emerald-500 cursor-pointer"
      />
      <span
        className={`flex-1 text-gray-700 ${
          todo.is_completed ? "line-through text-gray-400" : ""
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={deleteTodo}
        className="text-sm text-red-400 hover:text-red-600 transition-colors"
      >
        削除
      </button>
    </div>
  );
}
