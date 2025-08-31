import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type WeatherData = {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
};

type WeatherWidgetProps = {
  data: WeatherData | null | undefined;
};

const getWeatherIcon = (condition: string) => {
  const c = condition.toLowerCase();
  if (c.includes("sun") || c.includes("clear")) return "☀️";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("rain")) return "🌧️";
  if (c.includes("storm")) return "⛈️";
  if (c.includes("snow")) return "❄️";
  return "🌡️";
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data }) => {
  const [unit, setUnit] = useState<"C" | "F">("C");

  const toggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  const formatTemp = (tempC: number) => {
    return unit === "C" ? tempC : Math.round((tempC * 9) / 5 + 32);
  };

  if (!data) return <Text>Wrong Weather Data</Text>;

  const icon = getWeatherIcon(data.condition);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleUnit} style={styles.tempContainer}>
        <Text style={styles.location}>{data.location}</Text>
        <Text style={styles.temp}>
          {formatTemp(data.temperature)}°{unit}
        </Text>
        <Text style={styles.icon}>{icon}</Text>
      </TouchableOpacity>
      <Text style={styles.toggleText}>Tap to toggle °C/°F</Text>
      <Text style={styles.condition}>{data.condition}</Text>
      <View style={styles.details}>
        <Text>Humidity: {data.humidity}%</Text>
        <Text>Wind: {data.windSpeed} km/h</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
    borderRadius: 16,
    alignItems: "flex-start",
    width: "auto",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  location: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tempContainer: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  temp: {
    fontSize: 32,
    fontWeight: "bold",
  },
  icon: {
    fontSize: 32,
    marginLeft: 8,
  },
  condition: {
    fontSize: 16,
    color: "#555",
  },
  details: {
    marginTop: 8,
  },
  toggleText: {
    marginVertical: 8,
    fontSize: 12,
    color: "#555",
  },
});
