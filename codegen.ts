import type { CodegenConfig } from '@graphql-codegen/cli'

/**
 * Genera tipos y hooks desde el esquema en vivo del backend.
 * Requiere que el backend esté levantado: `npm run codegen` con el servidor caído
 * falla con ECONNREFUSED, no con un error de esquema.
 */
const config: CodegenConfig = {
  schema: process.env.VITE_GRAPHQL_ENDPOINT ?? 'http://localhost:3000/graphql',
  documents: ['src/**/*.{ts,tsx}', '!src/graphql/generated/**/*'],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      config: {
        // Las fechas del backend son strings YYYY-MM-DD / YYYY-MM, no Date.
        scalars: {
          DateTime: 'string',
        },
        // Uniones de literales en vez de enums de TS: los enums no son
        // borrables y chocan con `erasableSyntaxOnly`. Además una unión de
        // strings es la representación fiel de un enum de GraphQL.
        enumsAsTypes: true,
        // `verbatimModuleSyntax` exige que los tipos se importen con `import type`.
        useTypeImports: true,
      },
    },
  },
}

export default config
