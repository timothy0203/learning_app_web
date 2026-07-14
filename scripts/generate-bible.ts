/**
 * 批次產生全部聖經章節的記憶故事
 * 先新約再舊約，支援中斷續傳
 *
 * 用法：
 *   npx tsx scripts/generate-bible.ts
 *
 * 環境變數（從 .env.local 讀取）：
 *   GEMINI_API_KEY, GEMINI_API_KEY_2
 *   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

function loadEnv() {
  const envPath = resolve(import.meta.dirname, '../.env.local')
  const content = readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
const geminiKeys = [
  process.env.GEMINI_API_KEY || '',
  process.env.GEMINI_API_KEY_2 || '',
].filter(Boolean)

const GEMINI_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-pro-latest',
]

interface BibleBook {
  id: string
  name: string
  apiName: string
  abbr: string
  chapters: number
  testament: 'nt' | 'ot'
}

const BIBLE_BOOKS: BibleBook[] = [
  { id: 'MAT', name: '馬太福音', apiName: '馬太福音', abbr: '太', chapters: 28, testament: 'nt' },
  { id: 'MRK', name: '馬可福音', apiName: '馬可福音', abbr: '可', chapters: 16, testament: 'nt' },
  { id: 'LUK', name: '路加福音', apiName: '路加福音', abbr: '路', chapters: 24, testament: 'nt' },
  { id: 'JHN', name: '約翰福音', apiName: '約翰福音', abbr: '約', chapters: 21, testament: 'nt' },
  { id: 'ACT', name: '使徒行傳', apiName: '使徒行傳', abbr: '徒', chapters: 28, testament: 'nt' },
  { id: 'ROM', name: '羅馬書', apiName: '羅馬書', abbr: '羅', chapters: 16, testament: 'nt' },
  { id: '1CO', name: '哥林多前書', apiName: '哥林多前書', abbr: '林前', chapters: 16, testament: 'nt' },
  { id: '2CO', name: '哥林多後書', apiName: '哥林多後書', abbr: '林後', chapters: 13, testament: 'nt' },
  { id: 'GAL', name: '加拉太書', apiName: '加拉太書', abbr: '加', chapters: 6, testament: 'nt' },
  { id: 'EPH', name: '以弗所書', apiName: '以弗所書', abbr: '弗', chapters: 6, testament: 'nt' },
  { id: 'PHP', name: '腓立比書', apiName: '腓立比書', abbr: '腓', chapters: 4, testament: 'nt' },
  { id: 'COL', name: '歌羅西書', apiName: '歌羅西書', abbr: '西', chapters: 4, testament: 'nt' },
  { id: '1TH', name: '帖撒羅尼迦前書', apiName: '帖撒羅尼迦前書', abbr: '帖前', chapters: 5, testament: 'nt' },
  { id: '2TH', name: '帖撒羅尼迦後書', apiName: '帖撒羅尼迦後書', abbr: '帖後', chapters: 3, testament: 'nt' },
  { id: '1TI', name: '提摩太前書', apiName: '提摩太前書', abbr: '提前', chapters: 6, testament: 'nt' },
  { id: '2TI', name: '提摩太後書', apiName: '提摩太後書', abbr: '提後', chapters: 4, testament: 'nt' },
  { id: 'TIT', name: '提多書', apiName: '提多書', abbr: '多', chapters: 3, testament: 'nt' },
  { id: 'PHM', name: '腓利門書', apiName: '腓利門書', abbr: '門', chapters: 1, testament: 'nt' },
  { id: 'HEB', name: '希伯來書', apiName: '希伯來書', abbr: '來', chapters: 13, testament: 'nt' },
  { id: 'JAS', name: '雅各書', apiName: '雅各書', abbr: '雅', chapters: 5, testament: 'nt' },
  { id: '1PE', name: '彼得前書', apiName: '彼得前書', abbr: '彼前', chapters: 5, testament: 'nt' },
  { id: '2PE', name: '彼得後書', apiName: '彼得後書', abbr: '彼後', chapters: 3, testament: 'nt' },
  { id: '1JN', name: '約翰一書', apiName: '約翰一書', abbr: '約壹', chapters: 5, testament: 'nt' },
  { id: '2JN', name: '約翰二書', apiName: '約翰二書', abbr: '約貳', chapters: 1, testament: 'nt' },
  { id: '3JN', name: '約翰三書', apiName: '約翰三書', abbr: '約參', chapters: 1, testament: 'nt' },
  { id: 'JUD', name: '猶大書', apiName: '猶大書', abbr: '猶', chapters: 1, testament: 'nt' },
  { id: 'REV', name: '啟示錄', apiName: '啟示錄', abbr: '啟', chapters: 22, testament: 'nt' },
  { id: 'GEN', name: '創世記', apiName: '創世記', abbr: '創', chapters: 50, testament: 'ot' },
  { id: 'EXO', name: '出埃及記', apiName: '出埃及記', abbr: '出', chapters: 40, testament: 'ot' },
  { id: 'LEV', name: '利未記', apiName: '利未記', abbr: '利', chapters: 27, testament: 'ot' },
  { id: 'NUM', name: '民數記', apiName: '民數記', abbr: '民', chapters: 36, testament: 'ot' },
  { id: 'DEU', name: '申命記', apiName: '申命記', abbr: '申', chapters: 34, testament: 'ot' },
  { id: 'JOS', name: '約書亞記', apiName: '約書亞記', abbr: '書', chapters: 24, testament: 'ot' },
  { id: 'JDG', name: '士師記', apiName: '士師記', abbr: '士', chapters: 21, testament: 'ot' },
  { id: 'RUT', name: '路得記', apiName: '路得記', abbr: '得', chapters: 4, testament: 'ot' },
  { id: '1SA', name: '撒母耳記上', apiName: '撒母耳記上', abbr: '撒上', chapters: 31, testament: 'ot' },
  { id: '2SA', name: '撒母耳記下', apiName: '撒母耳記下', abbr: '撒下', chapters: 24, testament: 'ot' },
  { id: '1KI', name: '列王紀上', apiName: '列王紀上', abbr: '王上', chapters: 22, testament: 'ot' },
  { id: '2KI', name: '列王紀下', apiName: '列王紀下', abbr: '王下', chapters: 25, testament: 'ot' },
  { id: '1CH', name: '歷代志上', apiName: '歷代志上', abbr: '代上', chapters: 29, testament: 'ot' },
  { id: '2CH', name: '歷代志下', apiName: '歷代志下', abbr: '代下', chapters: 36, testament: 'ot' },
  { id: 'EZR', name: '以斯拉記', apiName: '以斯拉記', abbr: '拉', chapters: 10, testament: 'ot' },
  { id: 'NEH', name: '尼希米記', apiName: '尼希米記', abbr: '尼', chapters: 13, testament: 'ot' },
  { id: 'EST', name: '以斯帖記', apiName: '以斯帖記', abbr: '斯', chapters: 10, testament: 'ot' },
  { id: 'JOB', name: '約伯記', apiName: '約伯記', abbr: '伯', chapters: 42, testament: 'ot' },
  { id: 'PSA', name: '詩篇', apiName: '詩篇', abbr: '詩', chapters: 150, testament: 'ot' },
  { id: 'PRO', name: '箴言', apiName: '箴言', abbr: '箴', chapters: 31, testament: 'ot' },
  { id: 'ECC', name: '傳道書', apiName: '傳道書', abbr: '傳', chapters: 12, testament: 'ot' },
  { id: 'SNG', name: '雅歌', apiName: '雅歌', abbr: '歌', chapters: 8, testament: 'ot' },
  { id: 'ISA', name: '以賽亞書', apiName: '以賽亞書', abbr: '賽', chapters: 66, testament: 'ot' },
  { id: 'JER', name: '耶利米書', apiName: '耶利米書', abbr: '耶', chapters: 52, testament: 'ot' },
  { id: 'LAM', name: '耶利米哀歌', apiName: '耶利米哀歌', abbr: '哀', chapters: 5, testament: 'ot' },
  { id: 'EZK', name: '以西結書', apiName: '以西結書', abbr: '結', chapters: 48, testament: 'ot' },
  { id: 'DAN', name: '但以理書', apiName: '但以理書', abbr: '但', chapters: 12, testament: 'ot' },
  { id: 'HOS', name: '何西阿書', apiName: '何西阿書', abbr: '何', chapters: 14, testament: 'ot' },
  { id: 'JOL', name: '約珥書', apiName: '約珥書', abbr: '珥', chapters: 3, testament: 'ot' },
  { id: 'AMO', name: '阿摩司書', apiName: '阿摩司書', abbr: '摩', chapters: 9, testament: 'ot' },
  { id: 'OBA', name: '俄巴底亞書', apiName: '俄巴底亞書', abbr: '俄', chapters: 1, testament: 'ot' },
  { id: 'JON', name: '約拿書', apiName: '約拿書', abbr: '拿', chapters: 4, testament: 'ot' },
  { id: 'MIC', name: '彌迦書', apiName: '彌迦書', abbr: '彌', chapters: 7, testament: 'ot' },
  { id: 'NAM', name: '那鴻書', apiName: '那鴻書', abbr: '鴻', chapters: 3, testament: 'ot' },
  { id: 'HAB', name: '哈巴谷書', apiName: '哈巴谷書', abbr: '哈', chapters: 3, testament: 'ot' },
  { id: 'ZEP', name: '西番雅書', apiName: '西番雅書', abbr: '番', chapters: 3, testament: 'ot' },
  { id: 'HAG', name: '哈該書', apiName: '哈該書', abbr: '該', chapters: 2, testament: 'ot' },
  { id: 'ZEC', name: '撒迦利亞書', apiName: '撒迦利亞書', abbr: '亞', chapters: 14, testament: 'ot' },
  { id: 'MAL', name: '瑪拉基書', apiName: '瑪拉基書', abbr: '瑪', chapters: 4, testament: 'ot' },
]

const CHAPTER_PROMPT = `你是一個記憶力大師，擅長使用「中文字音諧音」與「具體視覺聯想」來幫助使用者背誦聖經經文。

【任務】
以下是聖經中 {book_name}（縮寫：{abbr}）第 {chapter} 章的完整經文。
請以「連貫的故事」形式，將這一章的每一節串聯起來。

【縮寫掛鉤 — 非常重要】
如果是該卷書的「第一章」，請用這個縮寫字「{abbr}」發想一個開頭場景或畫面，作為整卷書的記憶掛鉤。
如果不是第一章，請延續上一章的故事結尾繼續發展。

【規則】
- 每一節都要有諧音和具體畫面
- 前後節之間要有因果或時間關係，形成連貫故事
- 重複出現的概念（神、耶穌、以色列、聖靈等）請用固定的具象化形象
- 故事場景要豐富多變，避免相鄰章節用類似背景

【輸出格式】
{"segments":[{"verse":1,"original":"原詞","pun":"精準諧音","image":"具體畫面描述（20-40字）"},...],"story":"將所有畫面串聯成一段流暢的完整故事"}

只輸出純 JSON，以 { 開頭，以 } 結尾。不要任何前綴後綴或 markdown 標記。`

interface BibleMemoryRecord {
  book: string
  chapter: number
  version: number
  full_text: string
  segments: unknown
  story: string
}

function extractJson(raw: string): string {
  let text = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1)
  }
  return text
}

async function callGemini(apiKey: string, model: string, prompt: string): Promise<unknown> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120000)

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        signal: controller.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: CHAPTER_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
        }),
      }
    )

    if (response.status === 429) return { _skip: 'quota' }
    if (response.status === 404) return { _skip: 'model' }
    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Gemini error ${response.status}: ${err}`)
    }

    const data = await response.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const json = extractJson(raw)
    return JSON.parse(json)
  } finally {
    clearTimeout(timeout)
  }
}

async function generateWithFallback(prompt: string): Promise<unknown> {
  const keys = [process.env.GEMINI_API_KEY!, process.env.GEMINI_API_KEY_2!].filter(Boolean)
  for (const key of keys) {
    for (const model of GEMINI_MODELS) {
      try {
        const result = await callGemini(key, model, prompt)
        if (result && typeof result === 'object' && '_skip' in result) continue
        return result
      } catch {
        continue
      }
    }
  }
  throw new Error('所有模型皆無法使用')
}

async function fetchChapterText(book: BibleBook, chapter: number): Promise<string> {
  const url = `https://bible-api.com/${encodeURIComponent(book.apiName)}+${chapter}?translation=cuv`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`bible-api error: ${res.status}`)
  const data = await res.json()
  return data.text
}

async function getExistingChapters(supabase: any): Promise<Set<string>> {
  const { data } = await supabase
    .from('bible_memories')
    .select('book, chapter')
    .eq('version', 1)

  if (!data) return new Set()
  return new Set(data.map((r: any) => `${r.book}:${r.chapter}`))
}

async function saveMemory(supabase: any, record: BibleMemoryRecord): Promise<void> {
  const { error } = await supabase.from('bible_memories').upsert(
    {
      book: record.book,
      chapter: record.chapter,
      version: record.version,
      full_text: record.full_text,
      segments: record.segments,
      story: record.story,
    },
    { onConflict: 'book,chapter,version' }
  )
  if (error) throw error
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars')
    process.exit(1)
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('檢查已產生的章節...')
  const existing = await getExistingChapters(supabase)
  console.log(`已有 ${existing.size} 章完成`)

  let totalChapters = 0
  let skipped = 0
  let generated = 0
  let failed = 0
  let previousStory = ''

  for (const book of BIBLE_BOOKS) {
    previousStory = ''
    console.log(`\n=== ${book.name} (${book.abbr}) ===`)

    for (let ch = 1; ch <= book.chapters; ch++) {
      const key = `${book.id}:${ch}`
      totalChapters++

      if (existing.has(key)) {
        skipped++
        process.stdout.write('·')
        continue
      }

      process.stdout.write(`\n  ${book.abbr} ${ch}... `)

      try {
        const text = await fetchChapterText(book, ch)
        const isFirstChapter = ch === 1
        const prevContext = previousStory
          ? `\n\n【前一章的故事結尾】\n${previousStory}\n\n請從這個結尾繼續發展。`
          : ''

        const prompt = `以下是聖經中 ${book.name}（縮寫：${book.abbr}）第 ${ch} 章的完整經文。${
          isFirstChapter
            ? `\n\n這是${book.name}的第一章。請用這個縮寫字「${book.abbr}」發想一個開頭場景作為整卷書的記憶掛鉤。`
            : ''
        }${prevContext}

請以「連貫的故事」形式，將這一章的每一節串聯起來。每一節都要有諧音和具體畫面，前後節之間要有因果或時間關係。重複出現的概念（神、耶穌、以色列、聖靈等）請用固定的具象化形象。故事場景要豐富多變。

只輸出純 JSON：
{"segments":[{"verse":1,"original":"原詞","pun":"精準諧音","image":"具體畫面描述（20-40字）"},...],"story":"全章串聯故事"}

經文：
${text}`

      const result = await generateWithFallback(prompt) as any

      if (!result || !result.story) {
        failed++
        console.error(`  ✗ 失敗`)
        continue
      }

      await saveMemory(supabase, {
        book: book.id,
        chapter: ch,
        version: 1,
        full_text: text,
        segments: result.segments || [],
        story: result.story,
      })

      previousStory = result.story
      generated++
      process.stdout.write(`✓ (${result.story.slice(0, 30)}...)`)

      await new Promise((r) => setTimeout(r, 2000))
    } catch (e) {
      failed++
      console.error(`  ✗ ${e instanceof Error ? e.message : String(e)}`)
    }
  }
  }

  console.log(`\n\n=== 完成 ===`)
  console.log(`總章數: ${totalChapters}`)
  console.log(`已跳過: ${skipped}`)
  console.log(`新產生: ${generated}`)
  console.log(`失敗: ${failed}`)
}

main().catch(console.error)
