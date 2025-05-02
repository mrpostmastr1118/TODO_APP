"use client"

import { Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { Todo } from "./todo-app"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm">
      <div className="flex items-center space-x-3">
        <Checkbox id={`todo-${todo.id}`} checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`text-sm font-medium ${todo.completed ? "line-through text-gray-400" : "text-gray-700"}`}
        >
          {todo.text}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="h-8 w-8 text-gray-500 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">削除</span>
      </Button>
    </div>
  )
}
