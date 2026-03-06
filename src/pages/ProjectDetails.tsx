import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Github, Loader2, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';

export default function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            setIsLoading(true);
            try {
                // Fetch the specific project by ID from public API
                const response = await api.get(`/api/projects/${id}`);
                if (response) {
                    setProject(response);
                } else {
                    throw new Error('Project not found');
                }
            } catch (error) {
                console.error("Failed to fetch project details:", error);
                // Mock fallback for UI development
                setProject({
                    id,
                    title: 'Detailed Project Example',
                    description: 'This is a mock fallback project description since the backend is not returning the project yet.',
                    tags: ['React', 'TypeScript', 'Tailwind CSS'],
                    githubUrl: 'https://github.com',
                    demoUrl: 'https://demo.com',
                    readmeContent: `
# Feature Overview
This project serves as a showcase for integrating dynamic markdown content into a React application.
## Key Features
- **Live Preview:** Render markdown instantly.
- **Video Support:** Embed application demos.
- **Responsive Design:** Looks great on mobile and desktop.
                    `.trim()
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1 flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col justify-center items-center gap-4">
                    <h1 className="text-2xl font-bold font-heading">Project not found</h1>
                    <Button asChild variant="outline">
                        <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio</Link>
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-border/50">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
                    <div className="container mx-auto relative z-10 max-w-4xl">
                        <Button asChild variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
                            <Link to="/#projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects</Link>
                        </Button>

                        <div className="mb-6 flex flex-wrap gap-2">
                            {Array.isArray(project.tags) && project.tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-none">
                                    {tag}
                                </Badge>
                            ))}
                            {typeof project.tags === 'string' && project.tags.split(',').map((tag: string) => (
                                <Badge key={tag.trim()} variant="secondary" className="bg-primary/10 text-primary border-none">
                                    {tag.trim()}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6">{project.title}</h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {project.demoUrl && (
                                <Button asChild size="lg" className="glow-primary">
                                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-5 w-5" /> Live Demo
                                    </a>
                                </Button>
                            )}
                            {project.githubUrl && (
                                <Button asChild size="lg" variant="outline">
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                        <Github className="mr-2 h-5 w-5" /> Source Code
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-4xl space-y-16">

                        {/* Media Player */}
                        {(project.demoVideoPath || project.imageUrl) && (
                            <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-lg">
                                {project.demoVideoPath ? (
                                    <video
                                        className="w-full aspect-video object-cover bg-black"
                                        controls
                                        preload="metadata"
                                    >
                                        <source src={project.demoVideoPath.startsWith('http') ? project.demoVideoPath : `${import.meta.env.VITE_API_URL || "http://localhost:8080"}${project.demoVideoPath}`} />
                                    </video>
                                ) : (
                                    <img
                                        src={project.imageUrl}
                                        alt={`${project.title} cover`}
                                        className="w-full h-auto"
                                    />
                                )}
                            </div>
                        )}

                        {/* Markdown README Content */}
                        {project.readmeContent && (
                            <div className="glass-card p-8 sm:p-12 rounded-2xl border border-border/50 overflow-hidden">
                                <article className="prose prose-base sm:prose-lg dark:prose-invert prose-primary max-w-none">
                                    <ReactMarkdown>
                                        {project.readmeContent}
                                    </ReactMarkdown>
                                </article>
                            </div>
                        )}

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
