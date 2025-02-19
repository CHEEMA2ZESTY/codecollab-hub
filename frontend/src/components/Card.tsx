export default function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="rounded-xl bg-gray-800 p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
        <div className="text-gray-300">{children}</div>
      </div>
    );
  }
  