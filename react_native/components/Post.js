import * as React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import typography from '../styles/typography';
import Carousel from './Carousel';
import { useTheme } from 'react-native-paper';


const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const Post = ({ title, content, images, price }) => {
	const theme = useTheme();

	return (
		<Card>
			<Card.Content style={{marginBottom: 10}}>
				{images && <Carousel images={images} />}
				<Text style={[typography.title, { color: theme.colors.primary }]}>{title}</Text>
				<Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>{content}</Text>
			</Card.Content>
		</Card>
	)
};

export default Post;