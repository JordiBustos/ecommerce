import Image from "next/image";
import { DrupalNode } from "next-drupal";

import { absoluteUrl } from "lib/utils";

interface NodeArticleProps {
  node: DrupalNode;
}

export function NodeItem({ node, ...props }: NodeArticleProps) {
  return (
    <article {...props}>
      <h1 className="mb-4 text-6xl font-black leading-tight">
        {node.title}
      </h1>
      <div className="flex">
        {node.field_item_img &&
          node.field_item_img.map((img, index: number) => (
            <figure key={index}>
              <Image
                src={absoluteUrl(img.uri.url)}
                width={400}
                height={360}
                alt={img.resourceIdObjMeta.alt}
                className="rounded shadow-lg"
                priority
              />
              <figcaption className="py-2 text-sm text-center text-gray-600">
                {img.resourceIdObjMeta.title}
              </figcaption>
            </figure>
          ))}
        <div className="ml-4">
            {node.body?.processed && (
              <div
                dangerouslySetInnerHTML={{ __html: node.body?.processed }}
                className="mt-6 font-serif text-xl leading-loose prose"
              />
            )}
            <p className="mt-6 font-serif text-xl leading-loose prose">{"$" + node.field_precio}</p>
        </div>
      </div>
    </article>
  );
}
