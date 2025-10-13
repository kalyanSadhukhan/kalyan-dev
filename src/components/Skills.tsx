import { Badge } from "@/components/ui/badge";
import { Code, Wrench, BookOpen, Lightbulb } from "lucide-react";

export const Skills = () => {
  const skillCategories = [
    {
      icon: Code,
      title: "Programming Languages",
      skills: ["Java", "C", "C++", "Python", "SQL", "HTML", "CSS"],
      color: "primary",
    },
    {
      icon: Wrench,
      title: "Tools & Platforms",
      skills: ["GitHub", "VS Code", "IntelliJ IDEA"],
      color: "accent",
    },
    {
      icon: BookOpen,
      title: "Core Concepts",
      skills: ["OOP", "Data Structures & Algorithms", "AI/ML", "DBMS", "Operating Systems"],
      color: "primary",
    },
  ];

  const highlightedProject = {
    title: "Hotel Reservation System",
    tech: ["Java", "JDBC", "SQL", "GitHub"],
    points: [
      "Complete CRUD operations for bookings, updates, and reservations",
      "Robust database integration with optimized queries",
      "Menu-driven console interface for seamless user interaction",
      "Centralized configuration for easy deployment",
    ],
    githubLink: "#", // Placeholder for GitHub link
  };

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {skillCategories.map((category, index) => (
            <div
              key={category.title}
              className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-${category.color}/10 rounded-lg flex items-center justify-center`}>
                  <category.icon className={`h-5 w-5 text-${category.color}`} />
                </div>
                <h3 className="font-heading font-semibold text-lg">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors duration-300 cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Highlighted Project */}
        <div className="max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="glass-card p-8 rounded-2xl border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-2xl">{highlightedProject.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {highlightedProject.tech.map((tech) => (
                    <Badge key={tech} variant="outline" className="border-primary/30 text-primary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <ul className="space-y-3 mb-6">
              {highlightedProject.points.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground/80">
                  <span className="text-primary mt-1">▹</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <a
              href={highlightedProject.githubLink}
              className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2"
            >
              View on GitHub
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
