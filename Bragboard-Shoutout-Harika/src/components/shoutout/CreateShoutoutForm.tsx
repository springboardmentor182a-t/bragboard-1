import { useNavigate } from 'react-router-dom';
import { useCreateShoutout } from '@/hooks/useShoutouts';
import { ShoutoutForm } from './ShoutoutForm';

interface CreateShoutoutFormProps {
  onSuccess?: () => void;
}

export function CreateShoutoutForm({ onSuccess }: CreateShoutoutFormProps) {
  const navigate = useNavigate();
  const createMutation = useCreateShoutout();

  const handleSubmit = async (data: {
    title: string;
    message: string;
    is_public: boolean;
    recipient_ids: string[];
    tag_ids: string[];
  }) => {
    await createMutation.mutateAsync({
      title: data.title,
      message: data.message,
      is_public: data.is_public,
      recipient_ids: data.recipient_ids,
      tag_ids: data.tag_ids
    });

    onSuccess?.();
    navigate('/shoutouts');
  };

  return (
    <ShoutoutForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={createMutation.isPending}
    />
  );
}
