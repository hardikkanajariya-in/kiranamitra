import { useSettingsStore } from '@features/settings/store/useSettingsStore';

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      language: 'en',
      isDarkMode: false,
      storeProfile: {
        name: '',
        address: '',
        phone: '',
        gstNumber: '',
      },
    });
  });

  it('should initialize with default values', () => {
    const state = useSettingsStore.getState();
    expect(state.language).toBe('en');
    expect(state.isDarkMode).toBe(false);
    expect(state.storeProfile.name).toBe('');
  });

  it('should set language', () => {
    const { setLanguage } = useSettingsStore.getState();
    setLanguage('hi');
    expect(useSettingsStore.getState().language).toBe('hi');
  });

  it('should toggle dark mode', () => {
    const { setDarkMode } = useSettingsStore.getState();
    setDarkMode(true);
    expect(useSettingsStore.getState().isDarkMode).toBe(true);
  });

  it('should update store profile partially', () => {
    const { setStoreProfile } = useSettingsStore.getState();
    setStoreProfile({ name: 'My Kirana Store' });

    const state = useSettingsStore.getState();
    expect(state.storeProfile.name).toBe('My Kirana Store');
    expect(state.storeProfile.address).toBe(''); // unchanged
  });

  it('should update full store profile', () => {
    const { setStoreProfile } = useSettingsStore.getState();
    setStoreProfile({
      name: 'Test Store',
      address: '123 Street',
      phone: '9876543210',
      gstNumber: 'GST123',
    });

    const state = useSettingsStore.getState();
    expect(state.storeProfile.name).toBe('Test Store');
    expect(state.storeProfile.phone).toBe('9876543210');
  });

  it('should reset settings', () => {
    const { setLanguage, setDarkMode, setStoreProfile, resetSettings } = useSettingsStore.getState();
    setLanguage('gu');
    setDarkMode(true);
    setStoreProfile({ name: 'Store' });

    resetSettings();
    const state = useSettingsStore.getState();
    expect(state.language).toBe('en');
    expect(state.isDarkMode).toBe(false);
    expect(state.storeProfile.name).toBe('');
  });
});
