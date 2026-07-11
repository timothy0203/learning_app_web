interface BibleBook {
  id: string
  name: string
  apiName: string
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
  { id: 'GEN', name: '創世記', apiName: '創世記' },
  { id: 'EXO', name: '出埃及記', apiName: '出埃及記' },
  { id: 'LEV', name: '利未記', apiName: '利未記' },
  { id: 'NUM', name: '民數記', apiName: '民數記' },
  { id: 'DEU', name: '申命記', apiName: '申命記' },
  { id: 'JOS', name: '約書亞記', apiName: '約書亞記' },
  { id: 'JDG', name: '士師記', apiName: '士師記' },
  { id: 'RUT', name: '路得記', apiName: '路得記' },
  { id: '1SA', name: '撒母耳記上', apiName: '撒母耳記上' },
  { id: '2SA', name: '撒母耳記下', apiName: '撒母耳記下' },
  { id: '1KI', name: '列王紀上', apiName: '列王紀上' },
  { id: '2KI', name: '列王紀下', apiName: '列王紀下' },
  { id: '1CH', name: '歷代志上', apiName: '歷代志上' },
  { id: '2CH', name: '歷代志下', apiName: '歷代志下' },
  { id: 'EZR', name: '以斯拉記', apiName: '以斯拉記' },
  { id: 'NEH', name: '尼希米記', apiName: '尼希米記' },
  { id: 'EST', name: '以斯帖記', apiName: '以斯帖記' },
  { id: 'JOB', name: '約伯記', apiName: '約伯記' },
  { id: 'PSA', name: '詩篇', apiName: '詩篇' },
  { id: 'PRO', name: '箴言', apiName: '箴言' },
  { id: 'ECC', name: '傳道書', apiName: '傳道書' },
  { id: 'SNG', name: '雅歌', apiName: '雅歌' },
  { id: 'ISA', name: '以賽亞書', apiName: '以賽亞書' },
  { id: 'JER', name: '耶利米書', apiName: '耶利米書' },
  { id: 'LAM', name: '耶利米哀歌', apiName: '耶利米哀歌' },
  { id: 'EZK', name: '以西結書', apiName: '以西結書' },
  { id: 'DAN', name: '但以理書', apiName: '但以理書' },
  { id: 'HOS', name: '何西阿書', apiName: '何西阿書' },
  { id: 'JOL', name: '約珥書', apiName: '約珥書' },
  { id: 'AMO', name: '阿摩司書', apiName: '阿摩司書' },
  { id: 'OBA', name: '俄巴底亞書', apiName: '俄巴底亞書' },
  { id: 'JON', name: '約拿書', apiName: '約拿書' },
  { id: 'MIC', name: '彌迦書', apiName: '彌迦書' },
  { id: 'NAM', name: '那鴻書', apiName: '那鴻書' },
  { id: 'HAB', name: '哈巴谷書', apiName: '哈巴谷書' },
  { id: 'ZEP', name: '西番雅書', apiName: '西番雅書' },
  { id: 'HAG', name: '哈該書', apiName: '哈該書' },
  { id: 'ZEC', name: '撒迦利亞書', apiName: '撒迦利亞書' },
  { id: 'MAL', name: '瑪拉基書', apiName: '瑪拉基書' },
  { id: 'MAT', name: '馬太福音', apiName: '馬太福音' },
  { id: 'MRK', name: '馬可福音', apiName: '馬可福音' },
  { id: 'LUK', name: '路加福音', apiName: '路加福音' },
  { id: 'JHN', name: '約翰福音', apiName: '約翰福音' },
  { id: 'ACT', name: '使徒行傳', apiName: '使徒行傳' },
  { id: 'ROM', name: '羅馬書', apiName: '羅馬書' },
  { id: '1CO', name: '哥林多前書', apiName: '哥林多前書' },
  { id: '2CO', name: '哥林多後書', apiName: '哥林多後書' },
  { id: 'GAL', name: '加拉太書', apiName: '加拉太書' },
  { id: 'EPH', name: '以弗所書', apiName: '以弗所書' },
  { id: 'PHP', name: '腓立比書', apiName: '腓立比書' },
  { id: 'COL', name: '歌羅西書', apiName: '歌羅西書' },
  { id: '1TH', name: '帖撒羅尼迦前書', apiName: '帖撒羅尼迦前書' },
  { id: '2TH', name: '帖撒羅尼迦後書', apiName: '帖撒羅尼迦後書' },
  { id: '1TI', name: '提摩太前書', apiName: '提摩太前書' },
  { id: '2TI', name: '提摩太後書', apiName: '提摩太後書' },
  { id: 'TIT', name: '提多書', apiName: '提多書' },
  { id: 'PHM', name: '腓利門書', apiName: '腓利門書' },
  { id: 'HEB', name: '希伯來書', apiName: '希伯來書' },
  { id: 'JAS', name: '雅各書', apiName: '雅各書' },
  { id: '1PE', name: '彼得前書', apiName: '彼得前書' },
  { id: '2PE', name: '彼得後書', apiName: '彼得後書' },
  { id: '1JN', name: '約翰一書', apiName: '約翰一書' },
  { id: '2JN', name: '約翰二書', apiName: '約翰二書' },
  { id: '3JN', name: '約翰三書', apiName: '約翰三書' },
  { id: 'JUD', name: '猶大書', apiName: '猶大書' },
  { id: 'REV', name: '啟示錄', apiName: '啟示錄' },
]

export async function fetchBibleVerse(
  bookId: string,
  chapter: number,
  verse?: string
): Promise<string> {
  const book = BIBLE_BOOKS.find((b) => b.id === bookId)
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
