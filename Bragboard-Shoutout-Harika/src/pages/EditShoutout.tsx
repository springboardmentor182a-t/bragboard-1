import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useShoutout } from '@/hooks/useShoutouts';
import { useUpdateShoutoutFull } from '@/hooks/useShoutouts';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShoutoutForm } from '@/components/shoutout/ShoutoutForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, ArrowLeft } from 'lucide-react';

export default function EditShoutout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: shoutout, isLoading, error } = useShoutout(id!);
  const updateMutation = useUpdateShoutoutFull();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (shoutout && user && shoutout.author_id !== user.id) {
      navigate('/shoutouts');
    }
  }, [shoutout, user, navigate]);

  if (loading || !user) return null;

  const handleSubmit = async (data: {
    title: string;
    message: string;
    is_public: boolean;
    recipient_ids: string[];
    tag_ids: string[];
  }) => {
    await updateMutation.mutateAsync({
      id: id!,
      ...data
    });
    navigate(`/shoutouts/${id}`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="h-12 bg-muted animate-pulse rounded" />
                <div className="h-32 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (error || !shoutout) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <h2 className="text-xl font-semibold">Shoutout not found</h2>
          <p className="text-muted-foreground mt-2">This shoutout may have been deleted.</p>
          <Button className="mt-4" onClick={() => navigate('/shoutouts')}>
            Back to Shoutouts
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="animate-scale-in">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-glow">
                <Edit className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Edit Shoutout</CardTitle>
            <CardDescription>
              Update your shoutout details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ShoutoutForm
              mode="edit"
              initialData={shoutout}
              onSubmit={handleSubmit}
              isSubmitting={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
