import Image from "next/image";
import { DrupalNode } from "next-drupal";
import { useState } from "react";
import { absoluteUrl } from "lib/utils";
import Link from "next/link";

interface NodeArticleProps {
  node: DrupalNode;
}

export function NodeItem({ node, ...props }: NodeArticleProps) {
  const [ammount, setAmmount] = useState(1)

  const handleSubmitCart = (e) => {
    e.preventDefault();
    //...
    console.log(ammount)
  }

  return (
    <article {...props}>
      {!node ? (
        <h2>Cargando...</h2>
      ) : (
        <div>
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
                  className="mt-6 text-justify font-serif text-xl leading-loose prose"
                />
              )}
              <p className="mt-6 font-serif text-xl leading-loose prose">
                {"$" + node.field_precio}
              </p>
              {node.field_stock > 0 ? (
                <form onSubmit={handleSubmitCart} className="flex flex-col">
                <div className="flex flex-col mb-4 mt-4">
                  <label className="text-sm align-left text-slate-600 mb-1" htmlFor="ammount">Cantidad:</label>
                  <input
                    className="border-slate-600"
                    type="number"
                    id="ammount"
                    name="ammount"
                    value={ammount}
                    onChange={(e) => setAmmount(Number(e.target.value))}
                  />
                </div>
                <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" type="submit">Agregar al carrito</button>
              </form>
              ) : (
                <div className="flex flex-row justify-between items-center">
                  <p className="mt-6 font-serif text-xl leading-loose prose mb-4">
                    Actualmente no disponible
                  </p>
                  <Link className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" href="/">Segui comprando</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
