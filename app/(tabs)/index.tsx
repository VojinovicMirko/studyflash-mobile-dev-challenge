import { ChatInput } from "@/components/ChatInput";
import { MessageActions } from "@/components/MessageActions";
import { Colors } from "@/constants/Colors";
import { useAppContext } from "@/context/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { generateAPIUrl } from "@/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [input, setInput] = useState("");
  const colorScheme = useColorScheme();
  const { isRegenerating, setIsRegenerating } = useAppContext();

  const { messages, error, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("/api/chat"),
    }),
    onError: (error) => console.error(error, "ERROR"),
  });

  useEffect(() => {
    if (isRegenerating) {
      setMessages([]);
      setIsRegenerating(false);
    }
  }, [isRegenerating]);

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
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
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
                            <Text style={styles.messageText}>{part.text}</Text>
                            {m.role === "assistant" && (
                              <MessageActions text={part.text} />
                            )}
                          </View>
                        );
                      case "tool-weather":
                        return (
                          <View
                            key={`${m.id}-${i}`}
                            style={styles.messagePartContainer}
                          >
                            <Text style={styles.messageText}>
                              {JSON.stringify(part, null, 2)}
                            </Text>
                            {m.role === "assistant" && (
                              <MessageActions
                                text={JSON.stringify(part, null, 2)}
                              />
                            )}
                          </View>
                        );
                    }
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          <ChatInput
            value={input}
            onChangeText={(text) => setInput(text)}
            onSend={() => {
              sendMessage({ text: input });
              setInput("");
            }}
            placeholder="Ask Anything"
            autoFocus={true}
          />
        </View>
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
    height: "95%",
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 8,
    marginVertical: 10,
  },
  scrollView: {
    flex: 1,
  },
  messageContainer: {
    marginVertical: 4,
    borderRadius: 12,
    padding: 14,
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
