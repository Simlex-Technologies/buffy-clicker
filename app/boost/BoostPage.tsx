"use client"
import { FunctionComponent, ReactElement, useContext } from "react";
import CustomImage from "../components/ui/image";
import images from "@/public/images";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { metrics } from "../constants/userMetrics";

interface BoostPageProps {

}

const BoostPage: FunctionComponent<BoostPageProps> = (): ReactElement => {

    const { userProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;

    const points = userProfileInformation?.points;

    return (
        <main className="flex min-h-screen flex-col items-center py-14">
            {/* <h2 className="text-white font-medium text-3xl">Boost Points</h2> */}

            {
                points &&
                <div className="flex flex-col items-center gap-2 mb-6">
                    <p className="text-gray-300 text-xs">Available balance</p>
                    <div className="flex items-center gap-1">
                        <span className="w-7 h-7 relative grid place-items-center">
                            <CustomImage src={images.coin} alt="Coin" />
                        </span>
                        <h1 className=" font-black text-3xl text-white">{(points).toLocaleString()}{metrics(points)?.pointSuffix}</h1>
                    </div>
                </div>
            }

            <div className="w-full flex flex-col gap-2 mb-10">
                <span className="font-bold text-white text-sm">Daily boosters (Free)</span>
                <button className="bg-gray-700 rounded-3xl flex flex-row items-end justify-between p-4 pr-5 hover:bg-gray-600">
                    <div className="flex flex-row items-center gap-3">
                        <span className="w-7 h-7 relative grid place-items-center">
                            <CustomImage src={images.coin} alt="Coin" />
                        </span>
                        <div className="flex flex-col gap-[2px] items-start">
                            <h5 className="text-white font-medium leading-3 text-base">Full energy</h5>
                            <p className="text-white/60 text-sm">5/6 available</p>
                        </div>
                    </div>
                    <p className="text-white/50 text-sm">50 minutes left</p>
                </button>
            </div>

            <div className="w-full flex flex-col gap-2">
                <span className="font-bold text-white text-sm">Boosters</span>
                <button className="bg-gray-700 rounded-3xl flex flex-row items-end justify-between p-4 pr-5 hover:bg-gray-600">
                    <div className="flex flex-row items-center gap-3">
                        <span className="w-7 h-7 relative grid place-items-center">
                            <CustomImage src={images.coin} alt="Coin" />
                        </span>
                        <div className="flex flex-col gap-[2px] items-start">
                            <h5 className="text-white font-medium leading-3 text-base">Multitap</h5>
                            <p className="text-white/60 text-sm">2k points for 2lvl</p>
                        </div>
                    </div>
                    {/* <p className="text-white/50 text-sm">50 minutes left</p> */}
                </button>
            </div>

            {/* <div className="my-8">
                <span className="w-56 h-56 relative block mb-3">
                    <CustomImage src={images.splash} alt="Buffy" />
                </span>
                <h4 className="text-white font-normal text-xl text-center">Coming Soon</h4>
            </div> */}
        </main>
    );
}

export default BoostPage;