import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="border-b border-zinc-800 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href="/"
            className="text-2xl font-bold text-yellow-400"
          >
            GymGen AI
          </Link>
        </div>
      </header>

      <main className="flex-1 flex justify-center items-center p-6">
        {children}
      </main>

      <footer className="border-t border-zinc-800 py-4 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} GymGen AI
      </footer>
    </div>
  );
}