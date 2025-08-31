import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  placeholder = "Message ChatGPT...",
  autoFocus = true,
}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={{ marginTop: 8, marginBottom: 16 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colorScheme === "dark" ? "#1e1e1e" : "#f5f5f5",
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: colorScheme === "dark" ? "#2d2d2d" : "#e0e0e0",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: !value.trim()
              ? Colors[colorScheme ?? "light"].tint
              : colorScheme === "dark"
              ? "#3d3d3d"
              : "#e0e0e0",
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 8,
          }}
          disabled={!!value.trim()}
          onPress={() => Alert.alert("Attachment", "Add an attachment")}
        >
          <Text
            style={{
              color: !value.trim()
                ? "white"
                : colorScheme === "dark"
                ? "#9BA1A6"
                : "#687076",
              fontSize: 16,
            }}
          >
            +
          </Text>
        </TouchableOpacity>
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: Colors[colorScheme ?? "light"].text,
            paddingVertical: 8,
          }}
          placeholder={placeholder}
          placeholderTextColor={Colors[colorScheme ?? "light"].icon}
          value={value}
          onChange={(e) => onChangeText(e.nativeEvent.text)}
          multiline
          autoFocus={autoFocus}
        />
        <TouchableOpacity
          style={{
            backgroundColor: value.trim()
              ? Colors[colorScheme ?? "light"].tint
              : colorScheme === "dark"
              ? "#3d3d3d"
              : "#e0e0e0",
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 8,
          }}
          disabled={!value.trim()}
          onPress={() => {
            if (value.trim()) {
              onSend();
            }
          }}
        >
          <Text
            style={{
              color: value.trim()
                ? "white"
                : colorScheme === "dark"
                ? "#9BA1A6"
                : "#687076",
              fontSize: 16,
            }}
          >
            →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
