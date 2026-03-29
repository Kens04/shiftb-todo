import TodoItem from "@/components/TodoItem";

type Todo = {
  id: string;
  title: string;
  is_completed: boolean;
};

export default function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8">Todoがありません。</p>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
