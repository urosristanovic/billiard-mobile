import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  useWindowDimensions,
  type ViewToken,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenLayout } from '@/components/common/layout';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { useTheme } from '@/hooks/useTheme';
import { setHasSeenOnboarding } from '@/lib/onboardingStorage';
import { styles } from './styles';

interface OnboardingScreenProps {
  onNavigateLogin: () => void;
  isDark?: boolean;
}

const SLIDES = [
  { key: 'welcome', icon: '◎' },
  { key: 'matches', icon: '≡' },
  { key: 'tournaments', icon: '⬡' },
  { key: 'ratings', icon: '▲' },
] as const;

type Slide = (typeof SLIDES)[number];

const OnboardingScreen = ({
  onNavigateLogin,
  isDark: isDarkProp,
}: OnboardingScreenProps) => {
  const { t: tAuth } = useTranslation('auth');
  const { isDark: systemDark, tk } = useTheme();
  const isDark = isDarkProp ?? systemDark;
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const handleFinish = async () => {
    await setHasSeenOnboarding();
    onNavigateLogin();
  };

  const handleNext = () => {
    if (isLastSlide) {
      void handleFinish();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconContainer, { borderColor: tk.primary[600] }]}>
        <Text style={[styles.icon, { color: tk.primary[400] }]}>
          {item.icon}
        </Text>
      </View>
      <Text style={[styles.slideTitle, { color: tk.text.primary }]}>
        {tAuth(`onboarding.${item.key}.title`)}
      </Text>
      <View style={[styles.divider, { backgroundColor: tk.primary[500] }]} />
      <Text style={[styles.slideDescription, { color: tk.text.secondary }]}>
        {tAuth(`onboarding.${item.key}.description`)}
      </Text>
    </View>
  );

  return (
    <ScreenLayout isDark={isDark}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderSlide}
          keyExtractor={item => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig.current}
          scrollEventThrottle={16}
          style={styles.flatList}
        />
        <View style={styles.footer}>
          <View style={styles.dots}>
            {SLIDES.map((slide, index) => (
              <View
                key={slide.key}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentIndex
                        ? tk.primary[500]
                        : tk.text.disabled,
                    width: index === currentIndex ? 20 : 8,
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.controls}>
            {!isLastSlide && (
              <SecondaryButton
                label={tAuth('onboarding.skip')}
                onPress={() => void handleFinish()}
                isDark={isDark}
              />
            )}
            <PrimaryButton
              label={
                isLastSlide
                  ? tAuth('onboarding.getStarted')
                  : tAuth('onboarding.next')
              }
              onPress={handleNext}
              isDark={isDark}
              style={styles.nextButton}
            />
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
};

export default OnboardingScreen;
