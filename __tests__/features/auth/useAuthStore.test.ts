import { useAuthStore } from '@features/auth/store/useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      isAuthenticated: false,
      isPinEnabled: false,
      pinHash: null,
    });
  });

  it('should initialize with default values', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isPinEnabled).toBe(false);
  });

  it('should create PIN correctly', () => {
    const { createPin } = useAuthStore.getState();
    createPin('1234');
    const state = useAuthStore.getState();
    expect(state.isPinEnabled).toBe(true);
    expect(state.pinHash).not.toBeNull();
  });

  it('should verify correct PIN', () => {
    const { createPin } = useAuthStore.getState();
    createPin('1234');
    const { verifyAndLogin } = useAuthStore.getState();
    expect(verifyAndLogin('1234')).toBe(true);
  });

  it('should reject incorrect PIN', () => {
    const { createPin } = useAuthStore.getState();
    createPin('1234');
    const { verifyAndLogin } = useAuthStore.getState();
    expect(verifyAndLogin('5678')).toBe(false);
  });

  it('should authenticate on correct PIN', () => {
    const { createPin } = useAuthStore.getState();
    createPin('1234');
    const { verifyAndLogin } = useAuthStore.getState();
    verifyAndLogin('1234');
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
  });

  it('should change PIN', () => {
    const { createPin } = useAuthStore.getState();
    createPin('1234');
    const { changePin, verifyAndLogin } = useAuthStore.getState();
    changePin('1234', '5678');
    expect(verifyAndLogin('5678')).toBe(true);
    expect(verifyAndLogin('1234')).toBe(false);
  });

  it('should lock', () => {
    const { createPin, verifyAndLogin, lock } = useAuthStore.getState();
    createPin('1234');
    verifyAndLogin('1234');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    lock();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
