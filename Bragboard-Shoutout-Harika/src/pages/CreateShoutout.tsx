import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { CreateShoutoutForm } from '@/components/shoutout/CreateShoutoutForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function CreateShoutout() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="animate-scale-in">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-glow">
                <Sparkles className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Create a Shoutout</CardTitle>
            <CardDescription>
              Recognize someone's great work and spread positivity!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <CreateShoutoutForm />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
