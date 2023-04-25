import { GetStaticPathsResult, GetStaticPropsResult } from "next"
import Head from "next/head"
import { DrupalNode } from "next-drupal"
import { drupal } from "lib/drupal"
import { NodeItem } from "components/node--item"
import { Layout } from "components/layout"

const RESOURCE_TYPES = ["node--item"]

interface NodePageProps {
  resource: DrupalNode
}

export default function NodePage({ resource }: NodePageProps) {
  if (!resource) return null

  return (
    <Layout>
      <Head>
        <title>{resource.title}</title>
        <meta name="description" content="A Next.js site powered by Drupal." />
      </Head>
      {resource.type === "node--item" && <NodeItem node={resource} />}
    </Layout>
  )
}

export async function getStaticPaths(context) {
  try {
    const paths = await drupal.getStaticPathsFromContext(RESOURCE_TYPES, context)
    return {
      paths: paths,
      fallback: "blocking",
    }
  } catch (error) {
    return {
      paths: [],
      fallback: "blocking",
    }
  }
}

export async function getStaticProps(context){
  try {
    const path = await drupal.translatePathFromContext(context)
    if (!path) return { notFound: true }
    const type = path.jsonapi.resourceName

    let params = {}
    if (type === "node--item") params = { include: "field_item_img" }

    const resource = await drupal.getResourceFromContext<DrupalNode>(
      path,
      context,
      {
        params,
      }
    )

    if (!resource) {
      throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`)
    }
  
    // If we're not in preview mode and the resource is not published,
    // Return page not found.
    if (!context.preview && resource?.status === false) {
      return {
        notFound: true,
      }
    }
  
    return {
      props: {
        resource,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
