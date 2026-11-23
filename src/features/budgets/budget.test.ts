import { describe, expect, it } from 'vitest'
import { budgetLevel, budgetRatio, formatMonth, sortByUrgency } from './budget'

describe('budgetLevel', () => {
  it('usa exceeded del backend para el excedido', () => {
    expect(budgetLevel({ exceeded: true, percentage: 120 })).toBe('exceeded')
  })

  it('el 100 % justo no está excedido, solo cerca del tope', () => {
    expect(budgetLevel({ exceeded: false, percentage: 100 })).toBe('near')
  })

  it('marca cerca del tope desde el 80 %', () => {
    expect(budgetLevel({ exceeded: false, percentage: 80 })).toBe('near')
    expect(budgetLevel({ exceeded: false, percentage: 79.9 })).toBe('ok')
  })
})

describe('budgetRatio', () => {
  it('limita la barra a 1 y no admite negativos', () => {
    expect(budgetRatio(150)).toBe(1)
    expect(budgetRatio(-5)).toBe(0)
    expect(budgetRatio(45)).toBeCloseTo(0.45)
  })
})

describe('formatMonth', () => {
  it('no se corre de mes por la zona horaria', () => {
    expect(formatMonth('2026-01')).toBe('enero de 2026')
  })
})

describe('sortByUrgency', () => {
  it('ordena por porcentaje descendente sin mutar la entrada', () => {
    const input = [{ percentage: 10 }, { percentage: 130 }, { percentage: 85 }]
    expect(sortByUrgency(input).map((b) => b.percentage)).toEqual([130, 85, 10])
    expect(input[0]?.percentage).toBe(10)
  })
})
