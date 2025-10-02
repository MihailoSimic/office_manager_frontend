import Swal from "sweetalert2";

const TokenExpiredSwal = async () => {
	await Swal.fire({
		icon: "warning",
		title: "Sesija je istekla",
		text: "Vaša sesija je istekla. Prijavite se ponovo.",
		confirmButtonText: "U redu",
		allowOutsideClick: false,
		allowEscapeKey: false,
		timer: 3000
	});
};

export default TokenExpiredSwal;
