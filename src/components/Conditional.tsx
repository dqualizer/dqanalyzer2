export default function Conditional({
  showWhen,
  children,
}: Readonly<{
  showWhen: boolean;
  children: React.ReactNode;
}>) {
  if (showWhen) {
    return <>{children}</>;
  }
  return null;
}
