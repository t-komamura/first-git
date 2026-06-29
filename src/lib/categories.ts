export interface Category {
  name: string
  emoji: string
}

export const DEFAULT_CATEGORIES: Category[] = [
  { name: '鍋', emoji: '🍲' },
  { name: 'パスタ', emoji: '🍝' },
  { name: '肉料理', emoji: '🥩' },
  { name: '魚料理', emoji: '🐟' },
  { name: 'サラダ', emoji: '🥗' },
  { name: '麺類', emoji: '🍜' },
  { name: '炒め物', emoji: '🍳' },
  { name: 'スープ・汁物', emoji: '🍵' },
  { name: 'ご飯もの', emoji: '🍱' },
  { name: 'おつまみ', emoji: '🍺' },
  { name: 'スイーツ', emoji: '🍰' },
]

const STORAGE_KEY = 'custom_categories'

export function loadCategories(): Category[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const custom: Category[] = raw ? JSON.parse(raw) : []
    return [...DEFAULT_CATEGORIES, ...custom]
  } catch {
    return DEFAULT_CATEGORIES
  }
}

export function addCategory(cat: Category) {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(STORAGE_KEY)
  const custom: Category[] = raw ? JSON.parse(raw) : []
  if ([...DEFAULT_CATEGORIES, ...custom].some(c => c.name === cat.name)) return
  custom.push(cat)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom))
}

export function emojiFor(name?: string | null): string {
  if (!name) return '🍽️'
  return loadCategories().find(c => c.name === name)?.emoji ?? '🍽️'
}
