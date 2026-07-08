export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-muted/40 p-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-primary">Monetra</h1>
        <p className="text-sm text-muted-foreground">Gestão financeira inteligente</p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
