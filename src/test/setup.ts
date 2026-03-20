// React Native Testing Library extended matchers are added via the matchers entry
// point (the /extend-expect path does not exist in this version of RNTL)
import '@testing-library/react-native/matchers';

// Silence noisy console output from React Native components in tests
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation((msg: string) => {
  // Re-throw actual test errors but suppress RN internal warnings
  if (typeof msg === 'string' && msg.includes('Warning:')) return;
  // eslint-disable-next-line no-console
  console.error(msg);
});
