import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Instagram, Download, Mail } from "lucide-react";
import portraitImage from "@/assets/portrait.png";

const roles = ["a student", "Web Developer"];

export const Hero = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const role = roles[currentRole];
    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === role) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setCurrentRole((prev) => (prev + 1) % roles.length);
      } else {
        setDisplayText(
          isDeleting
            ? role.substring(0, displayText.length - 1)
            : role.substring(0, displayText.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRole]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/kalyan-sadhukhan/",
      label: "LinkedIn Profile",
    },
    {
      icon: Github,
      href: "https://github.com/kalyanSadhukhan",
      label: "GitHub Profile",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/your-handle",
      label: "Instagram Profile",
    },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6 animate-fade-in-left">
            <div className="space-y-2">
              <p className="text-lg text-muted-foreground">Welcome, I'm</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold">
                Kalyan
                <br />
                <span className="gradient-text">Sadhukhan</span>
              </h1>
            </div>

            {/* Typewriter effect */}
            <div className="flex items-center gap-2 text-2xl sm:text-3xl font-heading">
              <span className="text-foreground/80">I am</span>
              <span className="gradient-text font-semibold min-w-[200px]">
                {displayText}
                <span className="border-r-2 border-primary animate-pulse ml-1" />
              </span>
            </div>

            <p className="text-lg text-muted-foreground max-w-xl">
              Building reliable software with clean design and solid fundamentals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Download className="mr-2 h-5 w-5" />
                View Resume
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Me
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-12 h-12 flex items-center justify-center rounded-full glass-card hover:bg-primary/10 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <social.icon className="h-5 w-5 text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Right side - Portrait with 3D tilt effect */}
          <div className="flex justify-center lg:justify-end animate-fade-in-right">
            <div
              className="relative group"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
            >
              <div
                className="glass-card p-6 rounded-3xl transition-transform duration-500 ease-out animate-float"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
                }}
              >
                <div className="relative">
                  {/* Glow effect behind image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  
                  {/* Portrait image */}
                  <img
                    src={portraitImage}
                    alt="Kalyan Sadhukhan - Web Developer"
                    className="relative rounded-2xl w-full max-w-md shadow-2xl"
                    loading="eager"
                  />
                  
                  {/* Vignette overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
