// React Native Testing Library extended matchers are added via the matchers entry
// point (the /extend-expect path does not exist in this version of RNTL)
import '@testing-library/react-native/matchers';

jest.mock('@/components/common/toast/ToastProvider', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => children,
  useToast: () => ({ showToast: jest.fn(), hideToast: jest.fn() }),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return new Proxy(
    {},
    {
      get: (_target, name) =>
        function MockIcon({ testID }: { testID?: string }) {
          return React.createElement(Text, { testID }, String(name));
        },
    },
  );
});

// Silence noisy console output from React Native components in tests
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation((msg: string) => {
  // Re-throw actual test errors but suppress RN internal warnings
  if (typeof msg === 'string' && msg.includes('Warning:')) return;
  // eslint-disable-next-line no-console
  console.error(msg);
});
