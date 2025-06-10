const screen = "RegisterLandlord";

export const step1 = [
	{
		label: "Ảnh đại diện",
		field: "avatar",
		type: "avatar",
	},
	{
		label: "Tên",
		field: "first_name",
	},
	{
		label: "Họ và tên lót",
		field: "last_name",
	},
];

export const step2 = [
	{
		label: "Tên đăng nhập",
		field: "username",
		icon: "account-circle",
	},
	{
		label: "Email",
		field: "email",
		icon: "email",
		keyboardType: "email-address",
	},
	{
		label: "Mật khẩu",
		field: "password",
		secureTextEntry: true,
		icon: "eye",
	},
	{
		label: "Xác nhận mật khẩu",
		field: "confirm_password",
		secureTextEntry: true,
		icon: "eye",
	},
];

export const step3 = [
	{
		label: "Số điện thoại",
		field: "phone_number",
		icon: "phone",
		keyboardType: "phone-pad",
	},
	{
		label: "Ngày sinh",
		field: "dob",
		type: "date",
		icon: "cake-variant",
	},
	{
		label: "Số căn cước công dân",
		field: "cccd",
		icon: "card-account-details",
		keyboardType: "number-pad",
	},
	{
		label: "Đường",
		field: "address",
		icon: "road-variant",
	},
	{
		label: "Quận/huyện",
		field: "district",
		icon: "home-city",
	},
	{
		label: "Tỉnh thành",
		field: "province",
		icon: "city",
	},
];

export const step4 = [
	{
		label: "Tên dãy trọ",
		field: "property_name",
	},
	// {
	// 	label: "Địa chỉ phường tài sản",
	// 	field: "property_ward",
	// 	hidden: true,
	// },
	// {
	// 	label: "Địa chỉ quận tài sản",
	// 	field: "property_district",
	// 	hidden: true,
	// },
	// {
	// 	label: "Địa chỉ tỉnh tài sản",
	// 	field: "property_province",
	// 	hidden: true,
	// },
	{
		type: "region",
		label: "Chọn tỉnh/huyện/xã",
		field: "property_region_address",
    returnScreen: screen,
	},
	{
		type: "street",
		label: "Địa chỉ dãy trọ",
		field: "property_address",
    returnScreen: screen,
    dependsOn: "property_region_address",
	},
	{
		label: "Ảnh dãy trọ",
		field: "property_upload_images",
		type: "images",
	},
];

// Export stepsInfo và stepFields
export const stepsInfo = [
	{ title: "Thông tin căn bản" },
	{ title: "Thông tin đăng nhập" },
	{ title: "Thông tin cá nhân" },
	{
		title: "Dãy trọ đầu tiên",
		description:
			"Chúng tôi yêu cầu người dùng loại chủ trọ khi mới tạo cần cung cấp ít nhất thông tin về 1 dãy trọ hiện tại mà bạn đang sở hữu",
	},
];

export const stepFields = [step1, step2, step3, step4];
