import { useAuthStore } from '@features/auth/store/useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      isAuthenticated: false,
      isPinSet: false,
      pinHash: null,
    });
  });

  it('should initialize with default values', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isPinSet).toBe(false);
  });

  it('should set PIN correctly', () => {
    const { setPin } = useAuthStore.getState();
    setPin('1234');
    const state = useAuthStore.getState();
    expect(state.isPinSet).toBe(true);
    expect(state.pinHash).not.toBeNull();
  });

  it('should verify correct PIN', () => {
    const { setPin, verifyPin } = useAuthStore.getState();
    setPin('1234');
    expect(verifyPin('1234')).toBe(true);
  });

  it('should reject incorrect PIN', () => {
    const { setPin, verifyPin } = useAuthStore.getState();
    setPin('1234');
    expect(verifyPin('5678')).toBe(false);
  });

  it('should authenticate on correct PIN', () => {
    const { setPin, verifyPin } = useAuthStore.getState();
    setPin('1234');
    verifyPin('1234');
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
  });

  it('should change PIN', () => {
    const { setPin, changePin, verifyPin } = useAuthStore.getState();
    setPin('1234');
    changePin('5678');
    expect(verifyPin('5678')).toBe(true);
    expect(verifyPin('1234')).toBe(false);
  });

  it('should logout', () => {
    const { setPin, verifyPin, logout } = useAuthStore.getState();
    setPin('1234');
    verifyPin('1234');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
