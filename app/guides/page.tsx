import { getAllGuides } from '@/lib/guides/content'
import { GuidesIndex } from '@/components/guides/guides-index'

export const metadata = {
  title: 'Guides | Rêve',
  description: 'Learn how to unlock the power of your dreams and transform your reality with Image Rehearsal Therapy.',
}

export default function GuidesPage() {
  const guides = getAllGuides()

  return <GuidesIndex guides={guides} />
}
