"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

// Todo型の定義
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // TODO一覧をAPIから取得
  const fetchTodos = async () => {
    setLoading(true);
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // TODO追加
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });
    setInput("");
    fetchTodos();
  };

  // TODOの完了状態を更新
  const toggleCompleted = async (id: number, completed: boolean) => {
    setLoading(true);
    await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed }),
    });
    fetchTodos();
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">TODOアプリ</h1>
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="新しいタスクを入力"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            追加
          </Button>
        </form>
        <div>
          {loading ? (
            <div>読み込み中...</div>
          ) : todos.length === 0 ? (
            <div className="text-gray-500">タスクはありません</div>
          ) : (
            <ul className="space-y-2">
              {todos.map(todo => (
                <li key={todo.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={checked => toggleCompleted(todo.id, Boolean(checked))}
                  />
                  <span className={todo.completed ? "line-through text-gray-400" : ""}>{todo.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
