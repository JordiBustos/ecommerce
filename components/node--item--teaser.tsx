import Image from "next/image"
import Link from "next/link"
import { DrupalNode } from "next-drupal"
import { absoluteUrl } from "lib/utils"

interface NodeItemTeaserProps {
  node: DrupalNode
}

export function NodeItemTeaser({ node, ...props }: NodeItemTeaserProps) {
  return (
    <article {...props}>
      {node.title}
      {node.body.value} {" - "}
      <p>{node.field_tipo.resourceIdObjMeta.drupal_internal__target_id}</p>
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
      <p>{'$' + node.field_precio}</p>
      <Link
        href={node.path.alias}
        className="inline-flex items-center px-6 py-2 border border-gray-600 rounded-full hover:bg-gray-100"
      >
        Ver más
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 ml-2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>

    </article>
  )
}