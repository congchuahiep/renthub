/**
 * Đổi kiểu thời gian isoString (dạng khó đọc) thành dạng chỉ còn ngày/tháng/năm
 *
 * Ví dụ.
 * ```
 * console.log(formatDate("2025-05-10T03:07:06.288973Z")); // Kết quả: 10/05/2025
 * ```
 */
export function formatDate(isoString) {
	const date = new Date(isoString);
	return date.toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

/**
 * Đổi thời gian isoString thành thời gian tương đối
 *
 * ```
 * const now = new Date(); // Ví dụ hiện tại là ngày 2025-05-12
 *
 * console.log(getRelativeTime("2025-05-10T03:07:06.288973Z")); // 2 ngày trước
 * ```
 */
export function getRelativeTime(isoString) {
	const date = new Date(isoString);
	const now = new Date();
	const diff = now - date; // Độ chênh lệch thời gian tính bằng milliseconds

	const minutes = Math.floor(diff / (1000 * 60));
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (minutes < 1) {
		return "Ngay bây giờ";
	} else if (minutes < 60) {
		return `${minutes} phút trước`;
	} else if (hours < 24) {
		return `${hours} giờ trước`;
	} else if (days < 7) {
		return `${days} ngày trước`;
	} else {
		return formatDate(isoString); // Hiển thị ngày tháng nếu hơn 1 tuần
	}
}
