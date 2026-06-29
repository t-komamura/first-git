import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { PARSE_TEXT_MAX } from '@/lib/validation'

export const maxDuration = 30

const CATEGORIES = ['鍋', 'パスタ', '肉料理', '魚料理', 'サラダ', '麺類', '炒め物', 'スープ・汁物', 'ご飯もの', 'おつまみ', 'スイーツ']

export async function POST(req: NextRequest) {
  const { text, mode } = await req.json()
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'text is required' }, { status: 400 })
  }
  if (text.length > PARSE_TEXT_MAX) {
    return NextResponse.json({ error: `テキストが長すぎます（最大${PARSE_TEXT_MAX}文字）` }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_AI_API_KEY is not set' }, { status: 500 })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  // mode: 'dish'（親料理）か 'variation'（バリエーション）
  const isDish = mode === 'dish'
  const shape = isDish
    ? `{
  "title": "料理名（例: 鶏の照り焼き）",
  "category": "${CATEGORIES.join(' / ')} のいずれか、なければ空文字",
  "name": "このレシピのバリエーション名（タレや味付けの特徴、例: 醤油＋みりん）",
  "ingredients": [{"name": "食材名", "amount": "分量"}],
  "steps": [{"order": 1, "text": "手順"}]
}`
    : `{
  "name": "このバリエーションの名前（味付けの特徴、例: 塩レモン）",
  "ingredients": [{"name": "食材名", "amount": "分量"}],
  "steps": [{"order": 1, "text": "手順"}]
}`

  const prompt = `あなたはレシピ解析アシスタントです。以下のテキストを解析し、指定のJSON形式のみを返してください。
JSON以外の説明やコードブロック記号は一切出力しないでください。

出力形式:
${shape}

--- 解析対象のテキスト ---
${text}`

  try {
    const result = await model.generateContent(prompt)
    let responseText = result.response.text().trim()
    // 念のためコードブロック記号を除去
    responseText = responseText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim()
    const parsed = JSON.parse(responseText)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'パースに失敗しました' }, { status: 500 })
  }
}
