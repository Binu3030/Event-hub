import { Header } from '@/src/components/header'
import { Hero } from '@/src/components/hero'
import { FeaturedEvents } from '@/src/components/featured-events'
import { Features } from '@/src/components/features'
import { CTASection } from '@/src/components/Navbar'
import { Footer } from '@/src/components/footer'

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
