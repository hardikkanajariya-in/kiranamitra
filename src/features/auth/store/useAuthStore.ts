import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from '@core/storage/zustandStorage';
import { hashPin, verifyPin } from '@shared/utils/hash';
import { getPin, setPin as storePinHash, removePin as removePinHash, isPinSet } from '@core/storage/mmkv';

interface AuthState {
  pinHash: string | null;
  isAuthenticated: boolean;
  isPinEnabled: boolean;

  // Actions
  createPin: (pin: string) => void;
  verifyAndLogin: (pin: string) => boolean;
  changePin: (currentPin: string, newPin: string) => boolean;
  lock: () => void;
  removePin: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      pinHash: null,
      isAuthenticated: false,
      isPinEnabled: false,

      initializeAuth: () => {
        const hash = getPin();
        set({
          pinHash: hash,
          isPinEnabled: !!hash,
          isAuthenticated: !hash, // If no PIN, auto-authenticate
        });
      },

      createPin: (pin: string) => {
        const hash = hashPin(pin);
        storePinHash(hash);
        set({
          pinHash: hash,
          isPinEnabled: true,
          isAuthenticated: true,
        });
      },

      verifyAndLogin: (pin: string): boolean => {
        const { pinHash } = get();
        if (!pinHash) return true;

        const isValid = verifyPin(pin, pinHash);
        if (isValid) {
          set({ isAuthenticated: true });
        }
        return isValid;
      },

      changePin: (currentPin: string, newPin: string): boolean => {
        const { pinHash } = get();
        if (!pinHash) return false;

        if (!verifyPin(currentPin, pinHash)) return false;

        const newHash = hashPin(newPin);
        storePinHash(newHash);
        set({ pinHash: newHash });
        return true;
      },

      lock: () => {
        set({ isAuthenticated: false });
      },

      removePin: () => {
        removePinHash();
        set({
          pinHash: null,
          isPinEnabled: false,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        isPinEnabled: state.isPinEnabled,
      }),
    },
  ),
);
