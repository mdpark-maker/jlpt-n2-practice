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

  const prompt = `You are an expert JLPT N2 exam question creator. Create ${count} questions about ${categoryDesc} at JLPT N2 level.

CRITICAL LANGUAGE REQUIREMENT: ALL question text, answer options, and explanations MUST be written entirely in Japanese (日本語). Do NOT use Korean, English, or any other language in the question, options, or explanation fields.

Return ONLY a JSON array in this exact format, with no other text:
[
  {
    "category": "語彙 or 文法 or 漢字 or 読解",
    "question": "日本語の問題文（Japanese only）",
    "options": ["A. 日本語の選択肢", "B. 日本語の選択肢", "C. 日本語の選択肢", "D. 日本語の選択肢"],
    "correct_answer": "A or B or C or D",
    "explanation": "日本語の解説（Japanese only）"
  }
]

Requirements:
- N2 difficulty level
- Exactly 4 options labeled A, B, C, D
- For 読解 questions, include a short Japanese passage
- All text in Japanese only — never Korean, never English`

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
      messages: [
        {
          role: 'system',
          content: 'You are a JLPT Japanese language exam expert. You MUST write all question text, answer options, and explanations in Japanese (日本語) only. Never use Korean (한국어), English, or any other language in your output.',
        },
        { role: 'user', content: prompt },
      ],
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
