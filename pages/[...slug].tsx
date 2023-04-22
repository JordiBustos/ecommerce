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
  return {
    paths: await drupal.getStaticPathsFromContext(RESOURCE_TYPES, context),
    fallback: "blocking",
  }
}

export async function getStaticProps(context){
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
  // At this point, we know the path exists and it points to a resource.
  // If we receive an error, it means something went wrong on Drupal.
  // We throw an error to tell revalidation to skip this for now.
  // Revalidation can try again on next request.
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
}
