import { QuestionData, ExamCategory } from './types'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'anthropic/claude-3-haiku'

const CATEGORY_PROMPTS: Record<ExamCategory, string> = {
  all: '語彙・文法・漢字・読解を含む多様な分野',
  語彙: '語彙（単語の意味・用法）',
  文法: '文法（助詞・接続・敬語・慣用表現）',
  読解: '読解（短文の内容理解）',
  漢字: '漢字（読み方・書き方・意味）',
}

const EXAMPLE_QUESTION = `{
  "category": "語彙",
  "question": "（　）に入る最も適切な言葉を選んでください。\n彼女はいつも笑顔で、周囲の人を（　）雰囲気を持っている。",
  "options": ["A. なごやかにする", "B. きびしくする", "C. さわがしくする", "D. くらくする"],
  "correct_answer": "A",
  "explanation": "「なごやかにする」は穏やかで和やかな雰囲気を作るという意味で、文脈に合います。"
}`

export async function generateJLPTQuestions(
  count: number,
  category: ExamCategory
): Promise<QuestionData[]> {
  const categoryDesc = CATEGORY_PROMPTS[category]

  const systemMessage = `あなたは日本語能力試験（JLPT）N2の問題作成専門家です。
問題文・選択肢・解説はすべて日本語で書いてください。
韓国語・英語・中国語など、日本語以外の言語は絶対に使用しないでください。`

  const userMessage = `${categoryDesc}に関するJLPT N2レベルの問題を${count}問作成してください。

以下のJSON配列形式のみで返答してください。他のテキストは一切含めないでください。

出力例：
[
${EXAMPLE_QUESTION}
]

条件：
- 問題・選択肢・解説はすべて日本語のみ
- N2レベルの難易度
- 選択肢は必ずA・B・C・Dの4つ
- 読解問題には短い日本語の文章を含める
- JSON形式のみ返す（前後に余分なテキスト不要）`

  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://vibe1-beta.vercel.app',
      'X-Title': 'JLPT N2 Practice',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    throw new Error(`OpenRouter API error: ${res.status}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content ?? ''

  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Failed to parse questions from AI response')

  const questions: QuestionData[] = JSON.parse(jsonMatch[0])
  return questions
}
