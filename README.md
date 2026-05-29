# Winds Portfolio · Unified Design Tokens

找風 portfolio 全產品共用的設計 token 母檔（2026-05-23 方案 B 拍板）。

四個 codebase（`ai-divination` / `winds-app` / `2pr-ai` / `fengshui-rental`）共用這一套設計語言：
一套中性紙底 + 各 sub-brand 用 accent 色區分。

## 檔案

| 檔案 | 用途 |
|---|---|
| `tokens.css` | CSS custom properties 母檔（紙底 / 墨色 / accent / 字體 / radius / shadow） |
| `types.ts` | TypeScript token 型別定義 |
| `FIELD_REGISTRY.md` | 53 表 ~600 欄位 三方對照（D1 ↔ TS ↔ Zoho）的 source of truth |

## 設計系統重點（方案 B）

- **字體**：Noto Serif TC 整面（標題/body 同字，weight 區分），mono = JetBrains Mono
- **底色**：light mode 為主，紙底 `--paper: #FBF8F3`
- **預設 accent**：找風問幸福 乾燥玫瑰 `#C97D7D`
- **Sub-brand accent**（以 `data-brand` 切換）：
  - `haowu` 找風問好窩（住）— 天青 `#8B9DAB`
  - `haoai` 找風問好愛（樂）— 珊瑚粉 `#E8A5A5`
  - `haomei` 找風問好美（美）— 薄茶綠 `#A8B895`
  - `haoshi` 找風問好食（食）— 薪褐 `#C7956B`

## Usage

各專案 `@import` 或複製進自己的 `styles/tokens.css`：

```css
@import "winds-design-tokens/tokens.css";
```

子品牌頁面在根元素掛 `data-brand`：

```html
<html data-brand="haowu"> <!-- 套天青 accent -->
```
