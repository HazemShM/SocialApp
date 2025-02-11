import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScrollView, ActivityIndicator, TextInput, Alert } from "react-native";
import { Card, Title, Paragraph, Avatar, Button } from "react-native-paper";
import CommentCard from "@/components/CommentCard";
import { Post } from "@/models/Post";
import { Comment } from "@/models/Comment";
import { useLocalSearchParams } from "expo-router";
import { User } from "@/models/User";
import { Text, View } from "react-native";

const PostDetailsScreen = () => {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("Error", "Comment cannot be empty.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `https://gorest.co.in/public/v2/posts/${postId}/comments`,
        {
          name: "Anonymous",
          email: "anonymous@example.com",
          body: newComment,
        },
        {
          headers: {
            Authorization: `Bearer 29986294b7b271aa6cbfd8ca679f0eb3eb33364ba60341b5aae3944f7d25bb06`,
          },
        }
      );

      setComments((prevComments) => [response.data, ...prevComments]); // Update comments list
      setNewComment(""); // Clear input
    } catch (error) {
      console.error("Error creating comment:", error);
      Alert.alert("Error", "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

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
        <Text style={{ fontWeight: "bold" }}>Comment Section</Text>
      </View>
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <TextInput
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
          }}
          multiline
        />
        <Button
          mode="contained"
          onPress={handleCreateComment}
          loading={submitting}
          disabled={submitting}
        >
          {submitting ? "Posting..." : "Post Comment"}
        </Button>
      </View>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </ScrollView>
  );
};

export default PostDetailsScreen;
