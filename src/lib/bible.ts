interface BibleBook {
  id: string
  name: string
  apiName: string
  abbr: string
  chapters: number
  testament: 'ot' | 'nt'
}

interface BibleApiResponse {
  reference: string
  verses: Array<{
    book_id: string
    book_name: string
    chapter: number
    verse: number
    text: string
  }>
  text: string
}

export const BIBLE_BOOKS: BibleBook[] = [
  // 舊約
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
  // 新約
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
]

export function getBookById(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.id === id)
}

export function getBooksByTestament(testament: 'nt' | 'ot'): BibleBook[] {
  return BIBLE_BOOKS.filter((b) => b.testament === testament)
}

export async function fetchBibleVerse(
  bookId: string,
  chapter: number,
  verse?: string
): Promise<string> {
  const book = getBookById(bookId)
  if (!book) throw new Error(`Unknown book: ${bookId}`)

  const ref = verse
    ? `${encodeURIComponent(book.apiName)}+${chapter}:${verse}`
    : `${encodeURIComponent(book.apiName)}+${chapter}`

  const response = await fetch(
    `https://bible-api.com/${ref}?translation=cuv`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch verse: ${response.statusText}`)
  }

  const data: BibleApiResponse = await response.json()
  return data.text
}
