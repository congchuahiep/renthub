const screen = "PropertyCreate";

export const propertyDataForm = [
	{
		label: "Tên dãy trọ",
		field: "name",
	},
	{
		type: "region",
		label: "Tỉnh/huyện/xã",
		field: "region_address",
		returnScreen: screen,
	},
	{
		type: "street",
		label: "Địa chỉ dãy trọ",
		field: "address",
		returnScreen: screen,
		dependsOn: "region_address",
	},
	{
		type: "images",
		label: "Ảnh dãy trọ",
		field: "upload_images",
	},
];
