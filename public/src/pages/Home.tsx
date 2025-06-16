/* eslint-disable @typescript-eslint/no-explicit-any */
import bridge from "@/assets/bridge.png";
import community from "@/assets/community.png";
import jig from "@/assets/jigsaw.png";
import responsive from "@/assets/responsive.png";
import pc from "@/assets/PatentCommer.png";
import ipFile from "@/assets/IPFile.png";
import cpfi from "@/assets/CustomPatentForIndus.png";
import coi from "@/assets/CommunityOfInnovators.png";
import star from "@/assets/stars.png";
import logo from "@/assets/Squirrelip.png";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin } from "lucide-react";
function Home() {
  const services = [
    {
      image: pc,
      title: "Patent Customization",
      description:
        "We customize patents for industries, catering to the unique needs of each sector to ensure comprehensive protection of your innovations.",
    },
    {
      image: ipFile,
      title: "Patent Commercialization",
      description:
        "At Squirrel IP, we streamline patent commercialization by linking innovation with industries and developing a platform to bring new ideas to market.",
    },
    {
      image: coi,
      title: "Community of Innovators",
      description:
        "Join our innovator community, where you can connect with like-minded individuals and collaborate on groundbreaking projects.",
    },
    {
      image: cpfi,
      title: "Custom Patents for Industries",
      description:
        "We provide tailored patent solutions for various industries, ensuring that your innovations receive the protection they deserve.",
    },
  ];
  const features = [
    {
      id: 1,
      icon: jig,
      title: "All in 1",
      description: "Our platform has all the tools innovators need.",
    },
    {
      id: 2,
      icon: bridge,
      title: "Building a Bridge",
      description: "We create a strong link between innovators and industries.",
    },
    {
      id: 3,
      icon: community,
      title: "A Community",
      description:
        "A welcoming space where innovators can meet and collaborate.",
    },
    {
      id: 4,
      icon: responsive,
      title: "Accessible to All",
      description: "Making patent commercialization easy for everyone.",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            "Protect. Collaborate. Innovate."
          </h1>
          <p className="text-xl mb-8">
            Join us and unlock world of possibilities!!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() =>
                document
                  .getElementById("section2")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Join the Wishlist
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/about")}
            >
              About us
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="relative pt-20">
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 object-contain z-10"
                />
                <Card className="relative group transition-colors duration-300 hover:bg-black pt-24">
                  <CardHeader>
                    <CardTitle className="text-center group-hover:text-white transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground group-hover:text-white/70 transition-colors">
                      {service.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full group-hover:bg-white group-hover:text-black transition-colors">
                      Know More
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8 lg:mb-12">
            <img src={star} alt="star" className="w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              WHY US
            </h2>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <CardHeader className="text-center px-4 sm:px-6">
              <CardDescription className="max-w-2xl mx-auto text-base sm:text-lg">
                At SQUIRREL IP, we are committed to making patent
                commercialization simple and accessible. Here's why we stand
                out:
              </CardDescription>
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature) => (
                <Card
                  key={feature.id}
                  className="transition-all hover:shadow-lg"
                >
                  <CardHeader className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6">
                    <div className="flex justify-center">
                      <img
                        src={feature.icon}
                        alt={feature.title}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-contain dark:filter dark:invert dark:brightness-0 dark:invert"
                      />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <p className="text-muted-foreground text-center text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="section2" className="py-16 bg-muted max-w-4xl mx-auto">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="mb-8">We'll be happy to hear from you</p>
          <Button asChild size="lg">
            <a
              href="https://forms.gle/qSQUZYnaAMJuFhcZ7"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fill this form and start your journey with us!
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white">
        <div className="container px-4 mx-auto py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <img
                src={logo}
                alt="Squirrel IP Logo"
                className="size-14 sm:size-16"
              />
              <p className="text-zinc-300">Follow Us On</p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-zinc-800 hover:bg-zinc-700 rounded-full"
                  asChild
                >
                  <a
                    href="https://www.linkedin.com/company/squirrelip/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-zinc-800 hover:bg-zinc-700 rounded-full"
                  asChild
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">CONTACT US</h3>
              <div className="space-y-2 text-zinc-300">
                <p>Phone: +91 7977563694</p>
                <p>Email: info.squirrelip@gmail.com</p>
                <p>Working Days: Monday to Saturday</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">SERVICES</h3>
              <div className="space-y-2 text-zinc-300">
                <p>Patent Filing</p>
                <p>Patent Commercialization</p>
                <p>Patent Customization</p>
                <p>Patent Workforce Community</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">PAGES</h3>
              <div className="flex flex-col ">
                <Button
                  variant="link"
                  className="p-0 text-zinc-300 hover:text-white justify-start"
                  onClick={() => navigate("/about")}
                >
                  About
                </Button>
                <Button
                  variant="link"
                  className="p-0 text-zinc-300 hover:text-white justify-start"
                  onClick={() => navigate("/marketplace")}
                >
                  New Innovation
                </Button>
                <Button
                  variant="link"
                  className="p-0 text-zinc-300 hover:text-white justify-start"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="bg-zinc-900 text-zinc-400 py-4 text-center text-sm border-t border-zinc-800">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>© 2024 Squirrel-IP. All rights reserved.</p>
            <div className="flex gap-4">
              <Button
                variant="link"
                className="p-0 text-zinc-400 hover:text-white text-sm"
              >
                Privacy Policy
              </Button>
              <Button
                variant="link"
                className="p-0 text-zinc-400 hover:text-white text-sm"
              >
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
