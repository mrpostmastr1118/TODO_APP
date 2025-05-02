"use client"

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TodoItem from "./todo-item"

export type Todo = {
  id: string
  text: string
  completed: boolean
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Load todos from localStorage if available
    if (typeof window !== "undefined") {
      const savedTodos = localStorage.getItem("todos")
      return savedTodos ? JSON.parse(savedTodos) : []
    }
    return []
  })

  const [newTodo, setNewTodo] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() === "") return

    const newItem: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
    }

    setTodos([...todos, newItem])
    setNewTodo("")
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const filteredTodos = todos.filter((todo) => {
    if (activeTab === "active") return !todo.completed
    if (activeTab === "completed") return todo.completed
    return true
  })

  const activeTodosCount = todos.filter((todo) => !todo.completed).length

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="新しいタスクを追加"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTodo()
            }}
            className="flex-1"
          />
          <Button onClick={addTodo} size="icon" variant="outline">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">すべて</TabsTrigger>
            <TabsTrigger value="active">未完了</TabsTrigger>
            <TabsTrigger value="completed">完了済み</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-2">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">タスクがありません</p>
            )}
          </TabsContent>
          <TabsContent value="active" className="space-y-2">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">未完了のタスクがありません</p>
            )}
          </TabsContent>
          <TabsContent value="completed" className="space-y-2">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">完了済みのタスクがありません</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2">
        <p className="text-sm text-gray-500">{activeTodosCount} 件の未完了タスク</p>
      </CardFooter>
    </Card>
  )
}
