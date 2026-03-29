import DiaryItem from "@/components/DiaryItem";

type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export default function DiaryList({ entries }: { entries: DiaryEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">日記がありません。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <DiaryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
