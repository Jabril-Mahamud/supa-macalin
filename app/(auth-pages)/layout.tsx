export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-7xl flex flex-col gap-12 items-center" style={{ marginTop: '-20px' }}>
        {children}
      </div>
    </div>
  );
}
