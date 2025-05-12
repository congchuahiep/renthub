import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Card, Divider, Icon, Text, useTheme } from "react-native-paper";
import Apis, { endpoints } from "../config/Apis";
import Carousel from "../components/Carousel";
import spacing from "../styles/spacing";
import card from "../styles/card";
import useStyle from "../styles/useStyle";
import { formatDate, getRelativeTime } from "../utils/datetime";

const RentalDetail = ({ route }) => {

  const theme = useTheme();
  const style = useStyle();

  const [rentalPost, setRentalPost] = useState();
  const [loading, setLoading] = useState(false);

  const { id } = route.params;

  const loadRentalPost = async () => {
    setLoading(true);

    console.log(id)

    await Apis.get(endpoints["rental-details"](id))
      .then((res) => {

        console.log(res.data);
        setRentalPost(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  useEffect(() => {
    loadRentalPost();
  }, [])

  return (
    <>
      {
        rentalPost
          ?
          <ScrollView style={style.container}>

            <View
              style={[
                style.box_shadow,
                {
                  marginTop: 16,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: theme.colors.secondary
                }]}
            >
              <Carousel images={rentalPost.post.images} />
            </View >

            <Card
              style={[style.card]}
              mode='outlined'
            >
              <Card.Title title={rentalPost.title} titleStyle={[style.title_big, { color: theme.colors.primary }]} />
              <Card.Content style={{ color: theme.colors.secondary }}>

                <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 5, marginBottom: "6" }}>
                  <Icon source="map-marker-outline" size={20} color={theme.colors.secondary} style={{}} />
                  <Text variant="bodyMedium" style={{ color: theme.colors.secondary, flexShrink: 1 }}>
                    {rentalPost.property.address}
                    , {rentalPost.property.ward}
                    , {rentalPost.property.district}
                    , {rentalPost.property.province}
                  </Text>
                </View>

                <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 5, marginBottom: "6" }}>
                  <Icon source="calendar-range" size={20} color={theme.colors.secondary} />
                  <Text style={{ color: theme.colors.secondary, flexShrink: 1 }}>

                    Đăng tải: {getRelativeTime(rentalPost.created_date)}
                  </Text>
                </View>

                <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 5, marginBottom: "6" }}>
                  <Icon source="calendar-range" size={20} color={theme.colors.secondary} />
                  <Text style={{ color: theme.colors.secondary, flexShrink: 1 }}>

                    Hết hạn: {formatDate(rentalPost.expired_date)}
                  </Text>
                </View>


              </Card.Content>
            </Card>

          </ScrollView >

          : <ActivityIndicator />
      }
    </>
  )
}

export default RentalDetail;