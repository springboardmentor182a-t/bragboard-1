export function Button({ children, variant, size, onClick }) {
  const base = "px-3 py-1 rounded-2xl font-medium";
  const styles = variant === "outline" ? "border border-gray-400" : "bg-blue-500 text-white";
  return <button className={`${base} ${styles}`} onClick={onClick}>{children}</button>;
}