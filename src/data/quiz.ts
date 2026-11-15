/**
 * Test rápido de rutina facial: los IDs viven aquí y los textos en i18n/messages.ts.
 */
export const QUIZ = {
  skinType: ['dry', 'combination', 'oily', 'sensitive', 'balanced'],
  concern: ['glow', 'pores', 'spots', 'hydration', 'fineLines'],
  time: ['none', 'quick', 'steady', 'ritual'],
} as const

export type QuizQuestion = keyof typeof QUIZ
export type SkinType = (typeof QUIZ)['skinType'][number]
export type Concern = (typeof QUIZ)['concern'][number]
export type RoutineTime = (typeof QUIZ)['time'][number]

export interface QuizAnswers {
  skinType?: SkinType
  concern?: Concern
  time?: RoutineTime
}

export const QUIZ_ORDER: QuizQuestion[] = ['skinType', 'concern', 'time']
