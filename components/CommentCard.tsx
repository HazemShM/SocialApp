import React from "react";
import { Card, Paragraph, Avatar } from "react-native-paper";
import { Comment } from "@/models/Comment";

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <Card style={{ margin: 10 }}>
      <Card.Title
        title={comment.name}
        left={(props) => (
          <Avatar.Text {...props} label={comment.name.charAt(0)} />
        )}
      />
      <Card.Content>
        <Paragraph>{comment.body}</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default CommentCard;
