// ==========================================================================
// Winds Portfolio · Shared Cross-Product Types (v1.0 — 2026-05-26)
// Source: Portfolio 飛輪 thesis (2026-05-23)
// Usage: Copy relevant interfaces into each sub-brand project as needed
// ==========================================================================

/**
 * Unified user key across all Winds products.
 * Format: `{provider}:{id}`
 *
 * Examples:
 *   'line:U1234567890abcdef'
 *   'google:118234567890123456789'
 *   'zoho:5678901234567890'
 */
export type WindsUserKey = `${'line' | 'google' | 'zoho' | 'email'}:${string}`;

/**
 * Tags produced by the divination entry point (找風問幸福).
 * These flow into the recommendation layer (好X sub-brands)
 * to personalize content, products, and merchant matches.
 */
export interface DivinationTags {
  user_key: WindsUserKey;

  // 八字 basics
  primary_element: '金' | '木' | '水' | '火' | '土';
  birth_year_stem: string;    // 天干 e.g. '丙'
  birth_year_branch: string;  // 地支 e.g. '午'
  birth_day_stem?: string;
  birth_day_branch?: string;

  // 紫微 (if available)
  ming_gong?: string;         // 命宮主星 e.g. '紫微天府'
  shen_gong?: string;         // 身宮主星

  // AI-generated personality tags
  personality_tags: string[];

  // Recommended sub-brand verticals based on chart interpretation
  recommended_verticals: SubBrandVertical[];

  generated_at: string;       // ISO 8601
  model?: string;             // AI model used for tag generation
}

export type SubBrandVertical =
  | 'home'      // 好窩
  | 'love'      // 好愛
  | 'beauty'    // 好美
  | 'food'      // 好食
  | 'apparel'   // 衣
  | 'transport'  // 行
  | 'education' // 育
  | 'leisure';  // 樂

/**
 * Merchant reference injected from 2PR.ai into sub-brand catalogs.
 */
export interface MerchantRef {
  merchant_id: string;        // 2PR tenant UUID
  user_key?: WindsUserKey;    // if merchant also has a Winds account
  brand_name: string;
  vertical: SubBrandVertical;
  press_release_count: number;
  media_coverage_count: number;
  joined_at: string;          // ISO 8601
}

/**
 * D1 row for the cross-product user mapping table.
 */
export interface WindsUserMapRow {
  winds_user_key: string;     // canonical key (e.g. 'line:Uxxxx')
  provider: 'line' | 'google' | 'zoho' | 'email';
  provider_id: string;
  display_name?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}
