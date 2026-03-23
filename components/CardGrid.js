export default function CardGrid({ columns = 3, children }) {
  const columnsMap = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return <div className={`grid gap-4 ${columnsMap[columns] || columnsMap[3]}`}>{children}</div>;
}
