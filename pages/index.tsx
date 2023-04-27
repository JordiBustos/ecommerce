import Head from "next/head";
import { drupal } from "lib/drupal";
import { Layout } from "components/layout";
import { CheckboxItem } from "components/checkboxs";
import { NodeItemTeaser } from "components/node--item--teaser";
import { Key, SetStateAction, useEffect, useState } from "react";
import { sortingBasedOnOrder } from "lib/utils";
import { useDebounce } from "hooks/useDebounce";
import { DrupalNode } from "next-drupal";

const order = [
  "Más nuevo a más viejo",
  "Más viejo a más nuevo",
  "Menor precio",
  "Mayor precio",
];

export default function IndexPage({ nodes, terms, error }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [renderNodes, setRenderNodes] = useState(nodes);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [hideOutOfStock, sethideOutOfStock] = useState(false);

  useEffect(() => {
    filterSearchQuery(nodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const filterSearchQuery = (nodes: any[]) => {
    if (debouncedSearch !== "") {
      let new_nodes = nodes.filter((node: DrupalNode) =>
        node.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setRenderNodes(new_nodes);
    } else {
      setRenderNodes(nodes);
    }
  };

  const handleSelectFilter = (event: { target: { value: SetStateAction<string>; }; }) => setSelectedFilter(event.target.value);
  const handleCategorySelect = (event: { target: { value: any; checked: any; }; }) => {
    const category = event.target.value;

    event.target.checked
      ? setSelectedCategories([...selectedCategories, category])
      : setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  const renderListOfItems = (node: DrupalNode) => {
    if (hideOutOfStock && node.field_stock == 0) return null;

    const nodeCategory =
      terms[node.field_tipo.resourceIdObjMeta.drupal_internal__target_id - 1]
        .name;

    return selectedCategories.includes(nodeCategory) ||
      selectedCategories.length == 0 ? (
      <NodeItemTeaser key={node.id} node={node} terms={terms} />
    ) : null;
  };

  return (
    <Layout>
      <Head>
        <title>Ecommerce</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      <section>
        <div className="flex justify-between">
          <h1 className="w-1/3 mb-10 text-6xl font-black">Productos</h1>
          <input
            type="text"
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-1 mb-10 w-2/3 rounded shadow-md transition duration-300 ease-in-out hover:shadow-xl hover:border-transparent hover:ring-2 hover:ring-purple-600"
          />
        </div>
        <div id="filters" className="flex justify-between mb-10">
          {terms.map((category: { id: Key; }) => (
            <CheckboxItem
              key={category.id}
              category={category}
              selectedCategories={selectedCategories}
              handleChange={handleCategorySelect}
            />
          ))}
          <div>
            <select
              id="sorting"
              value={selectedFilter}
              onChange={handleSelectFilter}
              className="p-1"
            >
              {order.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </div>
        </div>
        {terms.length ? (
          <div className="flex justify-end">
            <CheckboxItem
              category={{ id: "Ocultar agotados", name: "Ocultar agotados" }}
              selectedCategories={[hideOutOfStock ? "Ocultar agotados" : ""]}
              handleChange={() => sethideOutOfStock(!hideOutOfStock)}
            />
          </div>
        ) : null}
      </section>
      <hr className="my-10" />
      <section>
        <div className="flex flex-wrap justify-evenly gap-1">
          {renderNodes?.length ? (
            renderNodes
              .sort(sortingBasedOnOrder[selectedFilter])
              .map(renderListOfItems)
          ) : error ? (
            <p className="py-4 font-bold text-2xl">{error}</p>
          ) : (
            <p className="py-4 font-bold text-2xl">
              No se han hallado productos.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const nodes = await drupal.getResourceCollection("node--item", {
      params: {
        "filter[status]": 1,
        sort: "-created",
        include: "field_item_img",
      },
    });
    const terms = await drupal.getResourceCollection(
      "taxonomy_term--tipo_item"
    );
    return {
      props: {
        nodes,
        terms,
        error: "",
      },
    };
  } catch (error) {
    return {
      props: {
        nodes: [],
        terms: [],
        error: error.message,
      },
    };
  }
}
