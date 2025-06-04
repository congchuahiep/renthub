/**
 * Tính meters per pixel tại một vĩ độ và zoom level
 */
function getMetersPerPixel(latitude, zoom) {
	return (
		(156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom)
	);
}

/**
 * Tính bán kính độ dài vị trí thực tế trên bản đồ dựa trên kích thước màn hình
 */
export function getRadiusInMeters(latitude, zoom, screenWidth) {
	const metersPerPixel = getMetersPerPixel(latitude, zoom);
	return (metersPerPixel * screenWidth) / 2; // chia đôi vì bạn cần radius từ tâm ra rìa
}
