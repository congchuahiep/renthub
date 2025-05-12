import * as React from 'react';
import { Avatar, Button, Card, Chip, Icon, Text } from 'react-native-paper';
import typography from '../styles/typography';
import Carousel from './Carousel';
import { useTheme } from 'react-native-paper';
import { TouchableOpacity, View } from 'react-native';
import { toVietNamDong } from '../utils/currency';
import card from '../styles/card';
import { useNavigation } from '@react-navigation/native';
import useStyle from '../styles/useStyle';


const RentalPostCard = ({ id, title, area, images, price, address, numberOfBed, numberOfBathroom }) => {
	const theme = useTheme();
	const style = useStyle();

	const navigation = useNavigation();

	const toRentalDetail = () => {
		navigation.navigate("rentalDetail", {"id": id, "title": title});
	}

	return (
		<Card
			style={style.card}
			mode='outlined'
		>
			<Card.Content>
				{images && <Carousel images={images} badge={area} />}
			</Card.Content>

			<TouchableOpacity activeOpacity={0.7} onPress={toRentalDetail}>
				<Card.Content style={{ marginHorizontal: 8, marginTop: 5 }}>

					<Text style={[style.title_small, { marginBottom: 5 }]}>{title}</Text>

					<Text variant="bodyMedium" style={{ color: theme.colors.secondary, marginBottom: 5 }}>
						<Icon source={"map-marker-outline"} size={16} color={theme.colors.secondary} />
						{address}
					</Text>

					<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 3 }}>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
							<Icon source={"bed-outline"} size={16} color={theme.colors.primary} />
							<Text style={{ marginLeft: 3, marginRight: 12 }}>{numberOfBed}</Text>

							<Icon source={"shower"} size={16} color={theme.colors.primary} />
							<Text style={{ marginLeft: 3 }}>{numberOfBathroom}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

						</View>
					</View>
				</Card.Content>
			</TouchableOpacity>


			<Card.Actions style={{ marginHorizontal: 10, marginBottom: 10 }}>
				<Text style={{ color: theme.colors.primary, fontWeight: 900, fontSize: 16, flexGrow: 1 }}>
					{toVietNamDong(price)}
				</Text>
				<Button
					compact={true}
					onPress={toRentalDetail}
					style={{
						borderRadius: 8,
						flexGrow: 1,
						backgroundColor: theme.colors.secondaryContainer
					}}
					textColor={theme.colors.primary}
				>
					Chi tiết
				</Button>
				<Button
					mode='contained'
					compact={true}
					style={{ borderRadius: 8, flexGrow: 1 }}
				>
					Liên hệ
				</Button>
			</Card.Actions>
		</Card>
	)
};

export default RentalPostCard;