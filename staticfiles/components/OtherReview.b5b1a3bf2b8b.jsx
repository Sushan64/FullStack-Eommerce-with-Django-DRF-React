import { Card, Avatar, Typography } from "antd";

const { Text, Paragraph } = Typography;

export default function OtherReview({ review }) {
  return (
    <div className="w-full my-4">
      <div style={{ display: "flex", gap: "12px" }}>
        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        <div>
          <Text strong>{review.user.username}</Text>
          <Paragraph style={{ margin: 0 }}>
            {review.comment}
            </Paragraph>
          <Text type="secondary" style={{ fontSize: 12 }}>
            2 minutes ago
          </Text>
        </div>
      </div>
    </div>
  );
}
