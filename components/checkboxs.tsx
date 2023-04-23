export function CheckboxItem({category, key, selectedCategories, handleChange}) {
  return (
    <div key={key}>
      <input
        type="checkbox"
        id={category.id}
        name={category.name}
        value={category.name}
        checked={selectedCategories.includes(category.name)}
        onChange={handleChange}
        className="mr-2"
      />
      <label htmlFor={category.id}>{category.name}</label>
    </div>
  )
}