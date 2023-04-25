export function formatDate(input: string): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(input: string) {
  return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${input}`
}

function sortByDate(a, b) {
  const dateA = new Date(a.created);
  const dateB = new Date(b.created);
  return dateA.getTime() - dateB.getTime();
};

export const sortingBasedOnOrder = {
  "Más nuevo a más viejo": (a, b) => sortByDate(b, a),
  "Más viejo a más nuevo": (a, b) => sortByDate(a, b),
  "Menor precio": (a, b) => {
    if (a.field_stock == 0) return 1;
    if (b.field_stock == 0) return -1;
    return a.field_precio - b.field_precio;
  },
  "Mayor precio": (a, b) => {
    if (a.field_stock == 0) return 1;
    if (b.field_stock == 0) return -1;
    return b.field_precio - a.field_precio;
  },
};