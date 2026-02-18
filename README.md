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

## ER図
```mermaid
erDiagram
  User ||--o{ Account : has
  Account ||--o{ Account : parent_of

  User ||--o{ Partner : has
  Partner }o--|| Account : defaultReceiptAccount

  User ||--o{ Preset : has
  Preset }o--|| Account : fixedDebitAccount
  Preset }o--|| Account : fixedCreditAccount

  User ||--o{ Transaction : has
  Transaction }|--|| Preset : uses
  Transaction }o--|| Partner : partner
  Transaction }o--|| Account : variableAccount
  Transaction ||--o| JournalEntry : generates

  User ||--o{ JournalEntry : has
  JournalEntry }o--|| Partner : partner
  JournalEntry ||--o{ JournalLine : has

  JournalLine }|--|| Account : account
  TaxRate ||--o{ JournalLine : applied_to

  User ||--o{ ImportSession : has
  ImportSession ||--o{ ImportRow : has
  ImportRow }o--|| Preset : mappedPreset
  ImportRow }o--|| Account : mappedVariableAccount
  ImportRow }o--|| Partner : mappedPartner

  User ||--o{ FixedAsset : has
  FixedAsset ||--o{ DepreciationRun : has
  DepreciationRun }|--|| JournalEntry : journalEntry

  User ||--o{ FiscalYearSetting : has

  User {
    String id PK
    String supabaseId "UNIQUE"
    String email
    String name
    DateTime createdAt
    DateTime updatedAt
  }

  Account {
    String id PK
    String userId FK
    String parentId FK "nullable"
    String code
    String name
    String kana "nullable"
    String searchKey "nullable"
    AccountType type
    Boolean isOwnerAccount
    DateTime createdAt
    DateTime updatedAt
  }

  Partner {
    String id PK
    String userId FK
    String name
    String code "nullable"
    String defaultReceiptAccountId FK "nullable"
    DateTime createdAt
    DateTime updatedAt
  }

  Preset {
    String id PK
    String userId FK
    String name
    PresetKind kind
    String fixedDebitAccountId FK "nullable"
    String fixedCreditAccountId FK "nullable"
    Boolean requiresVariableAccount
    Boolean requiresPartner
    DateTime createdAt
    DateTime updatedAt
  }

  Transaction {
    String id PK
    String userId FK
    String presetId FK
    DateTime txDate
    Int amount
    String description "nullable"
    String partnerId FK "nullable"
    String variableAccountId FK "nullable"
    DateTime createdAt
    DateTime updatedAt
  }

  JournalEntry {
    String id PK
    String userId FK
    DateTime entryDate
    String description "nullable"
    JournalOrigin origin
    String partnerId FK "nullable"
    String transactionId FK "UNIQUE, nullable"
    DateTime createdAt
    DateTime updatedAt
  }

  JournalLine {
    String id PK
    String journalEntryId FK
    String accountId FK
    Int debit
    Int credit
    String taxRateId FK "nullable"
    Int taxAmount "nullable"
    TaxKind taxKind
    DateTime createdAt
    DateTime updatedAt
  }

  TaxRate {
    String id PK
    String name "UNIQUE"
    Int rateBps
    DateTime createdAt
    DateTime updatedAt
  }

  ImportSession {
    String id PK
    String userId FK
    ImportStatus status
    DateTime createdAt
    DateTime updatedAt
  }

  ImportRow {
    String id PK
    String importSessionId FK
    DateTime rowDate
    String memo "nullable"
    Int signedAmount
    String mappedPresetId FK "nullable"
    String mappedVariableAccountId FK "nullable"
    String mappedPartnerId FK "nullable"
    String transactionId "nullable (no FK in schema)"
    DateTime createdAt
    DateTime updatedAt
  }

  FixedAsset {
    String id PK
    String userId FK
    String name
    DateTime acquiredOn
    Int cost
    Int usefulLifeYears
    DateTime createdAt
    DateTime updatedAt
  }

  DepreciationRun {
    String id PK
    String fixedAssetId FK
    Int fiscalYear
    Int amount
    DateTime postedOn
    String journalEntryId FK
    DateTime createdAt
    DateTime updatedAt
  }

  FiscalYearSetting {
    String id PK
    String userId FK
    Int fiscalYear
    TaxStatus taxStatus
    DateTime createdAt
    DateTime updatedAt
  }

```