'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function FullscreenToggle() {
  const router = useRouter();

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    router.push('/dashboard');
  };

  return <Button onClick={exitFullscreen}>Exit Study Mode</Button>;
}
