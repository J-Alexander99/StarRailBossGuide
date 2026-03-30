import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getCharacterImage,
  getCharacterDetailImage,
} from "../constants/characterImageMappings";
import { getBossImage } from "../constants/bossImageMappings";
import {
  formatTimeRemaining,
  getLiveEventTheme,
  getLiveEvents,
} from "../data/liveEvents";

const { width: screenWidth } = Dimensions.get("window");

// Complete character and boss data for carousels
const FEATURED_CHARACTERS = [
  "aglaea",
  "anaxa",
  "archer",
  "argenti",
  "arlan",
  "ashveil",
  "asta",
  "aventurine",
  "bailu",
  "blackswan",
  "blade",
  "boothill",
  "bronya",
  "castorice",
  "cerydra",
  "cipher",
  "clara",
  "danheng",
  "danheng_imaginary",
  "danheng_terrae",
  "dr_ratio",
  "elysia",
  "evernight",
  "feixiao",
  "firefly",
  "fugue",
  "fuxuan",
  "gallagher",
  "gepard",
  "guinaifen",
  "hanya",
  "herta",
  "himeko",
  "hook",
  "huohuo",
  "hyacine",
  "hysilens",
  "jade",
  "jiaoqiu",
  "jingliu",
  "jingyuan",
  "kafka",
  "kevin",
  "lingsha",
  "luka",
  "luocha",
  "lynx",
  "march7th",
  "march7_imag",
  "misha",
  "moze",
  "mydei",
  "natasha",
  "pela",
  "qingque",
  "raiden",
  "rappa",
  "robin",
  "ruanmei",
  "saber",
  "sampo",
  "seele",
  "serval",
  "silverwolf",
  "sparxie",
  "sparkle",
  "sunday",
  "sushang",
  "thedahlia",
  "the_herta",
  "tingyun",
  "topaz_numby",
  "trail_fire",
  "trail_ice",
  "trail_imag",
  "trail_physical",
  "tribbie",
  "welt",
  "xueyi",
  "yanqing",
  "yaoguang",
  "yukong",
  "yunli",
];

const FEATURED_BOSSES = [
  "Big_Enemy_Abundant_Ebon_Deer",
  "Big_Enemy_Argenti",
  "Big_Enemy_Aventurine",
  "Big_Enemy_Banacademic_Office_Staff",
  "Big_Enemy_Bronya",
  "Big_Enemy_Cirrus",
  "Big_Enemy_Cloud_Knight_Yanqing",
  "Big_Enemy_Cocolia",
  "Big_Enemy_First_Genius_Zandar",
  "Big_Enemy_Flame_Reaver",
  "Big_Enemy_Fulminating_Wolflord",
  "Big_Enemy_Gepard",
  "Big_Enemy_Hoolay",
  "Big_Enemy_Memory_Zone_Meme",
  "Big_Enemy_Pollux",
  "Big_Enemy_Savage_Incarnation_Of_Strife",
  "Big_Enemy_Stellaron_Hunter_Kafka",
  "Big_Enemy_Stellaron_Hunter_Sam",
  "Big_Enemy_Svarog",
  "Big_Enemy_Swarm_True_Sting",
  "Big_Enemy_The_Lance_of_Fury",
  "Big_Enemy_The_Past_Present_Show",
];

const MOBILE_PRIORITY_CHARACTERS = [
  "march7_imag",
  "ashveil",
  "sparxie",
  "thedahlia",
  "yaoguang",
];

const MOBILE_FEATURED_CHARACTERS = [
  ...MOBILE_PRIORITY_CHARACTERS,
  ...FEATURED_CHARACTERS.filter(
    (id) => !MOBILE_PRIORITY_CHARACTERS.includes(id),
  ),
];

interface CarouselProps {
  data: string[];
  isCharacter: boolean;
  onPress: () => void;
  direction: "left" | "right";
  useDetailImages?: boolean;
  itemWidth?: number;
  itemHeight?: number;
  maxItems?: number;
}

function SmoothCarousel({
  data,
  isCharacter,
  onPress,
  direction,
  useDetailImages = false,
  itemWidth = 100,
  itemHeight = 120,
  maxItems,
}: CarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);
  const lastFrameTime = useRef(0);
  const isWeb = Platform.OS === "web";
  const speed = isWeb ? 0.5 : 0.35;
  const targetFrameInterval = isWeb ? 1000 / 60 : 1000 / 30;

  // On native, cap rendered items to reduce memory/CPU load.
  const limitedData = data.slice(
    0,
    Math.min(maxItems ?? data.length, data.length),
  );
  const copyCount = isWeb ? 5 : 3;

  // Repeat enough copies for seamless looping while avoiding excessive native rendering.
  const extendedData = Array.from(
    { length: copyCount },
    () => limitedData,
  ).flat();
  const singleSetWidth = limitedData.length * itemWidth;

  useEffect(() => {
    let animationFrame: number;

    if (limitedData.length === 0 || singleSetWidth === 0) {
      return;
    }

    const smoothScroll = (timestamp = 0) => {
      if (scrollViewRef.current) {
        // Throttle frame work on native to keep the UI thread responsive.
        if (timestamp - lastFrameTime.current >= targetFrameInterval) {
          if (direction === "right") {
            scrollPosition.current += speed;
          } else {
            scrollPosition.current -= speed;
          }

          // Keep position around the middle copies to avoid visible jump.
          if (scrollPosition.current >= singleSetWidth * (copyCount - 1)) {
            scrollPosition.current = scrollPosition.current - singleSetWidth;
          } else if (scrollPosition.current <= singleSetWidth) {
            scrollPosition.current = scrollPosition.current + singleSetWidth;
          }

          scrollViewRef.current.scrollTo({
            x: scrollPosition.current,
            animated: false,
          });

          lastFrameTime.current = timestamp;
        }
      }

      animationFrame = requestAnimationFrame(smoothScroll);
    };

    // Initialize position in a middle copy so wrap corrections are off-screen.
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollPosition.current = singleSetWidth * Math.floor(copyCount / 2);
        scrollViewRef.current.scrollTo({
          x: scrollPosition.current,
          animated: false,
        });
        lastFrameTime.current = 0;
        animationFrame = requestAnimationFrame(smoothScroll);
      }
    }, 50);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [
    limitedData.length,
    direction,
    itemWidth,
    singleSetWidth,
    speed,
    targetFrameInterval,
    copyCount,
  ]);

  const getImage = (item: string) => {
    if (isCharacter) {
      return useDetailImages
        ? getCharacterDetailImage(item)
        : getCharacterImage(item);
    }
    return getBossImage(item);
  };

  const carouselItemStyle = {
    width: itemWidth,
    height: itemHeight,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden" as const,
    position: "relative" as const,
    backgroundColor: "#191222",
    borderWidth: 1,
    borderColor: "rgba(255, 108, 224, 0.1)",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.carouselWrapper, { height: itemHeight + 20 }]}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        removeClippedSubviews={!isWeb}
        style={[styles.carousel, { height: itemHeight }]}
        contentContainerStyle={styles.carouselContent}
      >
        {extendedData.map((item, index) => {
          const imageSource = getImage(item);
          if (!imageSource) return null;

          return (
            <View key={`${item}-${index}`} style={carouselItemStyle}>
              <Image source={imageSource} style={styles.carouselImage} />
              <View style={styles.carouselOverlay} />
            </View>
          );
        })}
      </ScrollView>
    </TouchableOpacity>
  );
}

export function HomeScreen() {
  const navigation = useNavigation();
  const isWeb = Platform.OS === "web";
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30_000);

    return () => clearInterval(timer);
  }, []);

  const previewEvents = useMemo(() => getLiveEvents(now).slice(0, 2), [now]);

  return (
    <View style={styles.container}>
      {/* Character Carousel - Top */}
      <View style={styles.topCarouselContainer}>
        <SmoothCarousel
          data={isWeb ? FEATURED_CHARACTERS : MOBILE_FEATURED_CHARACTERS}
          isCharacter={true}
          direction="right"
          maxItems={isWeb ? FEATURED_CHARACTERS.length : 18}
          onPress={() => navigation.navigate("Characters" as never)}
        />
        <View style={styles.carouselLabel}>
          <Text style={styles.carouselLabelText}>
            Tap to explore characters
          </Text>
        </View>
      </View>

      {/* Center Title Section */}
      <View style={styles.centerSection}>
        {/* Background Carousel - Behind Title */}
        {isWeb ? (
          <View style={styles.backgroundCarouselContainer}>
            <SmoothCarousel
              data={FEATURED_CHARACTERS}
              isCharacter={true}
              direction="right"
              onPress={() => {}}
              useDetailImages={true}
              itemWidth={200}
              itemHeight={240}
            />
          </View>
        ) : null}

        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Star Rail</Text>
          <Text style={styles.subtitle}>Boss Guide</Text>
          <View style={styles.titleAccent} />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.liveEventsCard}
          onPress={() => navigation.navigate("LiveEvents" as never)}
        >
          <View style={styles.liveEventsHeader}>
            <Text style={styles.liveEventsTitle}>Live Events</Text>
            <Text style={styles.liveEventsCta}>View All</Text>
          </View>

          {previewEvents.map((event) => {
            const theme = getLiveEventTheme(event.id);

            return (
              <View
                key={event.id}
                style={[
                  styles.liveEventsRow,
                  {
                    borderColor: theme.borderColor,
                    backgroundColor: theme.labelBackground,
                  },
                ]}
              >
                <View
                  style={[
                    styles.liveEventsDot,
                    { backgroundColor: theme.accentColor },
                  ]}
                />
                <Text
                  style={[styles.liveEventsName, { color: theme.nameText }]}
                  numberOfLines={1}
                >
                  {event.name}
                </Text>
                <Text
                  style={[
                    styles.liveEventsCountdown,
                    { color: theme.countdownText },
                  ]}
                >
                  {formatTimeRemaining(event.nextReset, now)}
                </Text>
              </View>
            );
          })}
        </TouchableOpacity>
      </View>

      {/* Boss Carousel - Bottom */}
      <View style={styles.bottomCarouselContainer}>
        <View style={styles.carouselLabel}>
          <Text style={styles.carouselLabelText}>Tap to explore bosses</Text>
        </View>
        <SmoothCarousel
          data={FEATURED_BOSSES}
          isCharacter={false}
          direction="left"
          maxItems={isWeb ? FEATURED_BOSSES.length : 12}
          onPress={() => navigation.navigate("Bosses" as never)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#130914",
  },

  // Top Carousel
  topCarouselContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 16,
  },

  // Center Section
  centerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    position: "relative",
  },

  backgroundCarouselContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    opacity: 0.15,
    zIndex: 0,
  },

  titleContainer: {
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
    zIndex: 1,
  },

  mainTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#f4ecff",
    letterSpacing: 2,
    textAlign: "center",
    textShadowColor: "rgba(255, 108, 224, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ff6ce0",
    letterSpacing: 1,
    textAlign: "center",
    marginTop: -4,
  },

  titleAccent: {
    position: "absolute",
    bottom: -16,
    width: 80,
    height: 3,
    backgroundColor: "#ff6ce0",
    borderRadius: 2,
    shadowColor: "#ff6ce0",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },

  liveEventsCard: {
    flexDirection: "column",
    backgroundColor: "rgba(25, 18, 34, 0.6)",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 108, 224, 0.1)",
    zIndex: 1,
    width: "100%",
  },

  liveEventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  liveEventsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f4ecff",
  },

  liveEventsCta: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ff6ce0",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  liveEventsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
  },

  liveEventsDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },

  liveEventsName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#c7b9d6",
    flex: 1,
  },

  liveEventsCountdown: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: "auto",
  },

  // Bottom Carousel
  bottomCarouselContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 16,
  },

  // Carousel Components
  carouselWrapper: {
    height: 140, // Fixed height: 120px items + 20px padding
  },

  carousel: {
    height: 120, // Fixed height matching carousel items
  },

  carouselContent: {
    paddingHorizontal: 16,
  },

  carouselItem: {
    width: 100, // Fixed width - consistent across all screen sizes
    height: 120, // Fixed height with good aspect ratio for character portraits
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#191222",
    borderWidth: 1,
    borderColor: "rgba(255, 108, 224, 0.1)",
  },

  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  carouselOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 108, 224, 0.1)",
    borderRadius: 12,
  },

  carouselLabel: {
    alignItems: "center",
    marginBottom: 8,
  },

  carouselLabelText: {
    fontSize: 12,
    color: "#9f8ab8",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});
