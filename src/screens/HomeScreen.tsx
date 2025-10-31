import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getCharacterImage,
  getCharacterDetailImage,
} from "../constants/characterImageMappings";
import { getBossImage } from "../constants/bossImageMappings";

const { width: screenWidth } = Dimensions.get("window");

// Complete character and boss data for carousels
const FEATURED_CHARACTERS = [
  "aglaea",
  "anaxa",
  "archer",
  "argenti",
  "arlan",
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
  "sparkle",
  "sunday",
  "sushang",
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

interface CarouselProps {
  data: string[];
  isCharacter: boolean;
  onPress: () => void;
  direction: "left" | "right";
  useDetailImages?: boolean;
  itemWidth?: number;
  itemHeight?: number;
}

function SmoothCarousel({
  data,
  isCharacter,
  onPress,
  direction,
  useDetailImages = false,
  itemWidth = 100,
  itemHeight = 120,
}: CarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);
  const speed = 0.5; // Pixels per frame

  // Create 5 copies for truly seamless infinite scroll
  const extendedData = [...data, ...data, ...data, ...data, ...data];
  const singleSetWidth = data.length * itemWidth;
  const totalWidth = extendedData.length * itemWidth;

  useEffect(() => {
    let animationFrame: number;

    const smoothScroll = () => {
      if (scrollViewRef.current) {
        if (direction === "right") {
          scrollPosition.current += speed;
        } else {
          scrollPosition.current -= speed;
        }

        // Seamless looping logic - reset position when we're in the buffer zones
        // but not visible to the user
        if (scrollPosition.current >= singleSetWidth * 3) {
          // Reset to equivalent position in the middle set
          scrollPosition.current = scrollPosition.current - singleSetWidth;
        } else if (scrollPosition.current <= singleSetWidth) {
          // Reset to equivalent position in the middle set
          scrollPosition.current = scrollPosition.current + singleSetWidth;
        }

        scrollViewRef.current.scrollTo({
          x: scrollPosition.current,
          animated: false,
        });
      }

      animationFrame = requestAnimationFrame(smoothScroll);
    };

    // Initialize position to middle set (2nd copy)
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollPosition.current = singleSetWidth * 2; // Start at 2nd set
        scrollViewRef.current.scrollTo({
          x: scrollPosition.current,
          animated: false,
        });
        animationFrame = requestAnimationFrame(smoothScroll);
      }
    }, 50);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [data.length, direction, itemWidth, singleSetWidth, speed]);

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
        scrollEnabled={false} // Disable manual scrolling for smooth auto-scroll
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

  return (
    <View style={styles.container}>
      {/* Character Carousel - Top */}
      <View style={styles.topCarouselContainer}>
        <SmoothCarousel
          data={FEATURED_CHARACTERS}
          isCharacter={true}
          direction="right"
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

        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Star Rail</Text>
          <Text style={styles.subtitle}>Boss Guide</Text>
          <View style={styles.titleAccent} />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>70+</Text>
            <Text style={styles.statLabel}>Characters</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12+</Text>
            <Text style={styles.statLabel}>Bosses</Text>
          </View>
        </View>
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

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(25, 18, 34, 0.6)",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 108, 224, 0.1)",
    zIndex: 1,
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ff6ce0",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#b8a6d9",
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 108, 224, 0.2)",
    marginHorizontal: 24,
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
