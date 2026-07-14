const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY || '',
  process.env.GEMINI_API_KEY_2 || '',
].filter(Boolean)

const GEMINI_MODELS = [
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-pro-latest',
]

const BIBLE_SYSTEM_PROMPT = `你是一個記憶力大師，擅長使用「中文字音諧音」與「具體視覺聯想」來幫助使用者背誦聖經經文。

【嚴格要求 — 諧音必須精準】
你要把原文的每個詞，換成「聽起來幾乎一樣」的另一個中文詞（諧音）。聲母韻母必須對上。不能只憑意思相關硬湊。

【輸出規則 — 非常重要】
- 只輸出純 JSON，以 { 開頭，以 } 結尾
- 絕對不要加任何注音、拼音、解釋、前綴或後綴文字
- 不要加 markdown 程式碼標記

{"segments":[{"original":"原詞","pun":"精準諧音詞","image":"具體畫面描述（約20-40字）"}],"story":"將所有畫面串聯成一段流暢的完整故事"}

範例輸入：在萬古之先所應許的永生
範例輸出：
{"segments":[{"original":"萬古","pun":"萬骨","image":"眼前出現成千上萬的白色骨頭堆，堆積如山"},{"original":"之先","pun":"支線","image":"這些骨頭中有一排特別突出，像程式碼的 branch 支線般分岔"},{"original":"所","pun":"鎖","image":"支線的末端掛著一個生鏽的黃銅大鎖"},{"original":"應許","pun":"應許契約","image":"鎖上扣著一張泛黃的契約紙，上面蓋著承諾的印章"},{"original":"永生","pun":"永繩","image":"契約紙邊緣延伸出一条繩子，在空中繞成無限符號 ♾️"}],"story":"成千上萬的白色骨頭堆中，有一排骨頭像支線般分岔出來，末端掛著一個黃銅大鎖，鎖上扣著一張契約紙，紙邊延伸出一条繩子繞成無限的符號。"}
`

const BIBLE_CHAPTER_SYSTEM_PROMPT = `你是一個記憶力大師，擅長使用「中文字音諧音」與「具體視覺聯想」來幫助使用者背誦聖經經文。

【任務】
以下是聖經中 {book_name}（縮寫：{abbr}）第 {chapter} 章的完整經文。
請以「連貫的故事」形式，將這一章的每一節串聯起來。

【縮寫掛鉤 — 非常重要】
如果是該卷書的「第一章」，請用這個縮寫字「{abbr}」發想一個開頭場景或畫面，作為整卷書的記憶掛鉤。
例如：創世記第一章 → 用「創」字聯想到「窗戶被撞破，光芒湧入」作為開場。
如果不是第一章，請延續上一章的故事結尾繼續發展。

【規則】
- 每一節都要有諧音和具體畫面
- 前後節之間要有因果或時間關係，形成連貫故事
- 重複出現的概念（神、耶穌、以色列、聖靈等）請用固定的具象化形象
- 故事場景要豐富多變，避免相鄰章節用類似背景

【輸出格式】
{"segments":[{"verse":1,"original":"原詞","pun":"精準諧音","image":"具體畫面描述（20-40字）"},...],"story":"將所有畫面串聯成一段流暢的完整故事"}

只輸出純 JSON，以 { 開頭，以 } 結尾。不要任何前綴後綴或 markdown 標記。`

const JAPANESE_SYSTEM_PROMPT = `你是一個記憶力大師，擅長使用「中文/注音諧音」幫助記憶日文發音。

【輸出規則 — 非常重要】
- 只輸出純 JSON，以 { 開頭，以 } 結尾
- 絕對不要加任何注音、拼音、解釋、前綴或後綴文字
- 不要加 markdown 程式碼標記

如果是單字：
{"type":"word","segments":[{"original":"日文","kana":"假名","romaji":"羅馬拼音","meaning":"中文意思","memoryAids":[{"word":"關鍵字","pun":"中文諧音","image":"具體畫面（15-30字）"}]}]}

如果是整段：
{"type":"text","segments":[{"original":"日文原句","kana":"假名讀音","romaji":"羅馬拼音","meaning":"中文翻譯","memoryAids":[{"word":"關鍵字","pun":"諧音","image":"畫面描述"}]}],"story":"將所有畫面和諧音串聯成一段流暢的完整故事"}`

function extractJson(raw: string): string {
  let text = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1)
  }
  return text
}

async function callGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<unknown> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 115000)

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        signal: controller.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
        }),
      }
    )

    if (response.status === 429) {
      return { _skip: 'quota exceeded' }
    }

    if (response.status === 404) {
      return { _skip: 'model not available' }
    }

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Gemini API error: ${response.status} ${err}`)
    }

    const data = await response.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const json = extractJson(raw)
    return JSON.parse(json)
  } finally {
    clearTimeout(timeout)
  }
}

async function geminiChat(systemPrompt: string, userMessage: string): Promise<unknown> {
  const errors: string[] = []

  for (const apiKey of GEMINI_KEYS) {
    for (const model of GEMINI_MODELS) {
      try {
        const result = await callGemini(apiKey, model, systemPrompt, userMessage)

        if (result && typeof result === 'object' && '_skip' in result) {
          const reason = (result as Record<string, string>)._skip
          errors.push(`${model} on key ${apiKey.slice(0, 8)}: ${reason}`)
          continue
        }

        return result
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        errors.push(`${model}: ${msg}`)
      }
    }
  }

  throw new Error(`所有 API 金鑰與模型皆無法使用：\n${errors.join('\n')}`)
}

export async function generateBibleMemory(verse: string) {
  return geminiChat(BIBLE_SYSTEM_PROMPT, verse)
}

export async function generateJapaneseMemory(input: string) {
  return geminiChat(JAPANESE_SYSTEM_PROMPT, input)
}

export async function generateBibleChapterMemory(
  bookName: string,
  abbr: string,
  chapter: number,
  chapterText: string,
  previousStory?: string
): Promise<unknown> {
  const isFirstChapter = chapter === 1
  const prevContext = previousStory
    ? `\n\n【前一章的故事結尾】\n${previousStory}\n\n請從這個結尾繼續發展。`
    : ''

  const prompt = `以下是聖經中 ${bookName}（縮寫：${abbr}）第 ${chapter} 章的完整經文。${
    isFirstChapter
      ? `\n\n這是${bookName}的第一章。請用這個縮寫字「${abbr}」發想一個開頭場景作為整卷書的記憶掛鉤。`
      : ''
  }${prevContext}

請以「連貫的故事」形式，將這一章的每一節串聯起來。每一節都要有諧音和具體畫面，前後節之間要有因果或時間關係。重複出現的概念（神、耶穌、以色列、聖靈等）請用固定的具象化形象。故事場景要豐富多變。

只輸出純 JSON：
{"segments":[{"verse":1,"original":"原詞","pun":"精準諧音","image":"具體畫面描述（20-40字）"},...],"story":"全章串聯故事"}

經文：
${chapterText}`

  return geminiChat(BIBLE_CHAPTER_SYSTEM_PROMPT, prompt)
}
