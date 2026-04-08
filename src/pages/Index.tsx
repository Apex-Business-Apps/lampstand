import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '@/lib/storage';

export default function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    const profile = getProfile();
    if (!profile || !profile.onboardingComplete) {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate]);
  return null;
}
