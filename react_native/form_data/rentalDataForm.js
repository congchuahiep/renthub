const screen = "RentalCreate";

export const stepsInfo = [
	{ title: "Thông tin cơ bản", description: "Thông tin chính của bài đăng" },
	{ title: "Thông tin chi tiết", description: "Các thông số về nơi cho thuê" },
	{ title: "Tiện ích", description: "Chọn các tiện ích có sẵn" },
];

export const step1 = [
	{
		label: "Bài đăng cho:",
		field: "property_name",
		type: "property",
		returnScreen: screen,
	},
	{
		label: "Tiêu đề",
		field: "title",
		icon: "format-title",
		required: true,
	},
	{
		label: "Mô tả chi tiết",
		field: "content",
		icon: "text",
		multiline: true,
		numberOfLines: 4,
		required: true,
	},
	{
		label: "Giá thuê / tháng",
		field: "price",
		icon: "cash",
		keyboardType: "numeric",
		required: true,
	},
];

export const step2 = [
	{
		label: "Diện tích (m²)",
		field: "area",
		icon: "resize",
		keyboardType: "numeric",
		required: true,
	},
	{
		type: "counter",
		label: "Số người tối đa",
		field: "limit_person",
		icon: "account-group",
		min: 0,
		max: 10,
		required: true,
	},
	{
		type: "counter",
		label: "Số phòng ngủ",
		field: "number_of_bedrooms",
		icon: "bed",
    min: 0,
    max: 10,
		required: true,
	},
	{
		type: "counter",
		label: "Số phòng tắm",
		field: "number_of_bathrooms",
		icon: "shower",
		min: 0,
		max: 10,
		required: true,
	},
	{
		label: "Hình ảnh",
		field: "upload_images",
		type: "images",
		required: true,
	},
];

export const stepFields = [step1, step2];
