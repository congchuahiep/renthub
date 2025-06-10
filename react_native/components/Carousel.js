import React, { useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { Chip, useTheme } from "react-native-paper";

const Carousel = ({ images, badge }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const theme = useTheme();

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        // style={{borderRadius: 8}}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View style={[styles.imageContainer]}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
        )}
      />
      {/*
        Dấu chấm hiển thị số lượng ảnh
        #TODO: sửa lại dấu chấm trượt cho đúng ảnh
      */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex
                    ? theme.colors.onPrimary
                    : theme.colors.backdrop,
              },
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {badge && (
        <Chip
          icon={"square-rounded-outline"}
          // mode='outlined'
          compact={true}
          style={{ position: "absolute", bottom: 5, left: 5 }}
          // textStyle={{ color: theme.colors.primary }}
        >
          {badge}m²
        </Chip>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1 / 1, // Đảm bảo khung trượt là hình vuông
    borderRadius: 8, // Bo cong khung trượt
    overflow: "hidden", // Đảm bảo nội dung bên trong không vượt ra ngoài
    position: "relative",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1 / 1, // Đảm bảo khung trượt là hình vuông
    height: "100%",
  },
  image: {
    aspectRatio: 1 / 1,
    width: "100%",
    resizeMode: "cover", // Cắt ảnh để vừa khung hình vuông
  },

  dotsContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  activeDot: {
    width: 16,
  },
  inactiveDot: {
    backgroundColor: "#ccccccaa", // Màu nhạt cho ảnh không được chọn
  },
});

export default Carousel;
