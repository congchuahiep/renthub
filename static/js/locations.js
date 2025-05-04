// Xử lý logic phụ thuộc giữa các trường tỉnh-huyện-xã trong Django admin
document.addEventListener("DOMContentLoaded", () => {
	const provinceField = document.getElementById("id_province");
	const districtField = document.getElementById("id_district");
	const wardField = document.getElementById("id_ward");

	districtField.disabled = true;
	wardField.disabled = true;

	// Hàm gọi API và cập nhật các trường select
	function fetchOptions(url, targetField, selectedValue = null) {
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				targetField.innerHTML = "";
				const unSelected = document.createElement("option");
				unSelected.value = null;
				unSelected.textContent = "Select value";
				unSelected.disabled = true;
				unSelected.selected = true;
				targetField.appendChild(unSelected);

				// biome-ignore lint/complexity/noForEach: <explanation>
				data.forEach((item) => {
					const option = document.createElement("option");
					option.value = item.code;
					option.textContent = item.full_name;

					if (selectedValue && selectedValue === item.code) {
						option.selected = true;
					}

					targetField.appendChild(option);
				});

				targetField.disabled = false;
			});
	}

	// Kiểm tra và tải dữ liệu khi trang được tải
	const initialProvince = provinceField.value;
	const initialDistrict = districtField.value;
	const initialWard = wardField.value;

	if (initialProvince) {
		fetchOptions(
			`/districts/?province_id=${initialProvince}`,
			districtField,
			initialDistrict,
		);
	}

	if (initialDistrict) {
		fetchOptions(
			`/wards/?district_id=${initialDistrict}`,
			wardField,
			initialWard,
		);
	}

	provinceField.addEventListener("change", () => {
		const provinceId = provinceField.value;
		if (provinceId) {
			fetchOptions(`/districts/?province_id=${provinceId}`, districtField);

			// Reset lại giá trị của phường/xã khi tỉnh thay đổi
			wardField.innerHTML = ""; 
			const unSelected = document.createElement("option");
			unSelected.value = null;
			unSelected.textContent = "Select value";
			unSelected.disabled = true;
			unSelected.selected = true;
			wardField.appendChild(unSelected);
            wardField.disabled = true;
		} else {
            districtField.innerHTML = "Select value";
            districtField.disabled = true;
            wardField.innerHTML = "Select value";
            wardField.disabled = true;
		}
	});

	districtField.addEventListener("change", () => {
		const districtId = districtField.value;
		if (districtId) {
			fetchOptions(`/wards/?district_id=${districtId}`, wardField);
		} else {
            wardField.innerHTML = "Select value";
            wardField.disabled = true;
		}
	});
});
