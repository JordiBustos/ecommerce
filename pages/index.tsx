import Head from "next/head"
import { GetStaticPropsResult } from "next"
import { DrupalNode } from "next-drupal"
import { drupal } from "lib/drupal"
import { Layout } from "components/layout"
import { NodeItemTeaser } from "components/node--item--teaser"

export default function IndexPage({ nodes }) {
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
        {nodes?.length ? (
          nodes.map((node) => (
            <div key={node.id}>
              <NodeItemTeaser node={node} />
              <hr className="my-20" />
            </div>
          ))
        ) : (
          <p className="py-4">No nodes found</p>
        )}
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

  return {
    props: {
      nodes,
    },
  }
}
