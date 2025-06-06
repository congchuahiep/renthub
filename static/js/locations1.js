document.addEventListener("DOMContentLoaded", () => {
    const provinceField = document.getElementById("id_province");
    const districtField = document.getElementById("id_district");
    
    districtField.disabled=true;

    

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

    const initialProvince = provinceField.value;
	const initialDistrict = districtField.value;

    if (initialProvince) {
		fetchOptions(
			`/districts/?province_id=${initialProvince}`,
			districtField,
			initialDistrict,
		);
	}

    

    provinceField.addEventListener("change", () => {
		const provinceId = provinceField.value;
		if (provinceId) {
			fetchOptions(`/districts/?province_id=${provinceId}`, districtField);


			const unSelected = document.createElement("option");
			unSelected.value = null;
			unSelected.textContent = "Select value";
			unSelected.disabled = true;
			unSelected.selected = true;

		} else {
            districtField.innerHTML = "Select value";
            districtField.disabled = true;

		}
	});

    
    
});
