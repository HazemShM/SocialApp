import React from "react";
import { TouchableOpacity } from "react-native";
import { Card, Title, Paragraph, Avatar } from "react-native-paper";
import { Post } from "@/models/Post";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/models/User";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!user) {
      axios
        .get(`https://gorest.co.in/public/v2/users/${post.user_id}`, {
          headers: {
            Authorization: `Bearer 29986294b7b271aa6cbfd8ca679f0eb3eb33364ba60341b5aae3944f7d25bb06`,
          },
        })
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
          console.log("Error fetching user");
        });
      //   console.log(post.user_id);
    }
  }, [post]);
  const router = useRouter();

  const handlePress = () => {
    router.push(`/posts/${post.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card style={{ margin: 10 }}>
        <Card.Title
          title={user?.name || "Loading..."}
          left={(props) => (
            <Avatar.Text {...props} label={user ? user.name.charAt(0) : "?"} />
          )}
        />
        <Card.Content>
          <Title>{post.title}</Title>
          <Paragraph>{post.body}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default PostCard;
