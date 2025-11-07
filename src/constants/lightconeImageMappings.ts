import { ImageSourcePropType } from "react-native";

// Static lightcone image mapping - based on actual files in /images/lightcones/
// Note: Filenames have apostrophes (') in them, not curly quotes
const LIGHTCONE_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  // A
  "Along the Passing Shore": require("../../images/lightcones/Light_Cone_Along_the_Passing_Shore.png"),
   "An Instant Before A Gaze": require("../../images/lightcones/Light_Cone_An_Instant_Before_A_Gaze.webp"),
  "A Grounded Ascent": require("../../images/lightcones/Light_Cone_A_Grounded_Ascent.png"),
   "A Secret Vow": require("../../images/lightcones/Light_Cone_A_Secret_Vow.webp"),
  "A Trail of Bygone Blood": require("../../images/lightcones/Light_Cone_A_Trail_of_Bygone_Blood.png"),

  // B
  "Baptism of Pure Thought": require("../../images/lightcones/Light_Cone_Baptism_of_Pure_Thought.webp"),
  "Before Dawn": require("../../images/lightcones/Light_Cone_Before_Dawn.webp"),
  "Before the Tutorial Mission Starts": require("../../images/lightcones/Light_Cone_Before_the_Tutorial_Mission_Starts.webp"),
  "Boundless Choreo": require("../../images/lightcones/Light_Cone_Boundless_Choreo.png"),
  "Brighter Than the Sun": require("../../images/lightcones/Light_Cone_Brighter_Than_the_Sun.png"),
  "But the Battle Isn't Over": require("../../images/lightcones/Light_Cone_But_the_Battle_Isnt_Over.webp"),

  // C
  "Collapsing Sky": require("../../images/lightcones/Light_Cone_Collapsing_Sky.png"),
  "Concert for Two": require("../../images/lightcones/Light_Cone_Concert_for_Two.png"),
  "Cruising in the Stellar Sea": require("../../images/lightcones/Light_Cone_Cruising_in_the_Stellar_Sea.png"),

  // D
 "Dance! Dance! Dance!": require("../../images/lightcones/Light_Cone_Dance_Dance_Dance.webp"),
  "Dance at Sunset": require("../../images/lightcones/Light_Cone_Dance_at_Sunset.webp"),
  "Day One of My New Life": require("../../images/lightcones/Light_Cone_Day_One_of_My_New_Life.png"),
  "Destiny's Threads Forewoven": require("../../images/lightcones/Light_Cone_Destiny's_Threads_Forewoven.png"),
  "Dream's Montage": require("../../images/lightcones/Light_Cone_Dream's_Montage.png"),

  // E
  "Earthly Escapade": require("../../images/lightcones/Light_Cone_Earthly_Escapade.webp"),
  "Eternal Calculus": require("../../images/lightcones/Light_Cone_Eternal_Calculus.webp"),
  "Eyes of the Prey": require("../../images/lightcones/Light_Cone_Eyes_of_the_Prey.webp"),

  // F
  "Flame of Blood, Blaze My Path": require("../../images/lightcones/Light_Cone_Flame_of_Blood_Blaze_My_Path.webp"),
  "Flames Afar": require("../../images/lightcones/Light_Cone_Flames_Afar.webp"),
  "For Tomorrow's Journey": require("../../images/lightcones/Light_Cone_For_Tomorrow's_Journey.png"),

  // G
  "Geniuses' Greetings": require("../../images/lightcones/Light_Cone_Geniuses_Greetings.webp"),
  "Geniuses' Repose": require("../../images/lightcones/Light_Cone_Geniuses_Repose.webp"),
  "Good Night and Sleep Well": require("../../images/lightcones/Light_Cone_Good_Night_and_Sleep_Well.webp"),

  // H
  "Holiday Thermae Escapade": require("../../images/lightcones/Light_Cone_Holiday_Thermae_Escapade.png"),

  // I
  "Incessant Rain": require("../../images/lightcones/Light_Cone_Incessant_Rain.webp"),
  "Inherently Unjust Destiny": require("../../images/lightcones/Light_Cone_Inherently_Unjust_Destiny.png"),
  "In the Name of the World": require("../../images/lightcones/Light_Cone_In_the_Name_of_the_World.png"),
  "In the Night": require("../../images/lightcones/Light_Cone_In_the_Night.webp"),
  "Into the Unreachable Veil": require("../../images/lightcones/Light_Cone_Into_the_Unreachable_Veil.webp"),
  "I Shall Be My Own Sword": require("../../images/lightcones/Light_Cone_I_Shall_Be_My_Own_Sword.png"),
  "It's Showtime": require("../../images/lightcones/Light_Cone_Its_Showtime.webp"),

  // J
  "Journey Forever Peaceful": require("../../images/lightcones/Light_Cone_Journey_Forever_Peaceful.png"),
  "Journey, Forever Peaceful": require("../../images/lightcones/Light_Cone_Journey_Forever_Peaceful.png"),

  // L
  "Landau's Choice": require("../../images/lightcones/Light_Cone_Landaus_Choice.webp"),
  "Life Should Be Cast to Flames": require("../../images/lightcones/Light_Cone_Life_Should_Be_Cast_to_Flames.webp"),
  "Long May Rainbows Adorn the Sky": require("../../images/lightcones/Light_Cone_Long_May_Rainbows_Adorn_the_Sky.png"),

  // M
  "Make Farewells More Beautiful": require("../../images/lightcones/Light_Cone_Make_Farewells_More_Beautiful.png"),
  "Make the World Clamor": require("../../images/lightcones/Light_Cone_Make_the_World_Clamor.webp"),
  "Memories of the Past": require("../../images/lightcones/Light_Cone_Memories_of_the_Past.png"),
  "Memory's Curtain Never Falls": require("../../images/lightcones/Light_Cone_Memorys_Curtain_Never_Falls.webp"),
  "Moment of Victory": require("../../images/lightcones/Light_Cone_Moment_of_Victory.png"),

  // N
  "Night of Fright": require("../../images/lightcones/Light_Cone_Night_of_Fright.webp"),
  "Night on the Milky Way": require("../../images/lightcones/Light_Cone_Night_on_the_Milky_Way.webp"),
  "Ninja Record: Sound Hunt": require("../../images/lightcones/Light_Cone_Ninja_Record_Sound_Hunt.png"),
  "Ninjutsu Inscription: Dazzling Evilbreaker": require("../../images/lightcones/Light_Cone_Ninjutsu_Inscription_Dazzling_Evilbreaker.webp"),

  // O
  "On the Fall of an Aeon": require("../../images/lightcones/Light_Cone_On_the_Fall_of_an_Aeon.webp"),
  "Only Silence Remains": require("../../images/lightcones/Light_Cone_Only_Silence_Remains.webp"),

  // P
  "Past and Future": require("../../images/lightcones/Light_Cone_Past_and_Future.webp"),
  "Patience Is All You Need": require("../../images/lightcones/Light_Cone_Patience_Is_All_You_Need.webp"),
  "Perfect Timing": require("../../images/lightcones/Light_Cone_Perfect_Timing.webp"),
  "Planetary Rendezvous": require("../../images/lightcones/Light_Cone_Planetary_Rendezvous.webp"),
  "Poised to Bloom": require("../../images/lightcones/Light_Cone_Poised_to_Bloom.png"),
  "Post-Op Conversation": require("../../images/lightcones/Light_Cone_Post_Op_Conversation.png"),

  // Q
  "Quid Pro Quo": require("../../images/lightcones/Light_Cone_Quid_Pro_Quo.png"),

  // R
  "Reforged Remembrance": require("../../images/lightcones/Light_Cone_Reforged_Remembrance.webp"),
  "Resolution Shines As Pearls of Sweat": require("../../images/lightcones/Light_Cone_Resolution_Shines_As_Pearls_of_Sweat.webp"),
  "Return to Darkness": require("../../images/lightcones/Light_Cone_Return_to_Darkness.png"),
  "River Flows in Spring": require("../../images/lightcones/Light_Cone_River_Flows_in_Spring.webp"),

  // S
  "Sailing Towards a Second Life": require("../../images/lightcones/Light_Cone_Sailing_Towards_a_Second_Life.png"),
  "Sailing Towards A Second Life": require("../../images/lightcones/Light_Cone_Sailing_Towards_a_Second_Life.png"),
  "See You at the End": require("../../images/lightcones/Light_Cone_See_You_at_the_End.webp"),
  "Shadowed by Night": require("../../images/lightcones/Light_Cone_Shadowed_by_Night.png"),
  "Shadowed By Night": require("../../images/lightcones/Light_Cone_Shadowed_by_Night.png"),
  "Shattered Home": require("../../images/lightcones/Light_Cone_Shattered_Home.png"),
  "She Already Shut Her Eyes": require("../../images/lightcones/Light_Cone_She_Already_Shut_Her_Eyes.png"),
  "Sleep Like the Dead": require("../../images/lightcones/Light_Cone_Sleep_Like_the_Dead.png"),
  "Solitary Healing": require("../../images/lightcones/Light_Cone_Solitary_Healing.webp"),
  "Something Irreplaceable": require("../../images/lightcones/Light_Cone_Something_Irreplaceable.webp"),
  "Subscribe for More!": require("../../images/lightcones/Light_Cone_Subscribe_for_More.webp"),
  "Sweat Now, Cry Less": require("../../images/lightcones/Light_Cone_Sweat_Now_Cry_Less.webp"),
  "Swordplay": require("../../images/lightcones/Light_Cone_Swordplay.webp"),

  // T
  "Texture of Memories": require("../../images/lightcones/Light_Cone_Texture_of_Memories.png"),
  "The Day The Cosmos Fell": require("../../images/lightcones/Light_Cone_The_Day_The_Cosmos_Fell.png"),
  "The Flower Remembers": require("../../images/lightcones/Light_Cone_The_Flower_Remembers.webp"),
  "The Great Cosmic Enterprise": require("../../images/lightcones/Light_Cone_The_Great_Cosmic_Enterprise.png"),
  "The Hell Where Ideals Burn": require("../../images/lightcones/Light_Cone_The_Hell_Where_Ideals_Burn.webp"),
  "The Seriousness of Breakfast": require("../../images/lightcones/Light_Cone_The_Seriousness_of_Breakfast.webp"),
  "The Story's Next Page": require("../../images/lightcones/Light_Cone_The_Storys_Next_Page.webp"),
  "The Unreachable Side": require("../../images/lightcones/Light_Cone_The_Unreachable_Side.webp"),
  "This Is Me!": require("../../images/lightcones/Light_Cone_This_Is_Me!.png"),
  "Those Many Springs": require("../../images/lightcones/Light_Cone_Those_Many_Springs.png"),
  "Though Worlds Apart": require("../../images/lightcones/Light_Cone_Though_Worlds_Apart.png"),
  "Thus Burns the Dawn": require("../../images/lightcones/Light_Cone_Thus_Burns_the_Dawn.png"),
  "Time Waits for No One": require("../../images/lightcones/Light_Cone_Time_Waits_for_No_One.png"),
  "Time Woven Into Gold": require("../../images/lightcones/Light_Cone_Time_Woven_Into_Gold.png"),
  "Today Is Another Peaceful Day": require("../../images/lightcones/Light_Cone_Today_Is_Another_Peaceful_Day.webp"),
  "To Evernight's Stars": require("../../images/lightcones/Light_Cone_To_Evernight's_Stars.png"),
  "Trend of the Universal Market": require("../../images/lightcones/Light_Cone_Trend_of_the_Universal_Market.png"),

  // U
  "Unto Tomorrow's Morrow": require("../../images/lightcones/Light_Cone_Unto_Tomorrows_Morrow.webp"),

  // V
  "Victory In a Blink": require("../../images/lightcones/Light_Cone_Victory_In_a_Blink.webp"),

  // W
  "We Are Wildfire": require("../../images/lightcones/Light_Cone_We_Are_Wildfire.png"),
  "Whereabouts Should Dreams Rest": require("../../images/lightcones/Light_Cone_Whereabouts_Should_Dreams_Rest.png"),
  "Why Does the Ocean Sing": require("../../images/lightcones/Light_Cone_Why_Does_the_Ocean_Sing.png"),
  "Worrisome, Blissful": require("../../images/lightcones/Light_Cone_Worrisome_Blissful.png"),
};

export function getLightconeImageWithFallback(name: string): ImageSourcePropType | null {
  return LIGHTCONE_IMAGE_MAP[name] || null;
}
