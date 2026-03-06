import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

export const Projects = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await api.get('/api/projects');
                if (Array.isArray(data)) {
                    setProjects(data);
                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
                // Provide mock fallback data if backend isn't ready
                setProjects([
                    {
                        id: '1',
                        title: 'Hotel Reservation System',
                        description: 'Complete CRUD operations for bookings, updates, and reservations with robust database integration and optimized queries.',
                        tags: ['Java', 'JDBC', 'SQL', 'GitHub'],
                        githubUrl: 'https://github.com/kalyanSadhukhan/Hotel-Reservation-System',
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (isLoading) {
        return (
            <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </section>
        );
    }

    if (projects.length === 0) {
        return null; // Don't render if no projects
    }

    return (
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

            <div className="container mx-auto relative z-10">
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
                        Featured <span className="gradient-text">Projects</span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className="glass-card flex flex-col rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 animate-fade-in group"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Media Section (Image or Video) */}
                            <div className="aspect-video w-full bg-muted/30 relative overflow-hidden flex items-center justify-center">
                                {project.demoVideoPath ? (
                                    <video
                                        className="w-full h-full object-cover"
                                        controls
                                        preload="none"
                                    >
                                        {/* Assuming BASE_URL applies here if full path isn't provided. We use the raw path or prepend API URL based on how backend sends it */}
                                        <source src={project.demoVideoPath.startsWith('http') ? project.demoVideoPath : `${import.meta.env.VITE_API_URL || "http://localhost:8080"}${project.demoVideoPath}`} />
                                    </video>
                                ) : project.imageUrl ? (
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-muted-foreground font-heading opacity-50 flex items-center gap-2">
                                        <span className="text-4xl text-primary/50">{'</>'}</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <Link to={`/projects/${project.id}`}>
                                    <h3 className="font-heading font-bold text-xl mb-2 group-hover:text-primary transition-colors cursor-pointer">{project.title}</h3>
                                </Link>
                                <p className="text-muted-foreground text-sm flex-1 mb-4">{project.description}</p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {Array.isArray(project.tags) && project.tags.map((tag: string) => (
                                        <Badge key={tag} variant="outline" className="bg-primary/5 border-primary/20 text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {typeof project.tags === 'string' && project.tags.split(',').map((tag: string) => (
                                        <Badge key={tag.trim()} variant="outline" className="bg-primary/5 border-primary/20 text-xs">
                                            {tag.trim()}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex gap-4 mt-auto pt-4 border-t border-border/50 items-center justify-between">
                                    <div className="flex gap-4">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                                            >
                                                <Github className="w-4 h-4" /> Code
                                            </a>
                                        )}
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" /> Live Demo
                                            </a>
                                        )}
                                    </div>
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors ml-auto"
                                    >
                                        Details <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
