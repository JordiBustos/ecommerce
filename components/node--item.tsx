import Image from "next/image"
import { DrupalNode } from "next-drupal"

import { absoluteUrl } from "lib/utils"

interface NodeArticleProps {
  node: DrupalNode
}

export function NodeItem({ node, ...props }: NodeArticleProps) {
  return (
    <article {...props}>
      <h1 className="mb-4 text-6xl font-black leading-tight">{node.field_titulo}</h1>
      {node.field_item_img && (
        <figure>
          <Image
            src={absoluteUrl(node.field_item_img[0].uri.url)}
            width={768}
            height={400}
            alt={node.field_item_img[0].resourceIdObjMeta.alt}
            priority
          />
          {node.field_item_img[0].resourceIdObjMeta.title && (
            <figcaption className="py-2 text-sm text-center text-gray-600">
              {node.field_item_img[0].resourceIdObjMeta.title}
            </figcaption>
          )}
        </figure>
      )}
      {node.body?.processed && (
        <div
          dangerouslySetInnerHTML={{ __html: node.body?.processed }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}
    </article>
  )
}
