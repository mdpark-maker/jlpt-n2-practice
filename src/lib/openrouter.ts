import { QuestionData, ExamCategory } from './types'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'anthropic/claude-3-haiku'

const CATEGORY_PROMPTS: Record<ExamCategory, string> = {
  all: '語彙、文法、漢字、読解を含む多様な',
  語彙: '語彙（単語の意味・用法）に関する',
  文法: '文法（助詞・接続・敬語・慣用表現）に関する',
  読解: '読解（短文の内容理解）に関する',
  漢字: '漢字（読み方・書き方・意味）に関する',
}

export async function generateJLPTQuestions(
  count: number,
  category: ExamCategory
): Promise<QuestionData[]> {
  const categoryDesc = CATEGORY_PROMPTS[category]

  const prompt = `あなたはJLPT（日本語能力試験）N2レベルの試験問題作成の専門家です。
${categoryDesc}JLPT N2レベルの問題を${count}問作成してください。

以下のJSON形式で返してください。JSONのみ返し、他のテキストは含めないでください：
[
  {
    "category": "語彙|文法|漢字|読解のいずれか",
    "question": "問題文（日本語）",
    "options": ["A. 選択肢1", "B. 選択肢2", "C. 選択肢3", "D. 選択肢4"],
    "correct_answer": "A|B|C|Dのいずれか",
    "explanation": "正解の理由の説明（日本語）"
  }
]

注意事項：
- 問題はN2レベルの難易度にしてください
- 選択肢は必ずA・B・C・Dの4つにしてください
- 読解問題の場合は短い文章を含めてください
- 説明は学習者が理解できるよう丁寧に書いてください`

  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://jlpt-practice.local',
      'X-Title': 'JLPT N2 Practice App',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    }),
  })

  if (!res.ok) {
    throw new Error(`OpenRouter API error: ${res.status}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content ?? ''

  // Extract JSON from the response
  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Failed to parse questions from AI response')

  const questions: QuestionData[] = JSON.parse(jsonMatch[0])
  return questions
}
