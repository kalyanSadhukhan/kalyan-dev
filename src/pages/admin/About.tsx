import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

const aboutSchema = z.object({
    bioParagraph1: z.string().min(1, 'Paragraph 1 is required'),
    bioParagraph2: z.string().min(1, 'Paragraph 2 is required'),
    bioParagraph3: z.string().min(1, 'Paragraph 3 is required'),
    profileImageUrl: z.string().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export default function AdminAbout() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const form = useForm<AboutFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues: {
            bioParagraph1: '',
            bioParagraph2: '',
            bioParagraph3: '',
            profileImageUrl: '',
        },
    });

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const data = await api.get('/admin/about');
                if (data) {
                    form.reset({
                        bioParagraph1: data.bioParagraph1 || '',
                        bioParagraph2: data.bioParagraph2 || '',
                        bioParagraph3: data.bioParagraph3 || '',
                        profileImageUrl: data.profileImageUrl || '',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch about data', error);
                toast.info('No existing about data found. You can set it now.');
                // Provide mock data if the backend endpoint fails so UI can be tested
                form.reset({
                    bioParagraph1: "Hey there! I'm a passionate software developer currently pursuing my B.Tech in Computer Science Engineering with a specialization in AI & ML, graduating in 2027. What drives me is the pursuit of craftsmanship—writing code that's not just functional, but elegant, maintainable, and built to last.",
                    bioParagraph2: "I'm fascinated by the intersection of artificial intelligence and practical software engineering. Whether it's building robust backend systems, exploring machine learning algorithms, or crafting intuitive user interfaces, I approach every project with curiosity and a commitment to solid fundamentals.",
                    bioParagraph3: "Beyond code, you'll find me strumming my guitar, experimenting with new recipes in the kitchen, or gazing at the stars pondering the universe. I believe the best solutions come from diverse experiences and collaborative minds working together.",
                    profileImageUrl: ""
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutData();
    }, [form]);

    const onSubmit = async (data: AboutFormValues) => {
        setIsSubmitting(true);
        try {
            if (selectedFile) {
                // If there's a file, send as FormData
                const formData = new FormData();
                formData.append('bioParagraph1', data.bioParagraph1);
                formData.append('bioParagraph2', data.bioParagraph2);
                formData.append('bioParagraph3', data.bioParagraph3);
                if (data.profileImageUrl) formData.append('profileImageUrl', data.profileImageUrl);
                formData.append('profileImage', selectedFile); // The actual file

                await api.putFormData('/admin/about', formData);
            } else {
                // Otherwise send pure JSON
                await api.put('/admin/about', data);
            }
            toast.success('About section updated successfully');
            setSelectedFile(null); // Reset file selection on success
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to update about section');
            } else {
                toast.error('Failed to update about section');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold tracking-tight">About Section</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your biography text and profile image.
                </p>
            </div>

            <Card className="glass-card shadow-sm border-white/5">
                <CardHeader>
                    <CardTitle>Edit Content</CardTitle>
                    <CardDescription>
                        This text will appear in the About section of your portfolio.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="bioParagraph1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Paragraph 1 (Intro)</FormLabel>
                                            <FormControl>
                                                <Textarea className="min-h-[100px] bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bioParagraph2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Paragraph 2 (Interests/Core Concepts)</FormLabel>
                                            <FormControl>
                                                <Textarea className="min-h-[100px] bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bioParagraph3"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Paragraph 3 (Hobbies/Closing)</FormLabel>
                                            <FormControl>
                                                <Textarea className="min-h-[100px] bg-background/50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4 border-t border-border/50 pt-4 mt-6">
                                <h3 className="text-lg font-medium">Media</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="profileImageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Profile Image URL (Alternative to upload)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com/me.jpg" className="bg-background/50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormItem>
                                        <FormLabel>Upload Profile Image File</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="bg-background/50 cursor-pointer"
                                                onChange={handleFileChange}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {selectedFile ? `Selected: ${selectedFile.name}` : 'Upload a local image file to replace the URL.'}
                                        </p>
                                    </FormItem>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
