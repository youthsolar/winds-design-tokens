# Winds Portfolio — Field Registry (v1.2)

> Source of truth for all cross-product data fields.
> When adding new products (好愛/好美/好食), consult this registry first.
> Last updated: 2026-05-28
>
> ## v1.2 changelog (2026-05-28)
> - ✅ 命理完整 9 欄已建（Shengxiao / Xingzuo / Lunar_Mansion / Shen_Gong / Year_Pillar / Month_Pillar / Day_Pillar / Hour_Pillar / Personality_Profile）
> - 📐 Contacts module 命理側寫覆蓋完整，飛輪實裝可從 Zoho 直讀
>
> ## v1.1 changelog (2026-05-27)
> - ✅ Zoho 飛輪核心 5 欄位已建（Primary_Element / Ming_Gong / Personality_Tags / Recommended_Verticals / Google_Sub）
> - ✅ Zoho 垃圾欄位已清理（field2→Gender / n→Nickname / field,field1,field5 刪除不重建）
> - ✅ 時間戳轉換 util 已建（user-bridge.ts: epochToIso / isoToEpoch / toZohoDatetime）
> - 📐 新表一律用 TEXT ISO 格式（既有表不動）

## 命名慣例現況

| 系統 | 慣例 | 範例 | 可否更改 |
|---|---|---|---|
| D1 (SQLite) | `snake_case` | `birth_year_stem` | ✅ 可（需 migration） |
| TypeScript | `camelCase` | `birthYearStem` | ✅ 可 |
| Zoho CRM 系統欄位 | `Title_Case` | `Date_of_Birth` | ❌ 不可 |
| Zoho CRM 自訂欄位 | `Title_Case`（自動產生）| `Winds_User_Key` | ⚠️ 建立時可指定，建後不可改 |

---

## 1. User Identity（飛輪骨幹 — 全產品共用）

| 語意 | D1 divination-db | D1 2pr-main | Zoho API Name | 狀態 |
|---|---|---|---|---|
| 統一身份 key | `winds_user_map.winds_user_key` | `tenants.winds_user_key` | `Winds_User_Key` | ✅ 三方已建 |
| LINE 用戶 ID | `clients.line_user_id` | — | `Business_Messaging_Line_Id` | ✅ 已對應 |
| Google Sub ID | `clients.google_sub` | `tenants.google_sub` | ❌ **缺** | 🔴 Zoho 需建 |
| 姓 | `clients.last_name` | `tenants.contact_last_name` | `Last_Name` | ⚠️ D1 欄名不一致 |
| 名 | `clients.first_name` | `tenants.contact_first_name` | `First_Name` | ⚠️ D1 欄名不一致 |
| Email | `clients.email` | `tenants.email` | `Email` | ✅ |
| 電話 | `clients.phone` | — | `Phone` | ✅ |
| 生日 | `clients.date_of_birth` (TEXT) | — | `Date_of_Birth` (date) | ⚠️ 格式不同 |
| 性別 | `clients.gender` | — | `field2` | 🔴 Zoho API Name 是垃圾名 |
| 暱稱 | — | `tenants.name` | `n` | 🔴 Zoho API Name 是垃圾名 |
| LINE Profile Name | — | — | `Business_Messaging_Line_Profile_Name` | ✅ |

### 🔴 需要修復的問題

1. **Zoho `field2`（性別）** — API Name 是自動產生的垃圾名。Zoho 建後不能改 API Name，只能刪重建。建議重建為 `Gender`
2. **Zoho `n`（暱稱）** — 同上，建議重建為 `Nickname`
3. **Zoho `field`（分機）/ `field1`（手機2）/ `field5`（品質分數）** — 全是垃圾名，需評估是否還在用
4. **Google Sub ID** — Zoho 缺這個欄位，好窩 + winds-app 的 Google SSO 用戶無法對應
5. **姓名欄位不一致** — divination-db 用 `last_name`/`first_name`，2pr-main 用 `contact_last_name`/`contact_first_name`

---

## 2. Divination / Astrology（占卜→推薦 飛輪齒輪）

| 語意 | D1 divination-db | Zoho API Name | 狀態 |
|---|---|---|---|
| 八字（完整） | `clients.full_bazi` | `Bazi_Pillars` | ✅ 摘要字串保留 |
| 年柱（合） | `clients.year_heavenly_stem` + `year_earthly_branch` | `Year_Pillar` | ✅ 5/28 已建 |
| 月柱（合） | `clients.month_heavenly_stem` + `month_earthly_branch` | `Month_Pillar` | ✅ 5/28 已建 |
| 日柱（合） | `clients.day_heavenly_stem` + `day_earthly_branch` | `Day_Pillar` | ✅ 5/28 已建 |
| 時柱（合） | `clients.hour_heavenly_stem` + `hour_earthly_branch` | `Hour_Pillar` | ✅ 5/28 已建 |
| 農曆生日 | `clients.lunar_birthday` | `Lunar_Birthday` | ✅ |
| 生肖 | `clients.shengxiao` | `Shengxiao` | ✅ 5/28 已建 picklist |
| 星座 | `clients.xingzuo` | `Xingzuo` | ✅ 5/28 已建 picklist |
| 太歲狀態 | `clients.taisui_conflict_status` | `Taisui_Status` | ✅ |
| 廿八宿 | `clients.twenty_eight_mansion` | `Lunar_Mansion` | ✅ 5/28 已建 |
| 本命塔羅 | `clients.ben_ming_tarot_id` (INTEGER) | `Life_Path_Tarot` (textarea) | ⚠️ 格式不同（ID vs 文字） |
| 納音（年/月/日/時）| `clients.naiyin_year` 等 4 欄 | ❌ **缺** | 🟡 |
| 精確出生時間 | — | `Precise_Birth_Time` | ⚠️ 只在 Zoho，D1 沒對應欄 |
| 時區 | `clients.timezone_of_birth` | `Timezone` | ✅ |

### Divination Tags（新建，飛輪推薦核心）

| 語意 | D1 divination-db | Zoho API Name | 狀態 |
|---|---|---|---|
| 五行 | `divination_tags.primary_element` | `Primary_Element` | ✅ 5/27 已建 |
| 命宮主星 | `divination_tags.ming_gong` | `Ming_Gong` | ✅ 5/27 已建 |
| 身宮主星 | `divination_tags.shen_gong` | `Shen_Gong` | ✅ 5/28 已建 |
| AI 個性標籤 | `divination_tags.personality_tags` (JSON) | `Personality_Tags` | ✅ 5/27 已建 |
| 推薦 verticals | `divination_tags.recommended_verticals` (JSON) | `Recommended_Verticals` | ✅ 5/27 已建 |

---

## 3. Membership & Commerce（商業層）

| 語意 | D1 divination-db | Zoho API Name | 狀態 |
|---|---|---|---|
| 會員等級 | `clients.client_type` | `Membership_Level` | ⚠️ D1 叫 client_type，Zoho 叫 Membership_Level |
| 個性側寫 | `clients.personality_profile` (TEXT) | `Personality_Profile` (textarea large 32000) | ✅ 5/28 已建 |
| 報告標題 | `clients.report_title` | ❌ **缺** | 🟡 |

---

## 4. 2PR.ai Merchant Layer（B2B — 獨立 DB）

| 語意 | D1 2pr-main | Zoho 對應 | 狀態 |
|---|---|---|---|
| 商家 ID | `tenants.id` | — | ⚠️ 2PR 商家 ≠ Zoho Contacts（B2B vs B2C） |
| 商家公司統編 | `tenants.tw_company_id` | — | 🟡 未來可能需要 Zoho Accounts 模組 |
| 記者 → Zoho | `journalists.zoho_record_id` | record ID | ✅ 已有雙向 mapping |
| 記者同步時間 | `journalists.zoho_synced_at` | — | ✅ |

---

## 5. Zoho 垃圾欄位（需清理）

| Zoho API Name | Label | 問題 |
|---|---|---|
| `field2` | 性別 | 自動產生名。應重建為 `Gender` |
| `n` | 暱稱 | 自動產生名。應重建為 `Nickname` |
| `field` | 分機 | 自動產生名。確認是否在用 |
| `field1` | 手機2 | 自動產生名。確認是否在用 |
| `field5` | 品質分數 | 自動產生名。確認是否在用 |

---

## 6. D1 欄位命名不一致（跨 DB）

| 語意 | divination-db | 2pr-main | 問題 |
|---|---|---|---|
| 姓 | `clients.last_name` | `tenants.contact_last_name` | 不同名 |
| 名 | `clients.first_name` | `tenants.contact_first_name` | 不同名 |
| Google ID | `clients.google_sub` | `tenants.google_sub` | ✅ 一致 |
| LINE ID | `clients.line_user_id` | — | 2PR 沒有 LINE 欄位 |
| 統一 key | `winds_user_map.winds_user_key` | `tenants.winds_user_key` | ✅ 一致 |
| 建立時間 | `clients.created_at` (TEXT ISO) | `tenants.created_at` (INTEGER epoch) | 🔴 **格式不同！** |
| 更新時間 | `clients.updated_at` (TEXT ISO) | `tenants.updated_at` (INTEGER epoch) | 🔴 **格式不同！** |

---

## 7. 格式不一致彙整

| 問題 | D1 divination-db | D1 2pr-main | Zoho |
|---|---|---|---|
| 時間戳格式 | `TEXT` (ISO 8601) | `INTEGER` (Unix epoch) | `datetime` (Zoho 格式) |
| ID 格式 | `INTEGER` (auto-increment) | `TEXT` (UUID) | `bigint` (Zoho ID) |
| JSON 欄位 | `TEXT` + JSON.parse | — | `textarea` |
| Boolean | `INTEGER` (0/1) | `INTEGER` (0/1) | `boolean` |

---

## 8. Zoho 欄位建置進度（已完成）

### ✅ 飛輪核心 5 欄（5/27 建）

| Zoho API Name | 資料來源 | 型態 |
|---|---|---|
| `Primary_Element` | `divination_tags.primary_element` | picklist（金/木/水/火/土）|
| `Ming_Gong` | `divination_tags.ming_gong` | text |
| `Personality_Tags` | `divination_tags.personality_tags` | textarea (JSON) |
| `Recommended_Verticals` | `divination_tags.recommended_verticals` | multiselectpicklist |
| `Google_Sub` | `clients.google_sub` | text |

### ✅ 命理完整 9 欄（5/28 建）

| Zoho API Name | 資料來源 | 型態 |
|---|---|---|
| `Shengxiao` | `clients.shengxiao` | picklist（12 生肖）|
| `Xingzuo` | `clients.xingzuo` | picklist（12 星座）|
| `Lunar_Mansion` | `clients.twenty_eight_mansion` | text (25) |
| `Shen_Gong` | `divination_tags.shen_gong` | text (25) |
| `Year_Pillar` | `clients.year_heavenly_stem` + `_earthly_branch` | text (10) |
| `Month_Pillar` | `clients.month_heavenly_stem` + `_earthly_branch` | text (10) |
| `Day_Pillar` | `clients.day_heavenly_stem` + `_earthly_branch` | text (10) |
| `Hour_Pillar` | `clients.hour_heavenly_stem` + `_earthly_branch` | text (10) |
| `Personality_Profile` | `clients.personality_profile` | textarea (large 32000) |

### 🟡 仍可選（未建）

| Zoho Field Label | 建議 API Name | 資料來源 |
|---|---|---|
| 納音（年）| `Naiyin_Year` | `clients.naiyin_year` |
| 報告標題 | `Report_Title` | `clients.report_title` |

---

## 9. 命名決策建議（基於此 Registry）

### 觀察

1. Zoho 的 Title_Case 不可改 → 任何方案都需要 Zoho mapping
2. D1 兩個 DB **時間戳格式不同**（TEXT vs INTEGER）比命名 case 更危險
3. D1 兩個 DB **姓名欄位命名不一致** — 這會在 winds_user_map 串接時造成 bug
4. Zoho 有 5 個垃圾名欄位需要清理

### 建議優先級

1. 🔴 **先修時間戳格式不一致** — 比 case 更容易出 bug
2. 🔴 **建 Zoho 飛輪核心欄位**（五行/命宮/個性標籤/推薦 Verticals/Google Sub）
3. 🔴 **清理 Zoho 垃圾欄位**（`field2`→`Gender` 等）
4. 🟡 **統一姓名欄位名** — divination `last_name` vs 2PR `contact_last_name`
5. 🟡 **決定 snake_case vs camelCase** — 有了這份 registry，任何 case 都能 mapping
