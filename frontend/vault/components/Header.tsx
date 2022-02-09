import Link from "next/link";

const Header = () => {
	return (
		<>
			<nav className="bg-blue-600">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="relative flex items-center justify-between h-16">
						<div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
							<div className="">
								<div className="flex space-x-4">
									<Link href="/">
										<a
											className="text-blue-50 bg-blue-900 hover:text-white px-20 py-2 rounded-md text-lg font-bold flex items-center"
											aria-current="page"
										>
											<svg
												className="h-4 w-4 fill-blue-50 mr-2"
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
											Vault
										</a>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Header;
