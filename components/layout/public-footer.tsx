import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-muted-foreground">
        <span>RaktoSheba</span>
        <nav className="flex gap-6">
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/how-it-works" className="hover:text-foreground">How it works</Link>
          <Link href="/faq" className="hover:text-foreground">FAQ</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
