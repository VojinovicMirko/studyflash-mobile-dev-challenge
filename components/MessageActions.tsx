import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

import { MESSAGE_ACTION_STATUS } from "@/constants";

interface MessageActionsProps {
  text: string;
  status: MESSAGE_ACTION_STATUS;
  id: string;
  likeCallback: (id: string) => void;
  dislikeCallback: (id: string) => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  text,
  status,
  id,
  likeCallback,
  dislikeCallback,
}) => {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].icon;

  const handleCopyToClipBoard = async () => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Message copied to clipboard");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleCopyToClipBoard}>
        <IconSymbol size={24} name="document.on.document" color={tintColor} />
      </TouchableOpacity>

      {(status === MESSAGE_ACTION_STATUS.LIKED ||
        status === MESSAGE_ACTION_STATUS.NEUTRAL) && (
        <TouchableOpacity onPress={() => likeCallback(id)}>
          <IconSymbol
            size={24}
            name={
              status === MESSAGE_ACTION_STATUS.LIKED
                ? "hand.thumbsup.fill"
                : "hand.thumbsup"
            }
            color={tintColor}
          />
        </TouchableOpacity>
      )}

      {(status === MESSAGE_ACTION_STATUS.DISLIKED ||
        status === MESSAGE_ACTION_STATUS.NEUTRAL) && (
        <TouchableOpacity onPress={() => dislikeCallback(id)}>
          <IconSymbol
            size={24}
            name={
              status === MESSAGE_ACTION_STATUS.DISLIKED
                ? "hand.thumbsdown.fill"
                : "hand.thumbsdown"
            }
            color={tintColor}
          />
        </TouchableOpacity>
      )}
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
