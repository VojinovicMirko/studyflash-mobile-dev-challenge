import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

interface MessageActionsProps {
  text: string;
}

export const MessageActions: React.FC<MessageActionsProps> = ({ text }) => {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].icon;
  const handleCopy = async () => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Message copied to clipboard");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleCopy}>
        <IconSymbol size={24} name="document.on.document" color={tintColor} />
      </TouchableOpacity>
      <TouchableOpacity>
        <IconSymbol size={24} name="hand.thumbsup" color={tintColor} />
      </TouchableOpacity>
      <TouchableOpacity>
        <IconSymbol size={24} name="hand.thumbsdown" color={tintColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
