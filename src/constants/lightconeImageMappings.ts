import { ImageSourcePropType } from "react-native";

// Static lightcone image mapping - based on actual files in /images/lightcones/
// Note: Filenames have apostrophes (') in them, not curly quotes
const LIGHTCONE_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  // A
  "Along the Passing Shore": require("../../images/lightcones/Light_Cone_Along_the_Passing_Shore.png"),
  "An Instant Before A Gaze": require("../../images/lightcones/Light_Cone_An_Instant_Before_A_Gaze.webp"),
  "A Dream Scented in Wheat": require("../../images/lightcones/Light_Cone_A_Dream_Scented_in_Wheat.webp"),
  "A Grounded Ascent": require("../../images/lightcones/Light_Cone_A_Grounded_Ascent.png"),
  "A Thankless Coronation": require("../../images/lightcones/Light_Cone_A_Thankless_Coronation.webp"),
  Adversarial: require("../../images/lightcones/Light_Cone_Adversarial.webp"),
  "After the Charmony Fall": require("../../images/lightcones/Light_Cone_After_the_Charmony_Fall.webp"),
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
  "Dazzled by a Flowery World": require("../../images/lightcones/Light_Cone_Dazzled_by_a_Flowery_World.webp"),
  "Dance at Sunset": require("../../images/lightcones/Light_Cone_Dance_at_Sunset.webp"),
  "Day One of My New Life": require("../../images/lightcones/Light_Cone_Day_One_of_My_New_Life.png"),
  "Destiny's Threads Forewoven": require("../../images/lightcones/Light_Cone_Destiny's_Threads_Forewoven.png"),
  "Dream's Montage": require("../../images/lightcones/Light_Cone_Dream's_Montage.png"),

  // E
  "Earthly Escapade": require("../../images/lightcones/Light_Cone_Earthly_Escapade.webp"),
  "Echoes of the Coffin": require("../../images/lightcones/Light_Cone_Echoes_of_the_Coffin.webp"),
  "Epoch Etched in Golden Blood": require("../../images/lightcones/Light_Cone_Epoch_Etched_in_Golden_Blood.webp"),
  "Eternal Calculus": require("../../images/lightcones/Light_Cone_Eternal_Calculus.webp"),
  "Eyes of the Prey": require("../../images/lightcones/Light_Cone_Eyes_of_the_Prey.webp"),

  // F
  "Flame of Blood, Blaze My Path": require("../../images/lightcones/Light_Cone_Flame_of_Blood_Blaze_My_Path.webp"),
  "Flames Afar": require("../../images/lightcones/Light_Cone_Flames_Afar.webp"),
  "Fly Into a Pink Tomorrow": require("../../images/lightcones/Light_Cone_Fly_Into_a_Pink_Tomorrow.webp"),
  "Final Victor": require("../../images/lightcones/Light_Cone_Final_Victor.webp"),
  "Flowing Nightglow": require("../../images/lightcones/Light_Cone_Flowing_Nightglow.webp"),
  "For Tomorrow's Journey": require("../../images/lightcones/Light_Cone_For_Tomorrow's_Journey.png"),

  // G
  "Geniuses' Greetings": require("../../images/lightcones/Light_Cone_Geniuses_Greetings.webp"),
  "Geniuses' Repose": require("../../images/lightcones/Light_Cone_Geniuses_Repose.webp"),
  "Good Night and Sleep Well": require("../../images/lightcones/Light_Cone_Good_Night_and_Sleep_Well.webp"),

  // H
  "Holiday Thermae Escapade": require("../../images/lightcones/Light_Cone_Holiday_Thermae_Escapade.png"),

  // I
  "Incessant Rain": require("../../images/lightcones/Light_Cone_Incessant_Rain.webp"),
  "I Venture Forth to Hunt": require("../../images/lightcones/Light_Cone_I_Venture_Forth_to_Hunt.webp"),
  "Inherently Unjust Destiny": require("../../images/lightcones/Light_Cone_Inherently_Unjust_Destiny.png"),
  "In Pursuit of the Wind": require("../../images/lightcones/Light_Cone_In_Pursuit_of_the_Wind.webp"),
  "If Time Were a Flower": require("../../images/lightcones/Light_Cone_If_Time_Were_a_Flower.webp"),
  "In the Name of the World": require("../../images/lightcones/Light_Cone_In_the_Name_of_the_World.png"),
  "Indelible Promise": require("../../images/lightcones/Light_Cone_Indelible_Promise.webp"),
  "In the Night": require("../../images/lightcones/Light_Cone_In_the_Night.webp"),
  "Into the Unreachable Veil": require("../../images/lightcones/Light_Cone_Into_the_Unreachable_Veil.webp"),
  "I Shall Be My Own Sword": require("../../images/lightcones/Light_Cone_I_Shall_Be_My_Own_Sword.png"),
  "It's Showtime": require("../../images/lightcones/Light_Cone_Its_Showtime.webp"),

  // J
  "Journey Forever Peaceful": require("../../images/lightcones/Light_Cone_Journey_Forever_Peaceful.png"),
  "Journey, Forever Peaceful": require("../../images/lightcones/Light_Cone_Journey_Forever_Peaceful.png"),

  // L
  "Landau's Choice": require("../../images/lightcones/Light_Cone_Landaus_Choice.webp"),
  "Lies Dance on the Breeze": require("../../images/lightcones/Light_Cone_Lies_Dance_on_the_Breeze.webp"),
  "Life Should Be Cast to Flames": require("../../images/lightcones/Light_Cone_Life_Should_Be_Cast_to_Flames.webp"),
  "Long Road Leads Home": require("../../images/lightcones/Light_Cone_Long_Road_Leads_Home.webp"),
  "Long May Rainbows Adorn the Sky": require("../../images/lightcones/Light_Cone_Long_May_Rainbows_Adorn_the_Sky.png"),

  // M
  "Make Farewells More Beautiful": require("../../images/lightcones/Light_Cone_Make_Farewells_More_Beautiful.png"),
  "Make the World Clamor": require("../../images/lightcones/Light_Cone_Make_the_World_Clamor.webp"),
  "Meshing Cogs": require("../../images/lightcones/Light_Cone_Meshing_Cogs.webp"),
  "Memories of the Past": require("../../images/lightcones/Light_Cone_Memories_of_the_Past.png"),
  "Memory's Curtain Never Falls": require("../../images/lightcones/Light_Cone_Memorys_Curtain_Never_Falls.webp"),
  "Moment of Victory": require("../../images/lightcones/Light_Cone_Moment_of_Victory.png"),
  Multiplication: require("../../images/lightcones/Light_Cone_Multiplication.webp"),

  // N
  "Night of Fright": require("../../images/lightcones/Light_Cone_Night_of_Fright.webp"),
  "Night on the Milky Way": require("../../images/lightcones/Light_Cone_Night_on_the_Milky_Way.webp"),
  "Ninja Record: Sound Hunt": require("../../images/lightcones/Light_Cone_Ninja_Record_Sound_Hunt.png"),
  "Never Forget Her Flame": require("../../images/lightcones/Light_Cone_Never_Forget_Her_Flame.webp"),
  "Ninjutsu Inscription: Dazzling Evilbreaker": require("../../images/lightcones/Light_Cone_Ninjutsu_Inscription_Dazzling_Evilbreaker.webp"),

  // O
  "On the Fall of an Aeon": require("../../images/lightcones/Light_Cone_On_the_Fall_of_an_Aeon.webp"),
  "Only Silence Remains": require("../../images/lightcones/Light_Cone_Only_Silence_Remains.webp"),

  // P
  "Past and Future": require("../../images/lightcones/Light_Cone_Past_and_Future.webp"),
  "Past Self in Mirror": require("../../images/lightcones/Light_Cone_Past_Self_in_Mirror.webp"),
  "Patience Is All You Need": require("../../images/lightcones/Light_Cone_Patience_Is_All_You_Need.webp"),
  "Perfect Timing": require("../../images/lightcones/Light_Cone_Perfect_Timing.webp"),
  "Planetary Rendezvous": require("../../images/lightcones/Light_Cone_Planetary_Rendezvous.webp"),
  "Poised to Bloom": require("../../images/lightcones/Light_Cone_Poised_to_Bloom.png"),
  "Post-Op Conversation": require("../../images/lightcones/Light_Cone_Post_Op_Conversation.png"),
  Passkey: require("../../images/lightcones/Light_Cone_Passkey.webp"),

  // Q
  "Quid Pro Quo": require("../../images/lightcones/Light_Cone_Quid_Pro_Quo.png"),

  // R
  "Reforged Remembrance": require("../../images/lightcones/Light_Cone_Reforged_Remembrance.webp"),
  Reminiscence: require("../../images/lightcones/Light_Cone_Reminiscence.webp"),
  "Resolution Shines As Pearls of Sweat": require("../../images/lightcones/Light_Cone_Resolution_Shines_As_Pearls_of_Sweat.webp"),
  "Return to Darkness": require("../../images/lightcones/Light_Cone_Return_to_Darkness.png"),
  "River Flows in Spring": require("../../images/lightcones/Light_Cone_River_Flows_in_Spring.webp"),

  // S
  "Sailing Towards a Second Life": require("../../images/lightcones/Light_Cone_Sailing_Towards_a_Second_Life.png"),
  "Sailing Towards A Second Life": require("../../images/lightcones/Light_Cone_Sailing_Towards_a_Second_Life.png"),
  "Scent Alone Stays True": require("../../images/lightcones/Light_Cone_Scent_Alone_Stays_True.webp"),
  "See You at the End": require("../../images/lightcones/Light_Cone_See_You_at_the_End.webp"),
  "Shared Feeling": require("../../images/lightcones/Light_Cone_Shared_Feeling.webp"),
  "Shadowed by Night": require("../../images/lightcones/Light_Cone_Shadowed_by_Night.png"),
  "Shadowed By Night": require("../../images/lightcones/Light_Cone_Shadowed_by_Night.png"),
  Shadowburn: require("../../images/lightcones/Light_Cone_Shadowburn.webp"),
  "Shattered Home": require("../../images/lightcones/Light_Cone_Shattered_Home.png"),
  "She Already Shut Her Eyes": require("../../images/lightcones/Light_Cone_She_Already_Shut_Her_Eyes.png"),
  "Sleep Like the Dead": require("../../images/lightcones/Light_Cone_Sleep_Like_the_Dead.png"),
  "Solitary Healing": require("../../images/lightcones/Light_Cone_Solitary_Healing.webp"),
  "Something Irreplaceable": require("../../images/lightcones/Light_Cone_Something_Irreplaceable.webp"),
  "Subscribe for More!": require("../../images/lightcones/Light_Cone_Subscribe_for_More.webp"),
  "Sweat Now, Cry Less": require("../../images/lightcones/Light_Cone_Sweat_Now_Cry_Less.webp"),
  Swordplay: require("../../images/lightcones/Light_Cone_Swordplay.webp"),

  // T
  "The Birth of the Self": require("../../images/lightcones/Light_Cone_The_Birth_of_the_Self.webp"),
  "Texture of Memories": require("../../images/lightcones/Light_Cone_Texture_of_Memories.png"),
  "The Day The Cosmos Fell": require("../../images/lightcones/Light_Cone_The_Day_The_Cosmos_Fell.png"),
  "The Finale of a Lie": require("../../images/lightcones/Light_Cone_The_Finale_of_a_Lie.webp"),
  "The Flower Remembers": require("../../images/lightcones/Light_Cone_The_Flower_Remembers.webp"),
  "The Forever Victual": require("../../images/lightcones/Light_Cone_The_Forever_Victual.webp"),
  "This Love, Forever": require("../../images/lightcones/Light_Cone_This_Love_C_Forever.webp"),
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
  "What Is Real?": require("../../images/lightcones/Light_Cone_What_Is_Real.webp"),
  "Warmth Shortens Cold Nights": require("../../images/lightcones/Light_Cone_Warmth_Shortens_Cold_Nights.webp"),
  "When She Decided to See": require("../../images/lightcones/Light_Cone_When_She_Decided_to_See.webp"),
  "Yet Hope Is Priceless": require("../../images/lightcones/Light_Cone_Yet_Hope_Is_Priceless.webp"),

  // U
  "Unto Tomorrow's Morrow": require("../../images/lightcones/Light_Cone_Unto_Tomorrows_Morrow.webp"),
  "Under the Blue Sky": require("../../images/lightcones/Light_Cone_Under_the_Blue_Sky.webp"),

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
