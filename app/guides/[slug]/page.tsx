import { notFound } from 'next/navigation'
import { getGuide, getAllGuides } from '@/lib/guides/content'
import { GuideArticle } from '@/components/guides/guide-article'

interface GuidePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const guides = getAllGuides()
  return guides.map((guide) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = getGuide(slug)

  if (!guide) {
    return {
      title: 'Guide Not Found',
    }
  }

  return {
    title: `${guide.title} | Rêve Guides`,
    description: guide.description,
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = getGuide(slug)

  if (!guide) {
    notFound()
  }

  return <GuideArticle guide={guide} />
}
