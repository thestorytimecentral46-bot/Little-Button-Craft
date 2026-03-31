export interface SiteSettings {
  aboutImage1: string;
  aboutImage2: string;
}

export const defaultSettings: SiteSettings = {
  aboutImage1: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
  aboutImage2: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800',
};

export const getSettings = (): SiteSettings => {
  const stored = localStorage.getItem('site_settings');
  if (stored) {
    try {
      return { ...defaultSettings, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Failed to parse settings', e);
    }
  }
  return defaultSettings;
};

export const saveSettings = (settings: SiteSettings) => {
  localStorage.setItem('site_settings', JSON.stringify(settings));
};
