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
		label: "Số người tối đa",
		field: "limit_person",
		icon: "account-group",
		keyboardType: "numeric",
		required: true,
	},
	{
		label: "Số phòng ngủ",
		field: "number_of_bedrooms",
		icon: "bed",
		keyboardType: "numeric",
		required: true,
	},
	{
		label: "Số phòng tắm",
		field: "number_of_bathrooms",
		icon: "shower",
		keyboardType: "numeric",
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
