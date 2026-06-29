# 🍳 俺のレシピランキング

ChatGPTやClaudeで調べたレシピを実際に作ってみて、美味しかったものを記録・ランキングするアプリ。
同じ料理の「タレ違い」「味付け違い」をバリエーションとして登録し、★評価で自分だけのベストレシピを見つけます。

## 特徴

- **AIで自動入力**: ChatGPT/Claudeのレスポンスを貼り付けるだけで、食材・手順を自動解析
- **2階層管理**: 親料理（例: 鶏の照り焼き）→ バリエーション（例: 醤油＋みりん / 塩レモン）
- **★ランキング**: バリエーションごとに評価し、高い順に並ぶ
- **カテゴリー**: emojiアイコン付き。自分で追加もできる
- **検索**: 料理名・食材で絞り込み
- スマホ対応（レスポンシブ）

## 技術スタック

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Neon (PostgreSQL) + Drizzle ORM
- Google Gemini API（レシピ解析）

---

## セットアップ

### 1. データベース（Neon）を用意

1. https://neon.tech にアクセスして無料アカウント作成
2. 新しいプロジェクトを作成
3. ダッシュボードの「Connection string」をコピー（`postgresql://...` の形式）

### 2. Google AI Studio でAPIキーを取得

1. https://aistudio.google.com にアクセス
2. 「Get API key」→「Create API key」
3. 表示されたキーをコピー

### 3. 環境変数を設定

`.env.local` を作成（`.env.local.example` を参考に）:

```
DATABASE_URL=postgresql://...（Neonの接続文字列）
GOOGLE_AI_API_KEY=...（Google AI Studioのキー）
```

### 4. 依存インストール & テーブル作成

```bash
npm install
npm run db:push   # Neonにテーブルを作成
```

### 5. ローカル起動

```bash
npm run dev
```

http://localhost:3000 を開く

---

## Vercelにデプロイ（スマホから使う）

1. このリポジトリをGitHubにpush
2. https://vercel.com でアカウント作成 → GitHubリポジトリをImport
3. Vercelの「Settings → Environment Variables」に以下を設定:
   - `DATABASE_URL`
   - `GOOGLE_AI_API_KEY`
4. Deploy
5. 発行された `https://xxx.vercel.app` をスマホのブラウザで開く（ホーム画面に追加するとアプリのように使えます）

> テーブル作成（`npm run db:push`）はローカルから一度実行すればOK（同じNeonのDBを使うため）。

## コスト

個人利用なら **すべて無料枠** で運用できます（Vercel Hobby / Neon Free / Gemini 無料枠）。
