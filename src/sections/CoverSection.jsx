import { forwardRef } from "react";
import frame from "../assets/frame.png";
import flower from "../assets/flower.png";
import blueFlower from "../assets/blue-flower.png";
import whiteFlower from "../assets/white-flower.png";
import pinkFlower from "../assets/pink-flower.png";
import topRight from "../assets/top-right.png";
import botLeft from "../assets/bot-left.png";

export const CoverSection = forwardRef((_, ref) => (
	<section
		ref={ref}
		className="relative flex items-center justify-center bg-[#fcf0f0] overflow-hidden"
		style={{ minHeight: "100dvh" }}
	>
		<img
			src={frame}
			alt="Frame"
			className="w-[90%] h-auto md:w-[80%] lg:w-[70%] mx-auto -mt-[15%] md:-mt-[20%]"
		/>

		{/* Corner pieces — slow drift */}
		<img
			src={topRight}
			alt=""
			className="px-slow absolute top-0 right-0 w-40 md:w-48"
		/>
		<img
			src={botLeft}
			alt=""
			className="px-slow absolute bottom-0 left-0 w-40 md:w-48 pb-[60px]"
		/>

		{/* Accent flowers — mid drift */}
		<img
			src={flower}
			alt=""
			className="px-mid absolute top-0 left-0 w-24 md:w-32"
		/>
		<img
			src={whiteFlower}
			alt=""
			className="px-mid absolute bottom-0 right-0 w-24 md:w-32 pb-[60px]"
		/>

		{/* Side flowers — fast drift, feel closest */}
		<img
			src={blueFlower}
			alt=""
			className="px-fast absolute top-1/2 left-0 w-20 md:w-28 -translate-y-1/2"
		/>
		<img
			src={pinkFlower}
			alt=""
			className="px-fast absolute top-1/2 right-0 w-20 md:w-28 -translate-y-1/2"
		/>

		<div className="px-slow absolute inset-0 flex flex-col items-center justify-center text-center">
			<p className="text-sm mb-5 text-primary tracking-wider">
				THE WEDDING OF
			</p>
			<h1 className="font-im-fell-english-regular-italic text-6xl mt-2 text-secondary">
				Azim
			</h1>
			<h1 className="font-im-fell-english-regular-italic text-6xl mt-2 mb-2 text-secondary">
				& Nia
			</h1>
			<p className="text-md text-third mt-5 tracking-wider">
				Fourth of July,
			</p>
			<p className="text-md text-third mb-5 tracking-wider">
				Twenty Twenty-Six
			</p>
			<p className="text-sm text-primary tracking-wider">
				Taiping, Perak
			</p>
		</div>

	</section>
));
