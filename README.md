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
    User {
        string id PK
        string supabaseId
        string email
        datetime createdAt
    }

    AccountingPolicy {
        string id PK
        string userId FK
        int fiscalYear
        enum taxMethod
        enum businessTaxStatus
    }

    Partner {
        string id PK
        string userId FK
        string name
    }

    Account {
        string id PK
        string userId FK
        string code
        string name
        enum type
        boolean isOwnerAccount
    }

    TaxRate {
        string id PK
        string name
        int rateBps
    }

    SaleEvent {
        string id PK
        string userId FK
        string partnerId FK
        date date
        int amount
        string taxRateId FK
        boolean isCancelled
    }

    PaymentEvent {
        string id PK
        string userId FK
        date date
        int amount
        string accountId FK
    }

    PaymentAllocation {
        string id PK
        string paymentEventId FK
        string saleEventId FK
        int amount
        enum type
    }

    FixedCostEvent {
        string id PK
        string userId FK
        string accountId FK
        string paymentAccountId FK
        int amount
        int businessRatio
        string taxRateId FK
    }

    FixedAssetEvent {
        string id PK
        string userId FK
        int amount
        int usefulLife
        enum assetCategory
        enum depreciationMethod
        int businessRatio
    }

    OpeningBalance {
        string id PK
        string userId FK
        int fiscalYear
        string accountId FK
        enum side
        int amount
    }

    JournalEntry {
        string id PK
        string userId FK
        date date
        enum sourceType
        string sourceEventId
        int generation
    }

    JournalEntryLine {
        string id PK
        string journalEntryId FK
        string accountId FK
        int debit
        int credit
        int taxAmount
    }

    GenerationLog {
        string id PK
        string userId FK
        int fiscalYear
        int generation
    }


    User ||--o{ AccountingPolicy : has
    User ||--o{ Partner : has
    User ||--o{ Account : has
    User ||--o{ SaleEvent : records
    User ||--o{ PaymentEvent : records
    User ||--o{ FixedCostEvent : records
    User ||--o{ FixedAssetEvent : records
    User ||--o{ OpeningBalance : has
    User ||--o{ JournalEntry : generates
    User ||--o{ GenerationLog : manages

    Partner ||--o{ SaleEvent : billed_to

    PaymentEvent ||--o{ PaymentAllocation : allocates
    SaleEvent ||--o{ PaymentAllocation : settled_by

    Account ||--o{ JournalEntryLine : posted_to
    Account ||--o{ PaymentEvent : deposit
    Account ||--o{ FixedCostEvent : expense
    Account ||--o{ OpeningBalance : opening

    JournalEntry ||--o{ JournalEntryLine : contains

```