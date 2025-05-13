import { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { ActivityIndicator, AnimatedFAB, Avatar, Card, Icon, Text, TextInput, useTheme } from "react-native-paper";
import Carousel from "../components/Carousel";
import Apis, { endpoints } from "../config/Apis";
import useStyle from "../styles/useStyle";
import { formatDate, getRelativeTime } from "../utils/datetime";
import { GoogleMaps } from "expo-maps";
import { toVietNamDong } from "../utils/currency";


const RentalDetail = ({ route }) => {

  const theme = useTheme();
  const style = useStyle();

  const [isPhoneButtonExtended, setIsPhoneButtonExtended] = useState(true);
  const [loading, setLoading] = useState(false);

  const [rentalPost, setRentalPost] = useState();
  const [comments, setComments] = useState();

  const { id } = route.params;

  // Khi trượt nút liên hệ sẽ thu nhỏ lại
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsPhoneButtonExtended(currentScrollPosition <= 0);
  };

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
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0} style={{ flex: 1, position: "relative" }}>
            <ScrollView style={[style.container]} onScroll={onScroll}>

              {/* KHUNG XEM ẢNH */}
              <View
                style={[
                  style.box_shadow,
                  {
                    marginTop: 16,
                    marginBottom: 8,
                    borderWidth: 2,
                    borderRadius: 10,
                    borderColor: theme.colors.secondary
                  }]}
              >
                <Carousel images={rentalPost.post.images} />
              </View >

              {/* TỰA ĐỀ */}
              <Card
                style={[style.card]}
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
                    <Icon source="timer-sand" size={20} color={theme.colors.secondary} />
                    <Text style={{ color: theme.colors.secondary, flexShrink: 1 }}>
                      Hết hạn: {formatDate(rentalPost.expired_date)}
                    </Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginLeft: 3, marginTop: 8 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Icon source={"bed-outline"} size={16} color={theme.colors.primary} />
                      <Text style={{ marginLeft: 3, marginRight: 16 }}>{rentalPost.number_of_bedrooms}</Text>
                      <Icon source={"shower"} size={16} color={theme.colors.primary} />
                      <Text style={{ marginLeft: 3, marginRight: 16 }}>{rentalPost.number_of_bathrooms}</Text>
                      <Icon source={"square-rounded-outline"} size={16} color={theme.colors.primary} />
                      <Text style={{ marginLeft: 3 }}>{rentalPost.area}m²</Text>
                    </View>
                    <Text style={{ color: theme.colors.primary, fontWeight: 900, fontSize: 18 }}>
                      {toVietNamDong(rentalPost.price)}
                    </Text>
                  </View>
                </Card.Content>
              </Card>

              {/* THÔNG TIN CHI TIẾT */}
              <Card style={[style.card,]} >
                <Card.Content>
                  <Text style={[style.title_small, { color: theme.colors.primary, marginBottom: 5 }]}>
                    Thông tin chi tiết
                  </Text>
                  <Text style={{ color: theme.colors.secondary }}>
                    {rentalPost.content}
                  </Text>
                </Card.Content>
              </Card>

              {/* THÔNG TIN DÃY TRỌ VÀ VỊ TRÍ DÃY TRỌ */}
              <Card style={[style.card, { height: 468 }]}>
                <Card.Content>
                  <View style={{ height: 436 }}>
                    <Text style={[style.title_small, { color: theme.colors.primary, marginBottom: 5 }]}>
                      Vị trí dãy trọ
                    </Text>
                    <Text style={{ color: theme.colors.secondary, flexShrink: 1, marginBottom: 6 }}>
                      {rentalPost.property.address}
                      , {rentalPost.property.ward}
                      , {rentalPost.property.district}
                      , {rentalPost.property.province}
                    </Text>
                    <GoogleMaps.View
                      style={{ flex: 1, borderRadius: 6, flexShrink: 1 }}
                      cameraPosition={{
                        coordinates: {
                          latitude: rentalPost.property.latitude,
                          longitude: rentalPost.property.longitude
                        },
                        zoom: 15
                      }}
                      markers={[{
                        coordinates: {
                          latitude: rentalPost.property.latitude,
                          longitude: rentalPost.property.longitude
                        },
                        title: rentalPost.title,
                      }]}
                      uiSettings={{
                        myLocationButtonEnabled: false
                      }}
                    />
                  </View>
                </Card.Content>
              </Card>

              {/* THÔNG TIN CHỦ ĐĂNG BÀI */}
              {/* TODO: Thêm nút follow */}
              <Card style={style.card}>
                <Card.Content>
                  <Text style={[style.title_small, { color: theme.colors.primary, marginBottom: 16 }]}>
                    Thông tin liên hệ
                  </Text>

                  <View style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 24,
                    marginBottom: 16
                  }}>
                    <Avatar.Image source={{ uri: rentalPost.landlord.avatar }} size={96} />
                    <View>
                      <Text style={[style.title_small]}>
                        {rentalPost.landlord.last_name} {rentalPost.landlord.first_name}
                      </Text>
                      <Text>
                        {rentalPost.landlord.email}
                      </Text>
                      <Text>
                        {rentalPost.landlord.phone_number}
                      </Text>
                    </View>
                  </View>

                </Card.Content>
              </Card>

              {/* KHUNG BÌNH LUẬN */}
              {/* TODO: Triển khai bình luận bài đăng */}
              <Card style={style.card}>
                <Card.Content>
                  <Text style={[style.title_small, { color: theme.colors.primary, marginBottom: 5 }]}>
                    Bình luận
                  </Text>

                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <Avatar.Text label="?" size={36} />
                    <TextInput label={"Bình luận của bạn..."} style={{ flexGrow: 1 }} mode="outlined" />
                  </View>

                  
                  {comments ? <Text>TRIỂN KHAI BÌNH LUẬN</Text> : <Text>Không có bình luận nào</Text>}
                </Card.Content>



              </Card>

              <View style={{ height: 120 }} />

            </ScrollView >

            {/* TODO: TRIỂN KHAI NÚT LIÊN HỆ */}
            <AnimatedFAB
              icon={'phone'}
              label={'Liên hệ ngay'}
              extended={isPhoneButtonExtended}
              onPress={() => console.log('Pressed')}
              animateFrom={'right'}
              style={{ position: "absolute", bottom: 42, right: 24 }}
            />
          </KeyboardAvoidingView >

          : <ActivityIndicator />
      }
    </>
  )
}

export default RentalDetail;