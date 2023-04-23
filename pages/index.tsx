import Head from "next/head";
import { drupal } from "lib/drupal";
import { Layout } from "components/layout";
import { NodeItemTeaser } from "components/node--item--teaser";
import { useState } from "react";
import { sortByDate } from "lib/utils";

const filters = ["Más nuevo a más viejo", "Más viejo a más nuevo", "Menor precio", "Mayor precio"];
const sorting = {
  "Más nuevo a más viejo": (a, b) => sortByDate(b, a),
  "Más viejo a más nuevo": (a, b) => sortByDate(a, b),
  "Menor precio": (a, b) => a.field_precio - b.field_precio,
  "Mayor precio": (a, b) => b.field_precio - a.field_precio,
}


export default function IndexPage({ nodes, terms }) {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('')

  const handleSelectFilter = event => setSelectedFilter(event.target.value)
  const handleCategorySelect = event => {
    const category = event.target.value;
    event.target.checked
    ? setSelectedCategories([...selectedCategories, category])
    : setSelectedCategories(selectedCategories.filter(c => c !== category))
  }

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
        <div className="flex justify-between mb-10">
          {terms.map((category) => (
            <div key={category.id}>
              <input
                type="checkbox"
                id={category.id}
                name={category.name}
                value={category.name}
                checked={selectedCategories.includes(category.name)}
                onChange={handleCategorySelect}
                className="mr-2"
              />
              <label htmlFor={category.id}>{category.name}</label>
            </div>
          ))}
          <div>
            <select id="categories" value={selectedFilter} onChange={handleSelectFilter} className="p-1">
              {filters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-1">
          {nodes?.length ? (   
            nodes.sort(sorting[selectedFilter]).map((node) =>
              selectedCategories.includes(
                terms[
                  node.field_tipo.resourceIdObjMeta.drupal_internal__target_id - 1
                ].name
              ) || selectedCategories.length == 0 ? (
                <div className="basis-1/4 grow-0" key={node.id}>
                  <NodeItemTeaser node={node} terms={terms} />
                  <hr className="my-10" />
                </div>
              ) : null
            )
          ) : (
            <p className="py-4">No nodes found</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const nodes = await drupal.getResourceCollection("node--item", {
    params: {
      "filter[status]": 1,
      sort: "-created",
      include: "field_item_img",
    },
  });

  const terms = await drupal.getResourceCollection("taxonomy_term--tipo_item");

  return {
    props: {
      nodes,
      terms,
    },
  };
}
