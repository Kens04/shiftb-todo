import { createClient } from "@/lib/supabaseServer";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

export default async function TodosPage() {
  const supabase = await createClient();

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  const total = todos?.length ?? 0;
  const completed = todos?.filter((t) => t.is_completed).length ?? 0;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Todos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {completed} / {total} 完了
          </p>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="mb-6 bg-gray-200 rounded-full h-1">
            <div
              className="bg-emerald-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${rate}%` }}
            />
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-2xl font-semibold text-gray-900">{total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Completed</p>
            <p className="text-2xl font-semibold text-emerald-600">{completed}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Rate</p>
            <p className="text-2xl font-semibold text-gray-900">{rate}%</p>
          </div>
        </div>

        <TodoForm />
        <TodoList todos={todos ?? []} />
      </div>
    </div>
  );
}
