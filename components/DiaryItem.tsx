"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export default function DiaryItem({ entry }: { entry: DiaryEntry }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!confirm("この日記を削除しますか？")) return;
    await supabase.from("diary_entries").delete().eq("id", entry.id);
    router.refresh();
  }

  const formattedDate = new Date(entry.date + "T00:00:00").toLocaleDateString(
    "ja-JP",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900 text-sm">{entry.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{formattedDate}</p>
        </div>
        <button
          onClick={handleDelete}
          className="text-xs text-gray-300 hover:text-red-500 transition-colors"
        >
          削除
        </button>
      </div>
      <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
        {entry.content}
      </p>
    </div>
  );
}
