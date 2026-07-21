import { graphql } from './generated'

/**
 * Healthcheck del backend. Es el documento más simple del esquema, así que sirve
 * de prueba de humo del pipeline de codegen: si esto tipa, la generación funciona.
 */
export const HealthQuery = graphql(`
  query Health {
    health
  }
`)
