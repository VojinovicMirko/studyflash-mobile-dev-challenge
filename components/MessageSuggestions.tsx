import { MOCK_SUGGESTIONS } from "@/constants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type MessageSuggestionsProps = {
  onSelect: (text: string) => void;
};

export const MessageSuggestions: React.FC<MessageSuggestionsProps> = ({
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`What's on your mind today?`}</Text>
      <View style={styles.buttonsWrapper}>
        {MOCK_SUGGESTIONS.map((s, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.button}
            onPress={() => onSelect(s)}
          >
            <Text style={styles.buttonText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "auto",
    marginBottom: "auto",
    marginVertical: 12,
    padding: 8,
    alignSelf: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 30,
    color: "#555",
    textAlign: "center",
  },
  buttonsWrapper: {
    flexDirection: "column",
    gap: 8,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },
  buttonText: {
    fontSize: 14,
    color: "#333",
  },
});
