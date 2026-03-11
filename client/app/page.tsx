import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { FeaturedEvents } from '@/components/featured-events'
import { Features } from '@/components/features'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <FeaturedEvents />
      <Features />
      <CTASection />
      <Footer />
    </main>
  )
}
