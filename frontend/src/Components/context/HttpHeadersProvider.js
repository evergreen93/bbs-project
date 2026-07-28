import { createContext, useState } from "react";

export const HttpHeadersContext = createContext();

function HttpHeadersProvider({ children }) {
	const getInitialHeaders = () => {
		const token = localStorage.getItem("bbs_access_token");

		if (!token) {
			return {};
		}

		return {
			Authorization: `Bearer ${token}`
		};
	};

	const [headers, setHeaders] = useState(getInitialHeaders);

	const value = {
		headers,
		setHeaders
	};

	return (
		<HttpHeadersContext.Provider value={value}>
			{children}
		</HttpHeadersContext.Provider>
	);
}

export default HttpHeadersProvider;