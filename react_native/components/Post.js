import * as React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import typography from '../styles/typography';
import Carousel from './Carousel';
import { useTheme } from 'react-native-paper';


const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const Post = ({ title, content, images, price, address }) => {
	const theme = useTheme();

	return (
		<Card style={{marginBottom: 10}}>
			<Card.Content style={{marginBottom: 10}}>
				{images && <Carousel images={images} />}
				<Text style={[typography.title, { color: theme.colors.primary }]}>{title}</Text>
				<Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>{address}</Text>
			</Card.Content>
		</Card>
	)
};

export default Post;