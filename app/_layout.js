import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Chat",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome size={size} name="comment" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: "Game",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome size={size} name="hand-rock-o" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="describe"
        options={{
          title: "Describe",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome size={size} name="camera" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
