export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
        <span>CodeToolbox &copy; {new Date().getFullYear()}</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
