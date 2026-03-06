import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Trash2, ExternalLink, Github, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Types
interface Project {
    id: string | number;
    title: string;
    description: string;
    imageUrl?: string;
    tags?: string[] | string;
    demoUrl?: string; // external url
    demoVideoPath?: string; // backend video path
    githubUrl?: string;
    readmeContent?: string;
}

const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.string().optional(),
    tags: z.string().optional(), // Comma separated for easy input
    demoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    readmeContent: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            description: '',
            imageUrl: '',
            tags: '',
            demoUrl: '',
            githubUrl: '',
            readmeContent: '',
        },
    });

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            // Mock data for frontend testing
            setTimeout(() => {
                setProjects([
                    {
                        id: '1',
                        title: 'E-commerce Platform',
                        description: 'A full-stack e-commerce solution with cart, checkout, and admin features.',
                        tags: ['React', 'Node.js', 'Stripe'],
                        demoUrl: 'https://demo.com',
                        githubUrl: 'https://github.com'
                    },
                    {
                        id: '2',
                        title: 'AI Dashboard API',
                        description: 'A dashboard application for monitoring AI model performance.',
                        tags: ['Vue', 'Python', 'FastAPI'],
                    }
                ]);
                setIsLoading(false);
            }, 800);

            // Commented out real API call
            // const data = await api.get('/admin/projects');
            // setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch projects', error);
            toast.error('Could not load projects. The backend might not be hooked up yet.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleOpenDialog = (project?: Project) => {
        if (project) {
            setEditingProject(project);

            // Parse tags back to string for input
            let tagsStr = '';
            if (Array.isArray(project.tags)) {
                tagsStr = project.tags.join(', ');
            } else if (typeof project.tags === 'string') {
                tagsStr = project.tags;
            }

            form.reset({
                title: project.title,
                description: project.description,
                imageUrl: project.imageUrl || '',
                tags: tagsStr,
                demoUrl: project.demoUrl || '',
                githubUrl: project.githubUrl || '',
                readmeContent: project.readmeContent || '',
            });
        } else {
            setEditingProject(null);
            form.reset({
                title: '',
                description: '',
                imageUrl: '',
                tags: '',
                demoUrl: '',
                githubUrl: '',
                readmeContent: '',
            });
        }
        setSelectedVideo(null); // Reset video file when dialog opens
        setIsDialogOpen(true);
    };

    const onSubmit = async (data: ProjectFormValues) => {
        setIsSubmitting(true);
        try {
            // Process tags
            const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

            // In a real application, if we have a file, we must use FormData
            if (selectedVideo) {
                const formData = new FormData();
                formData.append('title', data.title);
                formData.append('description', data.description);
                if (data.imageUrl) formData.append('imageUrl', data.imageUrl);
                formData.append('tags', JSON.stringify(tagsArray));
                if (data.demoUrl) formData.append('demoUrl', data.demoUrl);
                if (data.githubUrl) formData.append('githubUrl', data.githubUrl);
                if (data.readmeContent) formData.append('readmeContent', data.readmeContent);
                formData.append('demoVideo', selectedVideo); // The actual file

                if (editingProject) {
                    await api.putFormData(`/admin/projects/${editingProject.id}`, formData);
                } else {
                    await api.postFormData('/admin/projects', formData);
                }
            } else {
                // Formatting data for pure JSON submission
                const formattedData = {
                    ...data,
                    tags: tagsArray
                };

                if (editingProject) {
                    await api.put(`/admin/projects/${editingProject.id}`, formattedData);
                } else {
                    await api.post('/admin/projects', formattedData);
                }
            }

            toast.success(editingProject ? 'Project updated successfully' : 'Project created successfully');
            setIsDialogOpen(false);
            fetchProjects();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to save project');
            } else {
                toast.error('Failed to save project');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string | number) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/admin/projects/${id}`);
                toast.success('Project deleted successfully');
                fetchProjects();
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message || 'Failed to delete project');
                } else {
                    toast.error('Failed to delete project');
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your portfolio projects.
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Project
                </Button>
            </div>

            <Card className="glass-card shadow-sm border-white/5">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No projects found. Ready to build your portfolio?
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border/50 hover:bg-transparent">
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden md:table-cell">Tags</TableHead>
                                    <TableHead className="hidden sm:table-cell">Links</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id} className="border-border/50">
                                        <TableCell className="font-medium">{project.title}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex gap-1 flex-wrap">
                                                {Array.isArray(project.tags)
                                                    ? project.tags.slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                                                            {tag}
                                                        </span>
                                                    ))
                                                    : <span className="text-xs text-muted-foreground">{project.tags || '—'}</span>
                                                }
                                                {Array.isArray(project.tags) && project.tags.length > 3 && (
                                                    <span className="px-2 py-0.5 rounded text-xs bg-muted">+{project.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="flex gap-2">
                                                {project.demoUrl && (
                                                    <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                )}
                                                {project.githubUrl && (
                                                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                                        <Github className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(project)}>
                                                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[1000px] w-full glass-card border-border max-h-[90vh] flex flex-col overflow-hidden">
                    <DialogHeader className="shrink-0 mb-4">
                        <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
                        <DialogDescription>
                            {editingProject ? 'Update your project details below.' : 'Fill out the form to add a new project to your portfolio.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto pr-2 pb-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="E-commerce Dashboard" className="bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="A fully responsive dashboard..." className="h-20 bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cover Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/image.jpg" className="bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tags (Comma separated)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="React, TypeScript, Tailwind" className="bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="demoUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Demo URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://demo.com" className="bg-background/50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="githubUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>GitHub URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://github.com/..." className="bg-background/50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="readmeContent"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>README Markdown</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="# Overview\nWrite your project details here..." className="h-40 bg-background/50 font-mono text-sm" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormItem>
                                    <FormLabel>Demo Video Upload</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="video/mp4,video/webm"
                                            className="bg-background/50 cursor-pointer"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setSelectedVideo(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {selectedVideo ? `Selected: ${selectedVideo.name}` : editingProject?.demoVideoPath ? 'A video is already uploaded. Upload a new one to replace it.' : 'Optional. Upload an MP4 or WebM demo video.'}
                                    </p>
                                </FormItem>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : 'Save Project'}
                                    </Button>
                                </div>
                            </form>
                        </Form>

                        {/* Markdown Preview Pane */}
                        <div className="flex flex-col h-full min-h-[400px] border border-border/50 rounded-md bg-background/30 p-4">
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Markdown Preview</h3>
                            <div className="flex-1 overflow-y-auto prose prose-sm dark:prose-invert prose-primary max-w-none">
                                <ReactMarkdown>
                                    {form.watch('readmeContent') || '*No markdown content entered.*'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
