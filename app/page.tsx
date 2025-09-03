import { HeroSection } from "@/components/hero-section"
import { PackagesSection } from "@/components/packages-section"
import { RecentProductsSection } from "@/components/recent-products-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* <HeroSection /> */}
        <PackagesSection />
        <RecentProductsSection />
      </main>
      {/* <Footer /> */}
    </div>
  )
}
