import { Slot } from "expo-router";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="posts/[postId]" options={{ title: "Post Details" }} />
    </Stack>
  );
}
