import { ChatInput } from "@/components/ChatInput";
import { Colors } from "@/constants/Colors";
import { useAppContext } from "@/context/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { generateAPIUrl } from "@/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function App() {
  const [input, setInput] = useState("");
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
      style={{
        height: "100%",
        backgroundColor: Colors[useColorScheme() ?? "light"].background,
      }}
    >
      {error ? (
        <Text
          style={{
            paddingHorizontal: 8,
            color: "red",
          }}
        >
          {error.message}
        </Text>
      ) : (
        <View
          style={{
            height: "95%",
            display: "flex",
            flexDirection: "column",
            paddingHorizontal: 8,
          }}
        >
          <ScrollView style={{ flex: 1 }}>
            {messages.map((m) => (
              <View key={m.id} style={{ marginVertical: 8 }}>
                <View>
                  <Text style={{ fontWeight: 700 }}>{m.role}</Text>
                  {m.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
                      case "tool-weather":
                        return (
                          <Text key={`${m.id}-${i}`}>
                            {JSON.stringify(part, null, 2)}
                          </Text>
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
