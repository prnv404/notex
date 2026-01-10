import { redirect } from 'next/navigation'

export default async function Home() {
  // Redirect to notes page (middleware will handle auth)
  redirect('/')
}
