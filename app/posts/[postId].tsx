import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import { Card, Title, Paragraph, Avatar, Button } from "react-native-paper";
import CommentCard from "@/components/CommentCard";
import { Post } from "@/models/Post";
import { Comment } from "@/models/Comment";
import { useLocalSearchParams } from "expo-router";
import { User } from "@/models/User";
import { Text } from "react-native-paper";
import { View } from "react-native";

const PostDetailsScreen = () => {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(postId);

        const postResponse = await axios
          .get(`https://gorest.co.in/public/v2/posts/${postId}`, {
            headers: {
              Authorization: `Bearer 29986294b7b271aa6cbfd8ca679f0eb3eb33364ba60341b5aae3944f7d25bb06`,
            },
          })
          .then(async (response) => {
            const userResponse = await axios
              .get(
                `https://gorest.co.in/public/v2/users/${response.data.user_id}`,
                {
                  headers: {
                    Authorization: `Bearer 29986294b7b271aa6cbfd8ca679f0eb3eb33364ba60341b5aae3944f7d25bb06`,
                  },
                }
              )
              .then((response) => {
                setUser(response.data);
              })
              .catch((error) => {
                setUser({
                  id: 0,
                  name: "Default User",
                  email: "Default@gmail.com",
                  gender: "unknown",
                  status: "unknown",
                });
                console.error("Error fetching user");
              });
            setPost(response.data);
          })
          .catch((error) => {
            console.error("Error fetching post");
          });

        const commentsResponse = await axios
          .get(`https://gorest.co.in/public/v2/posts/${postId}/comments`, {
            headers: {
              Authorization: `Bearer 29986294b7b271aa6cbfd8ca679f0eb3eb33364ba60341b5aae3944f7d25bb06`,
            },
          })
          .then((response) => {
            setComments(response.data);
          })
          .catch((error) => {
            setComments([]);
            console.error("Error fetching comments");
          });
      } catch (error) {
        console.error("Errorrrr " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  if (loading || !post || !user) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Card>
        <Card.Title
          title={user.name}
          left={(props) => (
            <Avatar.Text {...props} label={user.name.charAt(0)} />
          )}
        />
        <Card.Content>
          <Title>{post.title}</Title>
          <Paragraph>{post.body}</Paragraph>
        </Card.Content>
      </Card>
      <View style={{ marginVertical: 16, paddingHorizontal: 16 }}>
        <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
          Comment Section
        </Text>
      </View>

      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </ScrollView>
  );
};

export default PostDetailsScreen;
