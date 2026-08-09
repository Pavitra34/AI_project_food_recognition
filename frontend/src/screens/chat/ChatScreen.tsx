import React, {
  useRef,
  useState,
  useEffect,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Pressable,
  useWindowDimensions,
  
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import type { DimensionValue } from "react-native";

import AppHeader from "../../components/common/AppHeader";
import { sendMessage } from "../../services/chatbotService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../constants/colors";

// ---------------------------------------------------------------------------
// TODO: adjust this import path to wherever Colors.ts actually lives in your
// project (e.g. "../../constants/Colors" / "../../theme/Colors").
// ---------------------------------------------------------------------------

// Transparent tints derived from Colors.primary (#0D9688 -> rgb(13,150,136))
// for chip/avatar-ring backgrounds. No new hues introduced, same brand color.
const PRIMARY_TINT = "rgba(13, 150, 136, 0.10)";
const PRIMARY_TINT_BORDER = "rgba(13, 150, 136, 0.20)";



type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

// Suggestion chips carry an icon name alongside the label. The label text
// itself has no emoji, so handleSuggestion's existing sanitiser is untouched
// and behaves exactly as before (it simply has nothing left to strip).
const suggestions: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: "Healthy Foods", icon: "leaf-outline" },
  { label: "Calories", icon: "flame-outline" },
  { label: "Water Intake", icon: "water-outline" },
  { label: "BMI", icon: "body-outline" },
  { label: "Protein", icon: "egg-outline" },
  { label: "Weight Loss", icon: "trending-down-outline" },
];

// ---------------------------------------------------------------------------
// Small presentational helpers (no app logic here — just motion/feedback)
// ---------------------------------------------------------------------------

// Fades + slides a message in when it first mounts.
function AnimatedMessageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

// A Pressable that gently scales down on press for tactile feedback.
function ScalePressable({
  onPress,
  style,
  children,
}: {
  onPress: () => void;
  style?: any;
  children: React.ReactNode;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function ChatScreen() {
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  
const insets = useSafeAreaInsets();
const { width } = useWindowDimensions();

// Responsive breakpoints — keeps the chat comfortable on small phones,
// standard phones, and tablets without changing any behaviour.
const isTablet = width >= 700;
const chatMaxWidth: DimensionValue = isTablet ? 640 : "100%";
const bubbleMaxWidth = Math.min(width * 0.78, isTablet ? 440 : 340);
const welcomeCardWidth = Math.min(width * 0.92, 480);

// Gentle continuous pulse on the bot "presence" indicator — purely
// decorative, does not touch any app state.
const pulse = useRef(new Animated.Value(1)).current;
useEffect(() => {
  const loop = Animated.loop(
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1.25,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ])
  );
  loop.start();
  return () => loop.stop();
}, []);

const [keyboardVisible, setKeyboardVisible] =
  useState(false);

useEffect(() => {
  const show = Keyboard.addListener(
    "keyboardDidShow",
    () => setKeyboardVisible(true)
  );

  const hide = Keyboard.addListener(
    "keyboardDidHide",
    () => setKeyboardVisible(false)
  );

  return () => {
    show.remove();
    hide.remove();
  };
}, []);

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text:
          "Hello 👋\n\nI'm NutriScan AI.\n\nI can help you with nutrition, calories, BMI, water intake, healthy foods and weight management.\n\nAsk me anything!",
      },
    ]);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    }, 150);
  }, [messages]);

  const handleSuggestion = (text: string) => {
    setInput(text.replace(/[^\w\s]/gi, ""));
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);

    try {
      setLoading(true);

      console.log("========== USER QUESTION ==========");
      console.log(question);

      const response = await sendMessage(question);

      console.log("========== BOT RESPONSE ==========");
      console.log(response);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 150);
    } catch (error: any) {
      console.log("========== CHAT ERROR ==========");
      console.log(error?.response?.data);
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text:
            error?.response?.data?.reply ??
            "Sorry, something went wrong.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

return (
  <SafeAreaView
    style={styles.container}
    edges={["top"]}
  >
<KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={0}
>
      <AppHeader
        title="NutriScan AI"
        showBack
      />

      {/* Centers content on tablets/large screens, full width on phones */}
      <View
        style={[
          styles.contentWrap,
          { maxWidth: chatMaxWidth, alignSelf: "center", width: "100%" },
        ]}
      >
      <FlatList
        ref={flatListRef}
        style={{ flex: 1 }}
        data={messages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={[
          styles.chatContainer,
          {
            flexGrow: 1,
            paddingBottom: 20,
            justifyContent:
              messages.length === 1
                ? "flex-start"
                : "flex-end",
          },
        ]}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({
            animated: true,
            
          })
        }
        renderItem={({ item }) => {
          // -------- Welcome --------
          if (item.id === "welcome") {
            return (
              <AnimatedMessageWrapper>
              <View style={[styles.welcomeCard, { width: welcomeCardWidth }]}>
                <View style={styles.avatarRing}>
                  <View style={styles.avatarCore}>
                    <Ionicons
                      name="sparkles"
                      size={24}
                      color={Colors.white}
                    />
                  </View>
                </View>

                <Text style={styles.welcomeTitle}>
                  NutriScan AI
                </Text>

                <Text style={styles.welcomeSubtitle}>
                  Your personal nutrition assistant
                </Text>

                <Text style={styles.askText}>
                  ASK ME ABOUT
                </Text>

                <View
                  style={styles.chipsContainer}
                >
                  {suggestions.map((chip) => (
                    <ScalePressable
                      key={chip.label}
                      style={styles.chip}
                      onPress={() =>
                        handleSuggestion(chip.label)
                      }
                    >
                      <Ionicons
                        name={chip.icon}
                        size={15}
                        color={Colors.primary}
                        style={styles.chipIcon}
                      />
                      <Text
                        style={styles.chipText}
                      >
                        {chip.label}
                      </Text>
                    </ScalePressable>
                  ))}
                </View>
              </View>
              </AnimatedMessageWrapper>
            );
          }

          // -------- User --------
          if (item.sender === "user") {
            return (
              <AnimatedMessageWrapper>
              <View style={styles.userRow}>
                <View
                  style={[styles.userBubble, { maxWidth: bubbleMaxWidth }]}
                >
                  <Text
                    style={styles.userText}
                  >
                    {item.text}
                  </Text>
                </View>

                <View
                  style={styles.userAvatar}
                >
                  <Ionicons
                    name="person"
                    size={17}
                    color={Colors.white}
                  />
                </View>
              </View>
              </AnimatedMessageWrapper>
            );
          }

          // -------- Bot --------
          return (
            <AnimatedMessageWrapper>
            <View style={styles.botRow}>
              <View
                style={styles.botAvatar}
              >
                <Ionicons
                  name="sparkles"
                  size={17}
                  color={Colors.white}
                />
                <Animated.View
                  style={[
                    styles.presenceDot,
                    { transform: [{ scale: pulse }] },
                  ]}
                />
              </View>

              <View
                style={[styles.botBubble, { maxWidth: bubbleMaxWidth }]}
              >
                <Text
                  style={styles.botText}
                >
                  {item.text}
                </Text>
              </View>
            </View>
            </AnimatedMessageWrapper>
          );
        }}
      />

      {loading && (
        <View style={styles.typingRow}>
          <View style={styles.botAvatar}>
            <Ionicons
              name="sparkles"
              size={17}
              color={Colors.white}
            />
            <Animated.View
              style={[
                styles.presenceDot,
                { transform: [{ scale: pulse }] },
              ]}
            />
          </View>

          <View style={styles.typingBubble}>
            <ActivityIndicator
              size="small"
              color={Colors.primary}
            />
            <Text style={styles.typingText}>
              NutriScan is typing
            </Text>
          </View>
        </View>
      )}

      <View
        style={[
          styles.bottomContainer,
          {
            // Constant value regardless of keyboard state — toggling this
            // based on keyboardVisible caused a visible "jump" (extra blank
            // space appearing) right after the keyboard closed.
            paddingBottom: insets.bottom + 6,
          },
        ]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask anything about nutrition..."
            placeholderTextColor={Colors.gray}
            value={input}
            onChangeText={setInput}
            multiline
          />

          <ScalePressable
            style={[
              styles.sendButton,
              !input.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
          >
            <Ionicons
              name="send"
              size={20}
              color={Colors.white}
            />
          </ScalePressable>
        </View>
      </View>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
contentWrap: {
  flex: 1,
},

chatContainer: {
  paddingTop: 10,
  paddingHorizontal: 4,
},

welcomeCard: {
  backgroundColor: Colors.white,
  borderRadius: 24,
  padding: 24,
  marginTop: 12,
  marginBottom: 18,

  alignItems: "center",
  alignSelf: "center",

  borderWidth: 1,
  borderColor: Colors.border,

  shadowColor: Colors.black,
  shadowOpacity: 0.06,
  shadowRadius: 16,
  shadowOffset: {
    width: 0,
    height: 6,
  },
  elevation: 3,
},

avatarRing: {
  width: 68,
  height: 68,
  borderRadius: 34,
  backgroundColor: PRIMARY_TINT,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 14,
},

avatarCore: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: Colors.primary,
  justifyContent: "center",
  alignItems: "center",
},

  welcomeTitle: {
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: Colors.black,
    textAlign: "center",
  },
container: {
  flex: 1,
  backgroundColor: Colors.background,
},

bottomContainer: {
  backgroundColor: Colors.white,
  borderTopWidth: 1,
  borderColor: Colors.border,

},

  welcomeSubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
  },

  askText: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: Colors.gray,
    alignSelf: "flex-start",
  },

chipsContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
},
chip: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: PRIMARY_TINT,
  borderWidth: 1,
  borderColor: PRIMARY_TINT_BORDER,
  paddingHorizontal: 14,
  paddingVertical: 9,
  borderRadius: 30,
  marginRight: 8,
  marginBottom: 8,
},

chipIcon: {
  marginRight: 6,
},

  chipText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },

  userRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 16,
    paddingHorizontal: 12,
  },

  botRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
    paddingHorizontal: 12,
  },

  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  botAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  presenceDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  userBubble: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  botBubble: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,

    borderWidth: 1,
    borderColor: Colors.border,

    shadowColor: Colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 1,
  },

  userText: {
    color: Colors.white,
    fontSize: 15,
    lineHeight: 22,
  },

  botText: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
  },

  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 30,
  },

  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 11,

    borderWidth: 1,
    borderColor: Colors.border,

    shadowColor: Colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 1,
  },

  typingText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "500",
    color: Colors.gray,
  },

inputContainer: {
  flexDirection: "row",
  alignItems: "center",

  paddingHorizontal: 16,
  paddingTop: 12,

  backgroundColor: Colors.white,
},

  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 120,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },

  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,

    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
  },

  sendButtonDisabled: {
    opacity: 0.45,
  },
});
