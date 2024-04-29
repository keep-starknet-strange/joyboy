import Header from 'src/components/Header'

export default function Layout({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
