import Link from 'next/link'


export default function Home() {
  return (
    <main>
      <h1>NextAuth JS</h1>
      <Link href="/register">Register Page</Link>
      <Link href="/login">Login Page</Link>
    </main>
  )
}