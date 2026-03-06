import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, FolderKanban, Users } from 'lucide-react';
import { api } from '../../lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ projects: 0, skills: 0, views: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch projects count
                const projectsData = await api.get('/admin/projects');
                const projectsCount = Array.isArray(projectsData) ? projectsData.length : 0;

                // Fetch skills count
                const skillsData = await api.get('/admin/skills');
                const skillsCount = Array.isArray(skillsData) ? skillsData.length : 0;

                setStats(prev => ({ ...prev, projects: projectsCount, skills: skillsCount }));
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
                // Mock data for testing if backend fails
                setStats(prev => ({ ...prev, projects: 2, skills: 3 }));
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome to your portfolio admin portal. Here's an overview of your site.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="glass-card shadow-sm border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats.projects}</div>
                        <p className="text-xs text-muted-foreground">Managed in your portfolio</p>
                    </CardContent>
                </Card>

                <Card className="glass-card shadow-sm border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{stats.skills}</div>
                        <p className="text-xs text-muted-foreground">Showcased on your profile</p>
                    </CardContent>
                </Card>

                <Card className="glass-card shadow-sm border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Access Level</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-400">Administrator</div>
                        <p className="text-xs text-muted-foreground">Full access granted</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
