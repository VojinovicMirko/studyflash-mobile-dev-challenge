import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import { useAppContext } from "@/context/AppContext";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const Header = () => {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].icon;
  const { regenerateMessages } = useAppContext();

  return (
    <ThemedView style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <IconSymbol size={24} name="line.3.horizontal" color={tintColor} />
          <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
            ChatGPT
          </ThemedText>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={regenerateMessages}>
            <IconSymbol size={24} name="square.and.pencil" color={tintColor} />
          </TouchableOpacity>
          <IconSymbol size={24} name="ellipsis" color={tintColor} />
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === "ios" ? 70 : 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "black",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  headerIcon: {
    marginRight: 16,
  },
});

export default Header;
