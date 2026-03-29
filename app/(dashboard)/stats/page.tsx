import { createClient } from "@/lib/supabaseServer";

export default async function StatsPage() {
  const supabase = await createClient();

  const [{ data: todos }, { data: diaryEntries }] = await Promise.all([
    supabase.from("todos").select("id, created_at, is_completed"),
    supabase.from("diary_entries").select("id"),
  ]);

  const allTodos = todos ?? [];
  const totalTodos = allTodos.length;
  const completedTodos = allTodos.filter((t) => t.is_completed).length;
  const rate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  const totalDiary = diaryEntries?.length ?? 0;

  // Group by creation date
  const byDate: Record<string, { total: number; completed: number }> = {};
  allTodos.forEach((todo) => {
    const date = todo.created_at.split("T")[0];
    if (!byDate[date]) byDate[date] = { total: 0, completed: 0 };
    byDate[date].total++;
    if (todo.is_completed) byDate[date].completed++;
  });

  const dailyStats = Object.entries(byDate)
    .map(([date, s]) => ({
      date,
      total: s.total,
      completed: s.completed,
      rate: Math.round((s.completed / s.total) * 100),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);

  const maxTotal = Math.max(...dailyStats.map((s) => s.total), 1);

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Stats</h1>
          <p className="text-sm text-gray-500 mt-0.5">タスクと日記の記録</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Total Todos</p>
            <p className="text-2xl font-semibold text-gray-900">{totalTodos}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Completed</p>
            <p className="text-2xl font-semibold text-emerald-600">{completedTodos}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
            <p className="text-2xl font-semibold text-gray-900">{rate}%</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Diary Entries</p>
            <p className="text-2xl font-semibold text-blue-600">{totalDiary}</p>
          </div>
        </div>

        {dailyStats.length > 0 ? (
          <>
            {/* Bar chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-sm font-medium text-gray-900 mb-6">
                日別タスク作成数
              </h2>
              <div className="flex items-end gap-1.5 h-28">
                {[...dailyStats].reverse().map((stat) => (
                  <div
                    key={stat.date}
                    className="flex-1 flex flex-col items-center gap-1.5"
                  >
                    <div
                      className="w-full relative flex flex-col justify-end bg-gray-100 rounded-sm min-h-[4px]"
                      style={{
                        height: `${Math.max(
                          4,
                          (stat.total / maxTotal) * 96
                        )}px`,
                      }}
                    >
                      <div
                        className="w-full bg-emerald-500 rounded-sm"
                        style={{
                          height: `${(stat.completed / stat.total) * 100}%`,
                          minHeight: stat.completed > 0 ? "4px" : "0",
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 leading-none">
                      {stat.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                  <span className="text-xs text-gray-500">完了</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-gray-100 rounded-sm border border-gray-200" />
                  <span className="text-xs text-gray-500">未完了</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-medium text-gray-900">日別タスク記録</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">日付</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">作成</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">完了</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">達成率</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyStats.map((stat, i) => (
                    <tr
                      key={stat.date}
                      className={
                        i < dailyStats.length - 1 ? "border-b border-gray-50" : ""
                      }
                    >
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {new Date(stat.date + "T00:00:00").toLocaleDateString(
                          "ja-JP",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700 text-right">
                        {stat.total}
                      </td>
                      <td className="px-6 py-3 text-sm text-emerald-600 text-right font-medium">
                        {stat.completed}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            stat.rate >= 80
                              ? "bg-emerald-50 text-emerald-700"
                              : stat.rate >= 50
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {stat.rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <p className="text-gray-400 text-sm">
              データがありません。Todoを追加してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
