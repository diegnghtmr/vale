import i18n, { i18nInstance } from './i18n';

it('initializes from bundled resources and switches between English and Spanish', async () => {
  expect(i18n.isInitialized).toBe(true);
  await i18nInstance;

  await i18n.changeLanguage('es');
  expect(i18n.t('common.language')).toBe('Idioma');
  expect(localStorage.getItem('i18nextLng')).toBe('es');

  await i18n.changeLanguage('en');
  expect(i18n.t('common.language')).toBe('Language');
  expect(localStorage.getItem('i18nextLng')).toBe('en');
});
