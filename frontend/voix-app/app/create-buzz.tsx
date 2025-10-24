import { router } from 'expo-router';
import CreateBuzzPage from '../components/pages/create-buzz/CreateBuzzPage';

export default function CreateBuzzModal() {
  const handleClose = () => {
    router.back();
  };

  const handlePost = (content: string, image: string | null) => {
    console.log('Posting buzz:', { content, image });
    // TODO: Implement actual post creation
  };

  return <CreateBuzzPage onClose={handleClose} onPost={handlePost} />;
}

