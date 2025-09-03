import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-muted to-card py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Sacred Puja Samagri for Your
                <span className="text-primary"> Spiritual Journey</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Discover authentic Hindu puja items, blessed accessories, and traditional spiritual products to enhance
                your devotional practices. Quality guaranteed, tradition preserved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                View Packages
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Authentic Products</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Blessed Items</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
              <img
                src="/beautiful-hindu-puja-setup-with-diyas--flowers--an.png"
                alt="Traditional Puja Setup"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">1000+</div>
              <div className="text-sm opacity-90">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
