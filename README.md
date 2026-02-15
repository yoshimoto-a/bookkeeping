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
pnpm prisma generate

# マイグレーション作成
pnpm prisma migrate dev --name <migration_name>

# マイグレーション適用(本番)
pnpm prisma migrate deploy

# シードデータ投入
pnpm prisma db seed

# Prisma Studio(DBブラウザ)
pnpm prisma studio
```

## ER図（現行）
```mermaid
erDiagram
    User {
        string id PK
        string supabaseId
        string email
        string name
        datetime createdAt
        datetime updatedAt
    }

    FiscalYearSetting {
        string id PK
        string userId FK
        int fiscalYear
        enum taxStatus
        datetime createdAt
        datetime updatedAt
    }

    Account {
        string id PK
        string userId FK
        string parentId FK
        string code
        string name
        enum type
        boolean isOwnerAccount
        datetime createdAt
        datetime updatedAt
    }

    Partner {
        string id PK
        string userId FK
        string name
        string code
        string defaultReceiptAccountId FK
        datetime createdAt
        datetime updatedAt
    }

    Preset {
        string id PK
        string userId FK
        enum kind
        string fixedDebitAccountId FK
        string fixedCreditAccountId FK
        boolean requiresVariableAccount
        boolean requiresPartner
        datetime createdAt
        datetime updatedAt
    }

    Transaction {
        string id PK
        string userId FK
        string presetId FK
        date txDate
        int amount
        string description
        string partnerId FK
        string variableAccountId FK
        datetime createdAt
        datetime updatedAt
    }

    JournalEntry {
        string id PK
        string userId FK
        date entryDate
        string description
        enum origin
        string partnerId FK
        string transactionId FK
        datetime createdAt
        datetime updatedAt
    }

    JournalLine {
        string id PK
        string journalEntryId FK
        string accountId FK
        int debit
        int credit
        string taxRateId FK
        int taxAmount
        datetime createdAt
        datetime updatedAt
    }

    TaxRate {
        string id PK
        string name
        int rateBps
        datetime createdAt
        datetime updatedAt
    }

    ImportSession {
        string id PK
        string userId FK
        enum status
        datetime createdAt
        datetime updatedAt
    }

    ImportRow {
        string id PK
        string importSessionId FK
        date rowDate
        string memo
        int signedAmount
        string mappedPresetId FK
        string mappedVariableAccountId FK
        string mappedPartnerId FK
        string transactionId FK
        datetime createdAt
        datetime updatedAt
    }

    FixedAsset {
        string id PK
        string userId FK
        string name
        date acquiredOn
        int cost
        int usefulLifeYears
        datetime createdAt
        datetime updatedAt
    }

    DepreciationRun {
        string id PK
        string fixedAssetId FK
        int fiscalYear
        int amount
        date postedOn
        string journalEntryId FK
        datetime createdAt
        datetime updatedAt
    }

    User ||--o{ Account : has
    User ||--o{ Partner : has
    User ||--o{ Preset : has
    User ||--o{ Transaction : has
    User ||--o{ JournalEntry : has
    User ||--o{ ImportSession : has
    User ||--o{ FixedAsset : has
    User ||--o{ FiscalYearSetting : has

    Account ||--o{ Account : children
    Account ||--o{ JournalLine : posted_to
    Account ||--o{ Transaction : variable_of
    Partner ||--o{ JournalEntry : referenced_by

    Preset ||--o{ Transaction : generates

    Transaction ||--|{ JournalEntry : creates

    JournalEntry ||--o{ JournalLine : contains

    ImportSession ||--o{ ImportRow : has

    FixedAsset ||--o{ DepreciationRun : has

    TaxRate ||--o{ JournalLine : applied_to
```