import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Award, Truck } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-red-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="text-primary">🕉️ PujaSamagri</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your trusted companion in spiritual journey, bringing authentic Hindu puja items and sacred accessories to
            devotees worldwide.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Sacred Journey</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded with deep reverence for Hindu traditions, PujaSamagri began as a humble endeavor to make
                  authentic spiritual items accessible to every devotee. Our journey started in the sacred city of
                  Kathmandu, where spirituality flows through every street and temple.
                </p>
                <p>
                  We understand that each puja item carries profound significance in your spiritual practice. From the
                  gentle fragrance of incense that carries your prayers upward, to the sacred idols that embody divine
                  presence, every product in our collection is carefully selected for its authenticity and spiritual
                  value.
                </p>
                <p>
                  Today, we serve thousands of families worldwide, helping them maintain their spiritual connections and
                  cultural traditions, no matter where they are.
                </p>
              </div>
            </div>
            <div className="relative w-120 h-120 ">
              <img
                src="/puja.jpg"
                alt="Traditional puja ceremony"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Sacred Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide us in serving the spiritual community with devotion and integrity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Devotion</h3>
                <p className="text-sm text-muted-foreground">
                  Every product is selected with deep respect for its spiritual significance and traditional value.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Authenticity</h3>
                <p className="text-sm text-muted-foreground">
                  We source only genuine, traditional items that honor the sacred practices of Hinduism.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Building bridges between devotees worldwide, fostering spiritual connections across borders.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Service</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated to delivering spiritual items with care, ensuring they reach you in perfect condition.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">Our Sacred Mission</h2>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              "To preserve and promote the rich traditions of Hindu spirituality by making authentic puja items
              accessible to devotees everywhere, fostering deeper connections with the divine in every home."
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">Authentic Products</Badge>
              <Badge variant="secondary">Global Delivery</Badge>
              <Badge variant="secondary">Spiritual Guidance</Badge>
              <Badge variant="secondary">Cultural Preservation</Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
