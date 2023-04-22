import Head from "next/head"
import { GetStaticPropsResult } from "next"
import { DrupalNode } from "next-drupal"
import { drupal } from "lib/drupal"
import { Layout } from "components/layout"
import { NodeItemTeaser } from "components/node--item--teaser"

export default function IndexPage({ nodes, terms }) {
  return (
    <Layout>
      <Head>
        <title>Ecommerce</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      <div>
        <h1 className="mb-10 text-6xl font-black">Products</h1>
        <div className="flex justify-between gap-10">
        {nodes?.length ? (
          nodes.map((node) => (
            <div key={node.id}>
              <NodeItemTeaser node={node} terms={terms} />
              <hr className="my-10" />
            </div>
          ))
        ) : (
          <p className="py-4">No nodes found</p>
        )}
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const nodes = await drupal.getResourceCollection(
    "node--item",
    {
      params: {
        "filter[status]": 1,
        sort: "-created",
        "include": "field_item_img"
      },
      
    }
  )

  const terms = await drupal.getResourceCollection(
    "taxonomy_term--tipo_item",
  )


  return {
    props: {
      nodes,
      terms
    },
  }
}
