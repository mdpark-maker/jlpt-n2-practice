import { jsonrepair } from 'jsonrepair'
import { QuestionData, ExamCategory, ExamLevel } from './types'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'anthropic/claude-3-haiku'

const N2_CATEGORY_FOCUS: Record<ExamCategory, string> = {
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

const N3_CATEGORY_FOCUS: Record<ExamCategory, string> = {
  all: '語彙・文法・漢字・読解をバランスよく含む（N3レベル）',
  語彙: `語彙（N3レベルの頻出語彙）：
    - 日常生活で使う動詞・形容詞の意味と使い方
    - 類義語の使い分け（例：「変える」vs「変わる」）
    - N3レベルのことわざ・慣用句（七転び八起き など）
    - 接続詞・副詞の使い分け（でも/しかし/ところが など）
    - 複合語・派生語（〜中・〜代・〜的 など）`,
  文法: `文法（N3頻出文型から出題）：
    - 〜てしまう・〜てみる・〜ておく
    - 〜ために・〜ように・〜のに
    - 〜ば〜ほど・〜たら・〜なら
    - 〜はずだ・〜そうだ・〜らしい・〜ようだ
    - 〜てあげる・〜てもらう・〜てくれる
    - 〜ながら・〜あいだに・〜まで`,
  読解: `読解（200〜300字の短文で内容理解問題）：
    - トピック：日常生活・学校・仕事・趣味・人間関係
    - 問題形式：文章の要旨・内容の正誤・語句の意味
    - 案内文・メール・お知らせの読み取り問題も含む`,
  漢字: `漢字（N3レベルの常用漢字 650字程度）：
    - 基本的な音読み・訓読み（例：「明日」「今日」の読み方）
    - 同音異字（例：「きく」→ 聞く・聴く・効く）
    - 日常頻出の熟語（約束・経験・注意・説明 など）
    - ひらがな→漢字の変換（N3頻出漢字）`,
}

export async function generateJLPTQuestions(
  count: number,
  category: ExamCategory,
  level: ExamLevel = 'n2'
): Promise<QuestionData[]> {
  const focusMap = level === 'n3' ? N3_CATEGORY_FOCUS : N2_CATEGORY_FOCUS
  const focus = focusMap[category]
  const levelLabel = level === 'n3' ? 'N3' : 'N2'

  const systemMessage = `あなたは日本語能力試験（JLPT）${levelLabel}の問題作成の専門家です。
実際の${levelLabel}試験で出題される頻度の高いパターンに基づいて問題を作成してください。
問題文・選択肢は日本語で書いてください。解説は日本語（explanation）と韓国語（explanation_ko）の両方で書いてください。`

  const userMessage = `${focus}に関するJLPT ${levelLabel}レベルの問題を${count}問作成してください。

以下の条件を守ってください：
- 実際のJLPT ${levelLabel}試験に出やすい頻出パターン・語彙・文法を選ぶ
- 問題・選択肢はすべて日本語
- 選択肢はA〜Dの4択で、紛らわしい誤答を設定する
- explanationには日本語で解説（なぜ他の選択肢が間違いかも含める）
- explanation_koには同じ内容を韓国語で解説
- 読解問題の場合は必ず${level === 'n3' ? '200〜300' : '300〜400'}字の文章を問題文に含める

以下のJSON配列形式のみで返答してください（前後に余分なテキスト不要）：
[
  {
    "category": "語彙 or 文法 or 漢字 or 読解",
    "question": "問題文（読解の場合は本文＋設問）",
    "options": ["A. 選択肢", "B. 選択肢", "C. 選択肢", "D. 選択肢"],
    "correct_answer": "A or B or C or D",
    "explanation": "正解の理由と他の選択肢が誤りである理由（日本語）",
    "explanation_ko": "정답의 이유와 다른 선택지가 틀린 이유（한국어）"
  }
]`

  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://vibe1-beta.vercel.app',
      'X-Title': `JLPT ${levelLabel} Practice`,
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

  let questions: QuestionData[]
  try {
    // First pass: escape literal control chars inside JSON strings
    const sanitized = jsonMatch[0].replace(/"(?:[^"\\]|\\.)*"/g, (match: string) =>
      match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
    )
    questions = JSON.parse(sanitized)
  } catch {
    // Fallback: use jsonrepair which handles unescaped quotes, trailing commas, etc.
    const repaired = jsonrepair(jsonMatch[0])
    questions = JSON.parse(repaired)
  }
  return questions
}
