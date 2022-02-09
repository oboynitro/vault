import axios from "axios";
import type { NextPage } from "next";
import Router from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import Header from "../components/Header";

interface IResourceItem {
	id: string;
	resource_link: string;
	resource_username: string;
	resource_password: string;
	created_at: string;
	updated_at: string;
}

interface IError {
	trigger: boolean;
	message: string;
}

interface IToast extends IError {}

const Home: NextPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isPasswordHidden, setIsPasswordHidden] = useState(true);
	const [loading, setLoading] = useState(false);

	const [resourceError, setResourceError] = useState(false);
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [successToast, setSuccessToast] = useState<null | string>(null);
	const [errorToast, setErrorToast] = useState<null | string>(null);

	const [resource, setResource] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [resourceID, setResourceID] = useState<null | string>(null);

	const fetcher = (url: string) =>
		axios
			.get(url, {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((res) => res.data);

	const { data: resourceData, error } = useSWR(
		"http://127.0.0.1:8000/api/secrets",
		fetcher
	);
	const dataLoading = !resourceData && !error;

	const setDefaults = () => {
		setUsername("");
		setResource("");
		setPassword("");
		setResourceError(false);
		setUsernameError(false);
		setPasswordError(false);
	};

	const clearErorrs = () => {
		setResourceError(false);
		setUsernameError(false);
		setPasswordError(false);
	};

	const closeModal = () => {
		setDefaults();
		setIsPasswordHidden(true);
		setIsModalOpen(false);
	};

	const addNewResource = () => {
		setDefaults();
		setResourceID(null);
		setIsModalOpen(true);
	};

	const setUpdateResource = async (id: string) => {
		setIsPasswordHidden(true);
		try {
			const response = await axios.get(
				`http://127.0.0.1:8000/api/secrets/${id}`
			);
			const singleResource: IResourceItem = await response.data;
			setResource(singleResource.resource_link);
			setUsername(singleResource.resource_username);
			setPassword(singleResource.resource_password);
			setResourceID(singleResource.id);
			setIsModalOpen(true);
		} catch (err: any) {
			setErrorToast(err.response.data.message);
		}
	};

	const deleteResource = async (id: string) => {
		try {
			await axios.delete(`http://127.0.0.1:8000/api/secrets/${id}`);
			mutate("http://127.0.0.1:8000/api/secrets");
			setResourceID(null);
			setSuccessToast("Resource deleted successfully");
		} catch (err: any) {
			setResourceID(null);
			setErrorToast("Error deleting resource");
		}
	};

	const updateResource = async () => {
		if (resource.trim() === "") return setResourceError(true);
		else if (username.trim() === "") return setUsernameError(true);
		else if (password.trim() === "") return setPasswordError(true);
		else {
			clearErorrs();
			setLoading(true);
			if (resourceID) {
				try {
					await axios.put(`http://127.0.0.1:8000/api/secrets/${resourceID}`, {
						resource_link: resource,
						resource_username: username,
						resource_password: password,
					});
					mutate("http://127.0.0.1:8000/api/secrets");
					setLoading(false);
					setIsModalOpen(false);
					setResourceID(null);
					setSuccessToast("Resource updated successfully");
				} catch (err: any) {
					setLoading(false);
					setIsModalOpen(false);
					setResourceID(null);
					setErrorToast("Error updating resource");
				}
			} else {
				try {
					await axios.post(`http://127.0.0.1:8000/api/secrets`, {
						resource_link: resource,
						resource_username: username,
						resource_password: password,
					});
					mutate("http://127.0.0.1:8000/api/secrets");
					setLoading(false);
					setIsModalOpen(false);
					setResourceID(null);
					setSuccessToast("Resource created successfully");
				} catch (err: any) {
					setLoading(false);
					setIsModalOpen(false);
					setResourceID(null);
					setErrorToast("Error creating resource");
				}
			}
		}
	};

	useEffect(() => {
		setDefaults();
	}, []);

	useEffect(() => {
		if (successToast) {
			setTimeout(() => setSuccessToast(null), 2000);
		}
	}, [successToast]);

	useEffect(() => {
		if (errorToast) {
			setTimeout(() => setErrorToast(null), 2000);
		}
	}, [errorToast]);

	return (
		<div className="bg-gray-100">
			{isModalOpen && (
				<div
					className="fixed z-10 inset-0 overflow-y-auto"
					aria-labelledby="modal-title"
					role="dialog"
					aria-modal="true"
				>
					<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-36 text-center sm:block sm:p-0">
						<div
							className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
							aria-hidden="true"
							onClick={() => closeModal()}
						></div>

						<span
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true"
						>
							&#8203;
						</span>

						<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full p-2">
							<div className="bg-white px-4 pt-5 pb-4">
								<div className="sm:flex sm:items-start">
									<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
										<svg
											className="h-6 w-6 fill-blue-600"
											version="1.1"
											id="Layer_1"
											x="0px"
											y="0px"
											viewBox="0 0 470 470"
										>
											<g>
												<path d="M162.5,139.546V102.5c0-39.977,32.523-72.5,72.5-72.5s72.5,32.523,72.5,72.5v37.046c0.164,0.069,0.329,0.132,0.493,0.201   c10.347,4.376,20.196,9.637,29.507,15.724V102.5C337.5,45.981,291.519,0,235,0S132.5,45.981,132.5,102.5v52.97   c9.311-6.086,19.161-11.347,29.507-15.724C162.171,139.678,162.336,139.615,162.5,139.546z" />
												<path d="M235,155c-86.985,0-157.5,70.515-157.5,157.5S148.015,470,235,470s157.5-70.515,157.5-157.5S321.985,155,235,155z    M250,320.558v53.557h-30v-53.557c-11.824-5.618-20-17.666-20-31.627c0-19.33,15.67-35,35-35s35,15.67,35,35   C270,302.892,261.824,314.941,250,320.558z" />
											</g>
										</svg>
									</div>
									<div className="mt-3 sm:mt-0 sm:ml-4">
										<h3
											className="text-lg leading-6 font-medium text-gray-900 text-center"
											id="modal-title"
										>
											{resourceID ? "Update Resource" : "Create New Resource"}
										</h3>
										<div className="mt-5">
											<form>
												<div className="mb-5">
													<label
														htmlFor="resource"
														className="block text-sm font-medium text-gray-700"
													>
														Resource Name (Site)
													</label>
													<input
														onChange={(e) => setResource(e.target.value)}
														type="text"
														name="resource"
														id="resource"
														autoComplete="given-name"
														value={resource}
														className={`mt-1 p-1 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
															resourceError && "ring-red-500 border-red-500"
														}`}
													/>
													{resourceError && (
														<small className="text-red-500">
															Resource field is required
														</small>
													)}
												</div>
												<div className="mb-5">
													<label
														htmlFor="uername"
														className="block text-sm font-medium text-gray-700"
													>
														Resource Username
													</label>
													<input
														onChange={(e) => setUsername(e.target.value)}
														type="text"
														name="uername"
														id="uername"
														autoComplete="given-name"
														value={username}
														className={`mt-1 p-1 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
															usernameError && "ring-red-500 border-red-500"
														}`}
													/>
													{usernameError && (
														<small className="text-red-500">
															Username field is required
														</small>
													)}
												</div>
												<div>
													<label
														htmlFor="password"
														className="block text-sm font-medium text-gray-700"
													>
														{}
													</label>
													<div className="flex items-center">
														<input
															onChange={(e) => setPassword(e.target.value)}
															type={isPasswordHidden ? "password" : "text"}
															name="password"
															id="password"
															autoComplete="given-name"
															value={password}
															className={`mt-1 p-1 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-l-md ${
																passwordError && "ring-red-500 border-red-500"
															}`}
														/>
														<span
															className="border focus:ring-indigo-500 focus:border-indigo-500 block py-1 mt-1 border-gray-300 rounded-r-md w-10 px-2 bg-gray-200 text-center cursor-pointer"
															onClick={() =>
																setIsPasswordHidden(!isPasswordHidden)
															}
														>
															<svg
																className="w-5 h-6 fill-blue-800"
																version="1.1"
																id="Capa_1"
																x="0px"
																y="0px"
																viewBox="0 0 299.124 299.124"
															>
																<g>
																	<path d="M296.655,142.104c-2.659-3.576-66.046-87.574-147.093-87.574c-81.048,0-144.434,83.998-147.093,87.574   c-3.292,4.427-3.292,10.489,0,14.916c2.659,3.576,66.045,87.573,147.093,87.573c81.047,0,144.434-83.997,147.093-87.573   C299.947,152.594,299.947,146.531,296.655,142.104z M149.562,199.616c-27.6,0-50.054-22.454-50.054-50.054   c0-27.601,22.454-50.055,50.054-50.055c27.601,0,50.055,22.454,50.055,50.055C199.617,177.162,177.162,199.616,149.562,199.616z" />
																	<circle
																		cx="149.562"
																		cy="149.562"
																		r="21.261"
																	/>
																</g>
															</svg>
														</span>
													</div>
													{passwordError && (
														<small className="text-red-500">
															Password field is required
														</small>
													)}
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
							<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
								<button
									type="button"
									onClick={() => updateResource()}
									className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
								>
									Save {loading && "..."}
								</button>
								<button
									onClick={() => closeModal()}
									type="button"
									className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			<Header />
			<div className="p-2 bg-white flex items-center justify-between border-b fixed w-full">
				<button
					className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					onClick={() => addNewResource()}
				>
					Add new resource
				</button>
			</div>
			<div className="flex flex-col mt-20">
				<h2 className="text-2xl mb-4 font-bold text-blue-900 truncate text-center">
					Resources List
				</h2>
				{resourceData && (
					<div className="-my-2 overflow-x-auto">
						<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
							<div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr className="">
											<th
												scope="col"
												className="pl-4 py-3 text-left text-xs font-medium text-gray-500 truncate"
											>
												Site
											</th>
											<th
												scope="col"
												className="py-3 text-left text-xs font-medium text-gray-500 truncate"
											>
												Username
											</th>
											<th
												scope="col"
												className="py-3 text-left text-xs font-medium text-gray-500 truncate"
											></th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{resourceData.map((item: IResourceItem) => {
											return (
												<tr key={item.id}>
													<td className="pl-2 py-4 whitespace-nowrap">
														<div className="flex items-center">
															<div className="ml-2">
																<div className="text-sm font-medium text-gray-900">
																	{item.resource_link}
																</div>
															</div>
														</div>
													</td>
													<td className="py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">
															{item.resource_username}
														</div>
													</td>
													<td className="py-4 whitespace-nowrap flex justify-between">
														<div
															className="text-sm text-blue-800 font-semibold cursor-pointer"
															onClick={() => setUpdateResource(item.id)}
														>
															Edit
														</div>
														<div
															className="text-sm text-red-100 font-semibold cursor-pointer mr-4 px-2 flex items-center justify-center rounded-full bg-red-800"
															onClick={() => deleteResource(item.id)}
														>
															x
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}
			</div>
			{successToast && (
				<div className="w-full h-10 bg-blue-100 text-blue-800 p-2 text-center absolute bottom-0 z-20">
					{successToast}
				</div>
			)}
			{errorToast && (
				<div className="w-full h-10 bg-red-100 text-red-800 p-2 text-center absolute bottom-0 z-20">
					{errorToast}
				</div>
			)}
		</div>
	);
};

export default Home;
