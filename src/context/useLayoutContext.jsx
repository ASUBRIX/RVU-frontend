import useToggle from '@/hooks/useToggle';
import { toggleDocumentAttribute } from '@/utils/layout';
import { createContext, useContext, useMemo, useState, useEffect } from 'react';




const ThemeContext = createContext(undefined);

const useLayoutContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useLayoutContext can only be used within LayoutProvider');
  }
  return context;
};


const storageThemeKey = 'EDUPORT_THEME_KEY';
const themeKey = 'data-bs-theme';
const LayoutProvider = ({
  children
}) => {
  // Always set light theme
  useEffect(() => {
    // Force light theme
    toggleDocumentAttribute(themeKey, 'light');
    localStorage.setItem(storageThemeKey, 'light');
  }, []);

  const INIT_STATE = {
    theme: 'light'
  };
  
  const [settings, setSettings] = useState(INIT_STATE);
  const {isTrue,toggle} = useToggle();

  // update settings
  const updateSettings = _newSettings => setSettings({
    ...settings,
    ..._newSettings
  });

  // Theme change function that always returns to light theme
  const changeTheme = () => {
    // Always force light theme
    toggleDocumentAttribute(themeKey, 'light');
    localStorage.setItem(storageThemeKey, 'light');
    updateSettings({
      ...settings,
      theme: 'light'
    });
  };
  
  const appMenuControl = {
    open: isTrue,
    toggle: toggle
  };
  
  return <ThemeContext.Provider value={useMemo(() => ({
    ...settings,
    theme: 'light',
    changeTheme,
    appMenuControl
  }), [settings, isTrue])}>
      {children}
    </ThemeContext.Provider>;
};
export { LayoutProvider, useLayoutContext };
