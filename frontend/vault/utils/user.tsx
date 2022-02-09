import axios from "axios";
import useSWR from "swr";

export default function useUser() {
	const AUTH_TOKEN = "";
	if (typeof window !== "undefined") {
		const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
	}

	const fetcher = (url: string) =>
		axios
			.get(url, {
				headers: {
					Authorization: AUTH_TOKEN,
					"Content-Type": "application/json",
				},
			})
			.then((res) => res.data);

	const { data, mutate, error } = useSWR("api_user", fetcher);

	const loading = !data && !error;
	const loggedOut = error && error.status === 401;

	return {
		loading,
		loggedOut,
		user: data,
		mutate,
	};
}
