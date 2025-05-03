// Xử lý logic phụ thuộc giữa các trường tỉnh-huyện-xã trong Django admin
// TODO: Khi trường đã có sẵn giá trị thì các form select tự động enable và load dữ liệu tương ứng
document.addEventListener("DOMContentLoaded", () => {
    const provinceField = document.getElementById("id_province");
    const districtField = document.getElementById("id_district");
    const wardField = document.getElementById("id_ward");

    districtField.disabled = true;
    wardField.disabled = true;

    function fetchOptions(url, targetField) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                targetField.innerHTML = "";
                // biome-ignore lint/complexity/noForEach: <explanation>
                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.code;
                    option.textContent = item.full_name;
                    targetField.appendChild(option);
                    console.log(item)
                });
            });
    }

    provinceField.addEventListener("change", () => {
        const provinceId = provinceField.value;
        if (provinceId) {
            fetchOptions(`/districts/?province_id=${provinceId}`, districtField);
            districtField.disabled = false;
        } else {
            districtField.innerHTML = "";
        }
    });

    districtField.addEventListener("change", () => {
        const districtId = districtField.value;
        if (districtId) {
            fetchOptions(`/wards/?district_id=${districtId}`, wardField);
            wardField.disabled = false;
        } else {
            wardField.innerHTML = "";
        }
    });
});