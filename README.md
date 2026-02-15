# bookkeeping

個人事業主向け会計アプリ

## 技術スタック

- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma (PostgreSQL)
- Supabase Auth
- Tailwind CSS v4
- react-hook-form + zod
- react-hot-toast

## コマンド

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 本番サーバー起動
pnpm start

# Lint
pnpm lint

# Prismaクライアント生成
npx prisma generate

# マイグレーション作成
npx prisma migrate dev --name <migration_name>

# マイグレーション適用(本番)
npx prisma migrate deploy

# シードデータ投入
npx prisma db seed

# Prisma Studio(DBブラウザ)
npx prisma studio
```

## ER図
```mermaid
erDiagram

User ||--o{ Account : owns
User ||--o{ Partner : owns
User ||--o{ Preset : owns
User ||--o{ Transaction : inputs
User ||--o{ JournalEntry : posts
User ||--o{ ImportSession : runs
User ||--o{ FixedAsset : owns
User ||--o{ FiscalYearSetting : config

Account ||--o{ Account : parent_child
Account ||--o{ JournalLine : used_in
Account ||--o{ Transaction : variable_account
Account ||--o{ Preset : fixed_debit
Account ||--o{ Preset : fixed_credit
Account ||--o{ Partner : default_receipt
Account ||--o{ ImportRow : mapped_variable

Partner ||--o{ JournalEntry : related
Partner ||--o{ Transaction : related
Partner ||--o{ ImportRow : mapped

Preset ||--o{ Transaction : generates
Preset ||--o{ ImportRow : mapped

Transaction ||--|| JournalEntry : produces

JournalEntry ||--o{ JournalLine : has
JournalEntry ||--o{ DepreciationRun : created_by

TaxRate ||--o{ JournalLine : applied

ImportSession ||--o{ ImportRow : contains

FixedAsset ||--o{ DepreciationRun : depreciates

DepreciationRun }o--|| JournalEntry : posts

```