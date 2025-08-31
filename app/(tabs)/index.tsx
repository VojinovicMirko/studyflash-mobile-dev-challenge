import { ChatInput } from "@/components/ChatInput";
import { MessageActions } from "@/components/MessageActions";
import { MessageSuggestions } from "@/components/MessageSuggestions";
import { MESSAGE_ACTION_STATUS } from "@/constants";
import { Colors } from "@/constants/Colors";
import { useAppContext } from "@/context/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { generateAPIUrl } from "@/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import * as Haptics from "expo-haptics";
import { fetch as expoFetch } from "expo/fetch";
import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-native-markdown-display";

import { LoadingDots } from "@/components/LoadingDots";
import { WeatherData, WeatherWidget } from "@/components/WeatherWidget";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function App() {
  const { isRegenerating, setIsRegenerating } = useAppContext();

  const colorScheme = useColorScheme();

  const scrollRef = useRef(null);

  const { messages, error, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("/api/chat"),
    }),
    onError: (error) => console.error(error, "ERROR"),
  });

  const [input, setInput] = useState("");
  const [likedMessageIndexes, setLikedMessagesIndexes] = useState<string[]>([]);
  const [dislikedMessageIndexes, setDislikedMessagesIndexes] = useState<
    string[]
  >([]);

  const likeCallback = (messageId: string) => {
    setLikedMessagesIndexes([...likedMessageIndexes, messageId]);
  };

  const dislikeCallback = (messageId: string) => {
    setDislikedMessagesIndexes([...dislikedMessageIndexes, messageId]);
  };

  const parseWeatherUnknown = (
    input: unknown
  ): WeatherData | null | undefined => {
    if (typeof input === "string") {
      try {
        input = JSON.parse(input);
      } catch {
        console.error("Invalid JSON string");
        return null;
      }
    }

    if (
      typeof input === "object" &&
      input !== null &&
      "location" in input &&
      "temperature" in input &&
      "humidity" in input &&
      "windSpeed" in input &&
      "condition" in input
    ) {
      const obj = input as Record<string, unknown>;

      if (
        typeof obj.location === "string" &&
        typeof obj.temperature === "number" &&
        typeof obj.humidity === "number" &&
        typeof obj.windSpeed === "number" &&
        typeof obj.condition === "string"
      ) {
        return {
          location: obj.location,
          temperature: obj.temperature,
          humidity: obj.humidity,
          windSpeed: obj.windSpeed,
          condition: obj.condition,
        };
      }
    }
  };

  useEffect(() => {
    if (isRegenerating) {
      setMessages([]);
      setIsRegenerating(false);
    }
  }, [isRegenerating]);

  useEffect(() => {
    if (scrollRef.current) {
      (scrollRef.current as ScrollView).scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    if (status === "ready") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [status]);

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: Colors[useColorScheme() ?? "light"].background },
      ]}
    >
      {error ? (
        <Text style={styles.errorText}>{error.message}</Text>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}
        >
          <View style={styles.container}>
            {messages.length > 0 && (
              <ScrollView ref={scrollRef} style={styles.scrollView}>
                {messages.map((m) => (
                  <View
                    key={m.id}
                    style={[
                      styles.messageContainer,
                      m.role === "user"
                        ? styles.userMessage
                        : styles.assistantMessage,
                      {
                        backgroundColor:
                          m.role === "user"
                            ? Colors[colorScheme ?? "light"].gray
                            : "white",
                      },
                    ]}
                  >
                    <View style={styles.messageContent}>
                      {m.parts.map((part, i) => {
                        switch (part.type) {
                          case "text":
                            return (
                              <View
                                key={`${m.id}-${i}`}
                                style={styles.messagePartContainer}
                              >
                                <Markdown>{part.text}</Markdown>
                                {m.role === "assistant" && (
                                  <MessageActions
                                    id={m.id}
                                    text={part.text}
                                    status={
                                      likedMessageIndexes.includes(m.id)
                                        ? MESSAGE_ACTION_STATUS.LIKED
                                        : dislikedMessageIndexes.includes(m.id)
                                        ? MESSAGE_ACTION_STATUS.DISLIKED
                                        : MESSAGE_ACTION_STATUS.NEUTRAL
                                    }
                                    likeCallback={likeCallback}
                                    dislikeCallback={dislikeCallback}
                                  />
                                )}
                              </View>
                            );
                          case "tool-weather":
                            return (
                              <View
                                key={`${m.id}-${i}`}
                                style={styles.messagePartContainer}
                              >
                                <WeatherWidget
                                  data={parseWeatherUnknown(part.output)}
                                />

                                {m.role === "assistant" && (
                                  <MessageActions
                                    id={m.id}
                                    text={JSON.stringify(part, null, 2)}
                                    status={
                                      likedMessageIndexes.includes(m.id)
                                        ? MESSAGE_ACTION_STATUS.LIKED
                                        : dislikedMessageIndexes.includes(m.id)
                                        ? MESSAGE_ACTION_STATUS.DISLIKED
                                        : MESSAGE_ACTION_STATUS.NEUTRAL
                                    }
                                    likeCallback={likeCallback}
                                    dislikeCallback={dislikeCallback}
                                  />
                                )}
                              </View>
                            );
                        }
                      })}
                    </View>
                  </View>
                ))}
                {status === "submitted" && <LoadingDots />}
              </ScrollView>
            )}

            {messages.length === 0 && (
              <MessageSuggestions
                onSelect={(text) => {
                  sendMessage({ text });
                  setInput("");
                }}
              />
            )}

            <ChatInput
              value={input}
              onChangeText={(text) => setInput(text)}
              onSend={() => {
                sendMessage({ text: input });
                setInput("");
              }}
              placeholder="Ask Anything"
              autoFocus={false}
              attachButtonDisabled={status === "streaming"}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    height: "100%",
  },
  errorText: {
    paddingHorizontal: 8,
    color: "red",
  },
  container: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    paddingHorizontal: 8,
    paddingTop: 10,
    justifyContent: "space-between",
  },
  scrollView: {
    flex: 1,
  },
  messageContainer: {
    marginVertical: 4,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  userMessage: {
    width: "50%",
    alignSelf: "flex-end",
  },
  assistantMessage: {
    width: "100%",
    alignSelf: "flex-start",
  },
  messageContent: {
    display: "flex",
    gap: 0,
  },
  messagePartContainer: {
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
