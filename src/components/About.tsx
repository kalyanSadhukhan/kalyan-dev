import { Code2, GraduationCap, Heart } from "lucide-react";

export const About = () => {
  const highlights = [
    {
      icon: GraduationCap,
      title: "Education",
      description: "B.Tech CSE (AI & ML), Alliance University",
    },
    {
      icon: Code2,
      title: "Focus",
      description: "Building reliable, scalable software systems",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Learning, guitar, cooking, and astronomy",
    },
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              About <span className="gradient-text">Me</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>

          {/* Bio text */}
          <div className="glass-card p-8 rounded-2xl mb-8 animate-fade-in">
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              Hey there! I'm a passionate software developer currently pursuing my B.Tech in Computer Science Engineering 
              with a specialization in AI & ML, graduating in 2027. What drives me is the pursuit of craftsmanship—writing 
              code that's not just functional, but elegant, maintainable, and built to last.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              I'm fascinated by the intersection of artificial intelligence and practical software engineering. Whether it's 
              building robust backend systems, exploring machine learning algorithms, or crafting intuitive user interfaces, 
              I approach every project with curiosity and a commitment to solid fundamentals.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed">
              Beyond code, you'll find me strumming my guitar, experimenting with new recipes in the kitchen, or gazing at 
              the stars pondering the universe. I believe the best solutions come from diverse experiences and collaborative 
              minds working together.
            </p>
          </div>

          {/* Highlight cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 hover:glow-primary animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
