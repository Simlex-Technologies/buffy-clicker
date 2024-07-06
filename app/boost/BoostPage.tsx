"use client"
import { FunctionComponent, ReactElement, useContext, useState, useEffect, useMemo } from "react";
import CustomImage from "../components/ui/image";
import images from "@/public/images";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { metrics } from "../constants/userMetrics";
import { useUpdateDailyBoosts } from "../api/apiClient";
import { StorageKeys } from "../constants/storageKeys";

interface BoostPageProps {

}

const BoostPage: FunctionComponent<BoostPageProps> = (): ReactElement => {

    const updateDailyBoosts = useUpdateDailyBoosts();

    const {
        userProfileInformation, fetchUserProfileInformation,
        nextUpdateTimestamp, updateNextUpdateTimestamp,
        timeLeft, updateTimeLeft: setTimeLeft
    } = useContext(ApplicationContext) as ApplicationContextData;

    const points = userProfileInformation?.points;

    const [isRequestingBoosts, setIsRequestingBoosts] = useState(false);

    async function handleUpdateDailyBoosts({ fetchOnly = false }: { fetchOnly: boolean }) {
        if (timeLeft !== '00:00:00' && timeLeft !== '') return;

        if (!fetchOnly) setIsRequestingBoosts(true);

        await updateDailyBoosts(userProfileInformation?.username as string, fetchOnly ? "fetch" : "update")
            .then((response) => {

                fetchUserProfileInformation();

                if (!fetchOnly) {
                    // save the next update timestamp to the state & session storage
                    if (response.data?.data.dailyFreeBoosters !== 0) {
                        const nextUpdate = new Date();
                        nextUpdate.setMinutes(nextUpdate.getMinutes() + 1);
                        updateNextUpdateTimestamp(nextUpdate.getTime());
                        // console.log("🚀 ~ handleUpdateDailyBoosts ~ nextUpdate", nextUpdate.getTime().toString());
                        sessionStorage.setItem(StorageKeys.BoostersNextTimeUpdate, nextUpdate.getTime().toString());
                        // console.log("🚀 ~ handleUpdateDailyBoosts ~ sessionStorage updated");
                    }
                };
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsRequestingBoosts(false);
            });
    };

    function requestDailyBoosts() {
        if(isRequestingBoosts) return;

        const boosterExpirationDate = userProfileInformation?.dailyBoostersExp;
        const freeBoosters = userProfileInformation?.dailyFreeBoosters;

        // console.log("🚀 ~ requestDailyBoosts ~ boosterExpirationDate:", boosterExpirationDate)
        // console.log("🚀 ~ requestDailyBoosts ~ freeBoosters:", freeBoosters)
        // console.log(freeBoosters && boosterExpirationDate && boosterExpirationDate.getTime() > Date.now() && freeBoosters == 0);

        if (freeBoosters && boosterExpirationDate && boosterExpirationDate.getTime() > Date.now() && freeBoosters == 0) {
            console.log("You can't request daily boosts yet");
            return;
        }

        handleUpdateDailyBoosts({ fetchOnly: false });
    };

    // Effect to start the countdown timer
    // useEffect(() => {
    //     if (!nextUpdateTimestamp) return;

    //     const updateCountdown = () => {
    //         const now = new Date().getTime();
    //         const distance = nextUpdateTimestamp - now;

    //         if (distance < 0) {
    //             setTimeLeft('00:00:00');
    //             return;
    //         }

    //         const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //         const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    //         const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    //         setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    //     };

    //     // Update the countdown every second
    //     const interval = setInterval(updateCountdown, 1000);

    //     // Cleanup interval on component unmount
    //     return () => clearInterval(interval);
    // }, [nextUpdateTimestamp]);

    const timeLeftIsValid = timeLeft && timeLeft !== '00:00:00';

    useEffect(() => {
        handleUpdateDailyBoosts({ fetchOnly: true });
    }, []);

    useMemo(() => {
        // Get the time left from session storage
        const timeLeftFromStorage = sessionStorage.getItem(StorageKeys.BoostersNextTimeUpdate);

        // Set the time left to the state
        if (timeLeftFromStorage && timeLeftFromStorage !== 'NaN') {
            updateNextUpdateTimestamp(Number(timeLeftFromStorage));
        }
    }, []);


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
                <button
                    onClick={() => requestDailyBoosts()}
                    className={`bg-gray-700 rounded-3xl flex flex-row items-end justify-between p-4 pr-5 hover:bg-gray-600 ${timeLeftIsValid || isRequestingBoosts ? "pointer-events-none opacity-70" : ""}`}>
                    <div className="flex flex-row items-center gap-3">
                        <span className="w-7 h-7 relative grid place-items-center">
                            <CustomImage src={images.coin} alt="Coin" />
                        </span>
                        <div className="flex flex-col gap-[2px] items-start">
                            <h5 className="text-white font-medium leading-3 text-base">Full energy</h5>
                            <p className="text-white/60 text-sm">{userProfileInformation?.dailyFreeBoosters}/6 available</p>
                        </div>
                    </div>
                    {
                        timeLeftIsValid &&
                        <p className="text-white/50 text-sm">
                            Time left: {timeLeft}
                        </p>
                    }
                </button>
            </div>

            <div className="w-full flex flex-col gap-2">
                <span className="font-bold text-white text-sm">Boosters</span>
                <button className="bg-gray-700 rounded-3xl flex flex-row items-end justify-between p-4 pr-5 hover:bg-gray-600">
                    <div className="flex flex-row items-center gap-3">
                        <span className="w-7 h-7 relative grid place-items-center">
                            <CustomImage src={images.coin} alt="Coin" className="grayscale" />
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