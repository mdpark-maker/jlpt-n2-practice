import { QuestionData, ExamCategory } from './types'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'anthropic/claude-3-haiku'

const CATEGORY_FOCUS: Record<ExamCategory, string> = {
  all: '語彙・文法・漢字・読解をバランスよく含む',
  語彙: `語彙（以下の高頻度トピックから出題）：
    - 類義語・対義語の使い分け（例：「断る」vs「拒否する」）
    - 〜的・〜性・〜化・〜感など接辞を使った名詞
    - 副詞の使い分け（かなり/相当/非常に/著しく など）
    - コロケーション（動詞＋名詞の自然な組み合わせ）
    - ことわざ・慣用句（石の上にも三年 など）`,
  文法: `文法（N2頻出文型から出題）：
    - 逆接：〜ものの・〜にもかかわらず・〜とはいえ
    - 理由・強調：〜からこそ・〜だけに・〜だけあって
    - 条件：〜さえ〜ば・〜ない限り・〜に応じて
    - 対比：〜に対して・〜に反して・〜と比べて
    - 時・変化：〜にしたがって・〜につれて・〜とともに
    - その他頻出：〜わけにはいかない・〜に違いない・〜に過ぎない・〜をはじめ・〜に至って`,
  読解: `読解（300〜400字の短文で内容理解問題）：
    - トピック：環境・社会問題・テクノロジー・ビジネス・日常生活
    - 問題形式：文章の主旨・筆者の意見・語句の意味・文章構造
    - 接続詞・指示語の役割を問う問題も含む`,
  漢字: `漢字（N2レベル常用漢字）：
    - 音読み・訓読みの使い分け（例：「上手」の読み方）
    - 同訓異字（例：「はかる」→ 測る・計る・量る・図る）
    - 熟語の読み方・意味（例：「懸念」「概要」「貢献」）
    - 漢字の書き方（ひらがな→漢字）`,
}

export async function generateJLPTQuestions(
  count: number,
  category: ExamCategory
): Promise<QuestionData[]> {
  const focus = CATEGORY_FOCUS[category]

  const systemMessage = `あなたは日本語能力試験（JLPT）N2の問題作成の専門家です。
実際のN2試験で出題される頻度の高いパターンに基づいて問題を作成してください。
問題文・選択肢・解説はすべて日本語で書いてください。他の言語は使用しないでください。`

  const userMessage = `${focus}に関するJLPT N2レベルの問題を${count}問作成してください。

以下の条件を守ってください：
- 実際のJLPT N2試験に出やすい頻出パターン・語彙・文法を選ぶ
- 問題・選択肢・解説はすべて日本語のみ
- 選択肢はA〜Dの4択で、紛らわしい誤答を設定する
- 解説には「なぜ他の選択肢が間違いか」も簡潔に含める
- 読解問題の場合は必ず300〜400字の文章を問題文に含める

以下のJSON配列形式のみで返答してください（前後に余分なテキスト不要）：
[
  {
    "category": "語彙 or 文法 or 漢字 or 読解",
    "question": "問題文（読解の場合は本文＋設問）",
    "options": ["A. 選択肢", "B. 選択肢", "C. 選択肢", "D. 選択肢"],
    "correct_answer": "A or B or C or D",
    "explanation": "正解の理由と他の選択肢が誤りである理由"
  }
]`

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

  // Escape literal control characters inside JSON string values
  const sanitized = jsonMatch[0].replace(/"(?:[^"\\]|\\.)*"/g, (match: string) =>
    match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
  )

  const questions: QuestionData[] = JSON.parse(sanitized)
  return questions
}
