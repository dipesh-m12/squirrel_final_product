import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin } from "lucide-react";
import dummyImage from "@/assets/who-are-we.jpg"; // Dummy image path
import samrudhi from "@/assets/samrudhi.png";
import akshat from "@/assets/akshat.png";
import prasad from "@/assets/prasad.png";
import SerCenterImage from "@/assets/SerCenterImage.png";
import { useNavigate } from "react-router-dom";
// import founderlinkedin from '@/assets/founder-linkedin.png';
import logo from "@/assets/Squirrelip.png";
const About = () => {
  const navigate = useNavigate();
  const team = [
    {
      name: "Somuddhi Kharvilkar",
      role: "Co-founder & CEO",
      image: samrudhi,
      linkedin: "https://www.linkedin.com/in/samruddhi-khanvilkar",
    },
    {
      name: "Akshat Mohite",
      role: "Co-founder & COO",
      image: akshat,
      linkedin: "https://www.linkedin.com/in/cosmoakshat",
    },
    {
      name: "Prasad Karhad",
      role: "Sr. Legal Counsel",
      image: prasad,
      linkedin: "https://www.linkedin.com/in/prasadkarhad",
    },
  ];

  const services = [
    {
      title: "Patent Commercialization",
      description:
        "We assist innovators in turning their patents into successful business opportunities by helping them license or sell their intellectual property to industries. Our platform ensures that patents are not just filed but also reach the right industries, unlocking their full market potential.",
      position: "top-left",
    },
    {
      title: "Custom Patents",
      description:
        "We work with businesses to create tailored patents that solve specific industry problems. Through collaboration between innovators and companies, we develop unique, market-ready solutions that can be patented, helping industries innovate faster and more effectively.",
      position: "top-right",
    },
    {
      title: "Innovator's Community",
      description:
        "Our platform offers a dedicated space where innovators, startups, researchers, and institutions can come together to share their knowledge, discuss ongoing projects, and collaborate on new ideas. This vibrant community fosters partnerships, supports growth, and promotes innovation.",
      position: "bottom-left",
    },
    {
      title: "Patent Listing Platform",
      description:
        "Innovators can showcase their granted patents on our platform, gaining exposure to companies actively seeking new technologies. This helps bridge the gap between inventors and industries, making it easier for both parties to connect and explore partnership opportunities.",
      position: "bottom-right",
    },
  ];

  return (
    <section className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-muted py-36 px-4 text-center">
        <div className="container mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Empowering Innovation, Fueling progress
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
            SQUIRREL IP, Where ideas takes flight!
          </h2>
        </div>
      </div>
      {/* Who Are We Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <img
              src={dummyImage}
              alt="Who Are We"
              className="rounded-lg w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="border-4 border-white p-6 text-white">
                <h2 className="text-2xl font-bold">WHO ARE WE</h2>
              </div>
            </div>
          </div>
          <Card className="bg-zinc-900 text-white">
            <CardContent className="p-6 space-y-4">
              <p className="leading-relaxed">
                At SQUIRREL IP, we are building an online platform to connect
                innovators and industries, making it easier to bring new ideas
                to life. Our goal is to bridge the gap between innovation and
                commercialization by providing everything needed in one place.
              </p>
              <p className="leading-relaxed">
                We offer a range of services to help innovators commercialize
                their patents, create custom solutions for industries, and
                connect with the right partners. Our platform includes a
                marketplace for patent listings, an AI-powered tool for patent
                analysis, and a community space where innovators can share
                ideas, collaborate, and grow together.
              </p>
              <p className="leading-relaxed">
                Whether you are a scientist, startup, or industry expert,
                SQUIRREL IP is here to support your journey from innovation to
                impact. Together, we can build a thriving ecosystem for new
                technologies and unlock the full potential of patents.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Team Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member) => (
              <Card key={member.name} className="group overflow-hidden">
                <div className="relative aspect-[3/4] w-full">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:blur-sm transition-all duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-white hover:bg-white/90"
                      >
                        <Linkedin className="h-5 w-5 text-black" />
                      </Button>
                    </a>
                  </div>
                </div>
                <CardContent className="p-4 text-center bg-white">
                  <h3 className="font-semibold text-lg mt-2">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {/* Services Section */}
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
        <div className="relative max-w-6xl mx-auto">
          {/* Border container */}
          <div className="absolute inset-0 border-2 border-zinc-900  rounded-3xl" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 relative">
            {/* Center Icon */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-4 rounded-full">
              <img src={SerCenterImage} alt="Services" className="w-24 h-24" />
            </div>

            {services.map((service) => (
              <div key={service.title}>
                <div
                  className={`
                p-8 rounded-3xl
                ${
                  service.position.includes("top-left") ||
                  service.position.includes("bottom-right")
                    ? "bg-zinc-900 text-white"
                    : "bg-gray-100"
                }
              
              `}
                >
                  {service.position.includes("top") && (
                    <div
                      className={`
                     mb-4 
                    
                   `}
                    >
                      <h3 className="font-semibold text-xl text-center">
                        {service.title}
                      </h3>
                    </div>
                  )}
                  <p
                    className={`
                  text-center 
                  ${
                    service.position.includes("top-left") ||
                    service.position.includes("bottom-right")
                      ? "text-white/90"
                      : "text-zinc-600"
                  }
                `}
                  >
                    {service.description}
                  </p>
                  {service.position.includes("bottom") && (
                    <div
                      className={`
                    mt-4 
                   
                  `}
                    >
                      <h3 className="font-semibold text-xl text-center">
                        {service.title}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Google form */}
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
    </section>
  );
};

export default About;
