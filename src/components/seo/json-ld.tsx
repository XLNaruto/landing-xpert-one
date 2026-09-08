/**
 * Renders a schema.org graph into the document. A Server Component: the JSON
 * is serialised at build time and ships as markup, not client JS.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      /* `<` is the only character that can break out of a script block. */
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
