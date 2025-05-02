import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Prismaクライアントのインスタンスを作成
const prisma = new PrismaClient();

// GET: TODOリストを全件取得
export async function GET() {
  // DBから全てのTodoを取得
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
  // JSONで返す
  return NextResponse.json(todos);
}

// POST: 新しいTODOを追加
export async function POST(req: NextRequest) {
  // リクエストボディからtitleを取得
  const { title } = await req.json();
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 });
  }
  // DBに新しいTodoを追加
  const newTodo = await prisma.todo.create({
    data: { title },
  });
  // 追加したTodoを返す
  return NextResponse.json(newTodo);
}

// PATCH: TODOの完了状態を更新
export async function PATCH(req: NextRequest) {
  // リクエストボディからidとcompletedを取得
  const { id, completed } = await req.json();
  if (typeof id !== 'number' || typeof completed !== 'boolean') {
    return NextResponse.json({ error: 'idとcompletedは必須です' }, { status: 400 });
  }
  // DBで該当TODOを更新
  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: { completed },
  });
  return NextResponse.json(updatedTodo);
} 