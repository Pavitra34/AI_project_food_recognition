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
  
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppHeader from "../../components/common/AppHeader";
import { sendMessage } from "../../services/chatbotService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";




type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

const suggestions = [
  "🥗 Healthy Foods",
  "🔥 Calories",
  "💧 Water Intake",
  "📊 BMI",
  "🥩 Protein",
  "⚖️ Weight Loss",
];

export default function ChatScreen() {
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  
const insets = useSafeAreaInsets();

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

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={[
          styles.chatContainer,
          {
            flexGrow: 1,
              paddingBottom: 90,
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
              <View style={styles.welcomeCard}>
                <Text style={styles.welcomeTitle}>
                  🤖 NutriScan AI
                </Text>

                <Text style={styles.welcomeSubtitle}>
                  Your personal nutrition assistant
                </Text>

                <Text style={styles.askText}>
                  Ask me about
                </Text>

                <View
                  style={styles.chipsContainer}
                >
                  {suggestions.map((chip) => (
                    <TouchableOpacity
                      key={chip}
                      style={styles.chip}
                      onPress={() =>
                        handleSuggestion(chip)
                      }
                    >
                      <Text
                        style={styles.chipText}
                      >
                        {chip}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }

          // -------- User --------
          if (item.sender === "user") {
            return (
              <View style={styles.userRow}>
                <View
                  style={styles.userBubble}
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
                    size={18}
                    color="#FFF"
                  />
                </View>
              </View>
            );
          }

          // -------- Bot --------
          return (
            <View style={styles.botRow}>
              <View
                style={styles.botAvatar}
              >
                <Ionicons
                  name="sparkles"
                  size={18}
                  color="#FFF"
                />
              </View>

              <View
                style={styles.botBubble}
              >
                <Text
                  style={styles.botText}
                >
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {loading && (
        <View style={styles.typingRow}>
          <View style={styles.botAvatar}>
            <Ionicons
              name="sparkles"
              size={18}
              color="#FFF"
            />
          </View>

          <View style={styles.typingBubble}>
            <ActivityIndicator
              size="small"
              color="#0F8A83"
            />
          </View>
        </View>
      )}

      <View
        style={[
          styles.bottomContainer,
          {
            paddingBottom: keyboardVisible
              ? 8
              : insets.bottom + 8,
          },
        ]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask anything about nutrition..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            multiline
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
          >
            <Ionicons
              name="send"
              size={22}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
chatContainer: {
  paddingTop: 10,
  paddingBottom: 20,
},

welcomeCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 22,
  padding: 22,
  marginHorizontal: 16,
  marginTop: 10,
  marginBottom: 12,

  alignSelf: "center",
  width: "92%",

  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: {
    width: 0,
    height: 4,
  },
  elevation: 4,
},

  welcomeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
container: {
  flex: 1,
  backgroundColor: "#FFFFFF",
},

bottomContainer: {
  backgroundColor: "#FFFFFF",
  borderTopWidth: 1,
  borderColor: "#ECECEC",
},

  welcomeSubtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#6B7280",
  },

  askText: {
    marginTop: 16,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

chipsContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 10,
},
chip: {
  backgroundColor: "#E6F7F5",
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 30,
  marginRight: 10,
  marginBottom: 10,
},

  chipText: {
    color: "#0F8A83",
    fontWeight: "600",
    fontSize: 13,
  },

  userRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 15,
  },

  botRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 15,
  },

  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0F8A83",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0F8A83",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  userBubble: {
    backgroundColor: "#0F8A83",
    borderRadius: 20,
    borderBottomRightRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "75%",
  },

  botBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "75%",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  userText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
  },

  botText: {
    color: "#111827",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

inputContainer: {
  position: "absolute",

  left: 0,
  right: 0,
  bottom: 0,

  flexDirection: "row",
  alignItems: "center",

  paddingHorizontal: 16,
  paddingTop: 12,
  paddingBottom: Platform.OS === "android" ? 34 : 28,

  backgroundColor: "#FFFFFF",

  borderTopWidth: 1,
  borderTopColor: "#E5E7EB",
},

  input: {
    flex: 1,
    minHeight: 52,
    maxHeight: 120,
    backgroundColor: "#F3F4F6",
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },

  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#0F8A83",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,

    shadowColor: "#0F8A83",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
  },
});
