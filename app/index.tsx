import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import PostCard from "@/components/PostCard";
import { Post } from "@/models/Post";
import { Text } from "react-native-paper";

const HomeScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("https://gorest.co.in/public/v2/posts", {
        headers: {
          Authorization: `Bearer 29986294b7b271aa6cbfd8ca679f0eb3eb33364ba60341b5aae3944f7d25bb06`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts");
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }: { item: Post }) => <PostCard post={item} />;

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginVertical: 16, paddingHorizontal: 16 }}>
        <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
          Latest Posts
        </Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default HomeScreen;
