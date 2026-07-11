import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold gradient-text mb-4">
        記憶大師
      </h1>
      <p className="text-slate-400 text-lg mb-12 max-w-lg">
        透過諧音轉譯與視覺聯想，把抽象的文字變成具體的畫面，讓你的大腦輕鬆記住一切
      </p>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link
          href="/bible"
          className="card group hover:border-indigo-500 transition-all p-8"
        >
          <div className="text-3xl mb-4">📖</div>
          <h2 className="text-xl font-bold text-slate-200 group-hover:text-indigo-300 transition-colors mb-2">
            聖經記憶
          </h2>
          <p className="text-slate-400 text-sm">
            貼入經文或選書卷章節，AI 幫你逐詞拆解諧音，串成生動的畫面故事
          </p>
        </Link>

        <Link
          href="/japanese"
          className="card group hover:border-sky-500 transition-all p-8"
        >
          <div className="text-3xl mb-4">🗾</div>
          <h2 className="text-xl font-bold text-slate-200 group-hover:text-sky-300 transition-colors mb-2">
            日文記憶
          </h2>
          <p className="text-slate-400 text-sm">
            輸入單字或整段句子，AI 分析發音並用中文/注音諧音幫助記憶
          </p>
        </Link>
      </div>

      <Link
        href="/saved"
        className="mt-8 text-slate-500 hover:text-slate-300 transition-colors text-sm"
      >
        查看我的記憶庫 →
      </Link>
    </div>
  )
}
