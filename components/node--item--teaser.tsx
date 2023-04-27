import Image from "next/image";
import Link from "next/link";
import { DrupalNode } from "next-drupal";
import { absoluteUrl } from "lib/utils";

interface NodeItemTeaserProps {
  node: DrupalNode;
  terms: any;
}

export function NodeItemTeaser({ node, terms, ...props }: NodeItemTeaserProps) {
  return (
    <article className="basis-1/4 grow-0" {...props}>
      <h2 className="font-bold text-4xl mb-2">{node.title}</h2>
      {node.field_item_img && (
        <figure>
          <Image
            src={absoluteUrl(node.field_item_img[0].uri.url)}
            width={400}
            height={400}
            alt={node.field_item_img[0].resourceIdObjMeta.alt}
            priority
            className="rounded shadow-lg"
          />
          {node.field_item_img[0].resourceIdObjMeta.title && (
            <figcaption className="py-2 text-sm text-center text-gray-600">
              {node.field_item_img[0].resourceIdObjMeta.title}
            </figcaption>
          )}
        </figure>
      )}
      <div className="flex justify-between mt-1">
        {node.field_stock == 0 ? (
          <p className="font-bold">Sin stock</p>
        ) : (
          <p className="font-bold">{"$" + node.field_precio}</p>
        )}
        <p>
          {
            terms[
              node.field_tipo.resourceIdObjMeta.drupal_internal__target_id - 1
            ].name
          }
        </p>
      </div>
      <Link
        href={node.path.alias}
        className="inline-flex items-center px-6 py-2 border border-gray-600 rounded-full hover:bg-gray-100 mt-2"
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
      <hr className="my-10" />
    </article>
  );
}
