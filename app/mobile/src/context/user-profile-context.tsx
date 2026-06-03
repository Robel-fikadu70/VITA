import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { saveUserProfile } from '@/lib/onboarding-storage';
import type { UserProfile } from '@/types/user-profile';
import { EMPTY_PROFILE } from '@/types/user-profile';

type UserProfileContextValue = {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  persistProfile: () => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const persistProfile = useCallback(async () => {
    await saveUserProfile(profile);
  }, [profile]);

  const value = useMemo(
    () => ({ profile, updateProfile, persistProfile }),
    [profile, updateProfile, persistProfile],
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return ctx;
}
