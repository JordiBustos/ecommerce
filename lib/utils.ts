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

export function sortByDate(a, b) {
  const dateA = new Date(a.created);
  const dateB = new Date(b.created);
  return dateA.getTime() - dateB.getTime();
};