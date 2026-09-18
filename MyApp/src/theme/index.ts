/**
 * VyaparERP Design System — Central Theme Tokens
 * Warm Copper / Gold  +  Clean Slate  Enterprise ERP
 */

// BRAND — WARM COPPER GOLD
export const BRAND = {
  primary:       '#c07a4e',
  primaryDark:   '#a7653b',
  primaryLight:  '#fdf6f0',
  primaryBorder: '#eed5c3',
  primaryGlow:   'rgba(192, 122, 78, 0.15)',
  executiveDark: '#2b2f38',
  executiveMid:  '#3f4654',
  totalHighlight:'#f7d2b8',
};

// NEUTRALS — SLATE PALETTE
export const SLATE = {
  50:    '#f8fafc',
  100:   '#f1f5f9',
  200:   '#e2e8f0',
  300:   '#cbd5e1',
  400:   '#94a3b8',
  500:   '#64748b',
  600:   '#475569',
  700:   '#334155',
  800:   '#1e293b',
  900:   '#0f172a',
  white: '#ffffff',
};

// STATUS COLORS
export const STATUS = {
  success:       '#16a34a',
  successBg:     '#f0fdf4',
  successBorder: '#bbf7d0',
  danger:        '#dc2626',
  dangerBg:      '#fef2f2',
  dangerBorder:  '#fecaca',
  warning:       '#d97706',
  warningBg:     '#fffbeb',
  warningBorder: '#fde68a',
};

// TYPOGRAPHY
export const FONT = {
  xs: 11, sm: 12, base: 13, md: 14, lg: 16, xl: 18, xxl: 20, xxxl: 24,
  regular: '400' as const,
  medium:  '500' as const,
  semibold:'600' as const,
  bold:    '700' as const,
  extrabold:'800' as const,
};

// BORDER RADIUS
export const RADIUS = {
  sm: 4, base: 6, md: 8, lg: 10, xl: 12, xxl: 16, full: 999,
};

// SHADOW PRESETS
export const SHADOW = {
  sm:    { shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.05, shadowRadius:3,  elevation:1 },
  base:  { shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.08, shadowRadius:6,  elevation:3 },
  md:    { shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.10, shadowRadius:10, elevation:5 },
  brand: { shadowColor:'#c07a4e', shadowOffset:{width:0,height:3}, shadowOpacity:0.30, shadowRadius:8, elevation:5 },
};

const Theme = { BRAND, SLATE, STATUS, FONT, RADIUS, SHADOW };
export default Theme;
