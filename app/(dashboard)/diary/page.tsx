import { createClient } from "@/lib/supabaseServer";
import DiaryForm from "@/components/DiaryForm";
import DiaryList from "@/components/DiaryList";

export default async function DiaryPage() {
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("diary_entries")
    .select("*")
    .order("date", { ascending: false });

  const count = entries?.length ?? 0;

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Diary</h1>
          <p className="text-sm text-gray-500 mt-0.5">{count} エントリー</p>
        </div>

        <DiaryForm />
        <DiaryList entries={entries ?? []} />
      </div>
    </div>
  );
}
