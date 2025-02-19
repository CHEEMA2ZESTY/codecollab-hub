export default function Button({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-transparent px-4 py-2 text-lg font-medium bg-gray-800 text-white cursor-pointer transition-colors hover:border-blue-500 focus:outline focus:outline-4 focus:outline-blue-300"
    >
      {label}
    </button>
  );
}
