import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  const { text } = await req.json()
  if (!text) return NextResponse.json({ error: 'text is required' }, { status: 400 })

  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_AI_API_KEY is not set' }, { status: 500 })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `以下のテキストはレシピの説明です。これを解析して以下のJSON形式で返してください。
JSONのみを返し、説明やコードブロックは不要です。

{
  "title": "料理名",
  "description": "一言説明（任意）",
  "category": "和食 or 洋食 or 中華 or おつまみ or スイーツ or その他",
  "ingredients": [{"name": "食材名", "amount": "分量"}],
  "steps": [{"order": 1, "text": "手順の説明"}],
  "tags": "タグ1,タグ2"
}

テキスト:
${text}`

  try {
    const result = await model.generateContent(prompt)
    const responseText = result.response.text().trim()
    const parsed = JSON.parse(responseText)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'パースに失敗しました' }, { status: 500 })
  }
}
