"use client"
import { ReactElement, FunctionComponent, useState, useContext, useMemo, useEffect } from "react"
import images from "@/public/images";
import { motion } from "framer-motion"
import CustomImage from "../components/ui/image";
import { Icons } from "../components/ui/icons";
// import { useSearchParams } from "next/navigation";
import { metrics } from "../constants/userMetrics";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { useUpdateUserPoints } from "../api/apiClient";
import { PointsUpdateRequest } from "../models/IPoints";

interface HomepageProps {

}

const Homepage: FunctionComponent<HomepageProps> = (): ReactElement => {

    const updateUserPoints = useUpdateUserPoints();

    const {
        userProfileInformation, fetchUserProfileInformation, 
        timesClickedPerSession, updateTimesClickedPerSession: setTimesClickedPerSession
    } = useContext(ApplicationContext) as ApplicationContextData;

    const sessionLimit = 1000;
    // const [timesClickedPerSession, setTimesClickedPerSession] = useState<number>(0);

    const [taps, setTaps] = useState<number>(0);

    async function handleUpdateUserPoints() {

        // construct the data 
        const data: PointsUpdateRequest = {
            username: userProfileInformation?.username as string,
            points: taps
        };

        await updateUserPoints(data)
            .then((response) => {
                // console.log(response);
                fetchUserProfileInformation();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useMemo(() => {
        if (userProfileInformation) {
            setTaps(userProfileInformation.points ?? 0);
        }
    }, [userProfileInformation]);

    const DEBOUNCE_DELAY = 1000; // Adjust the delay as needed

    useEffect(() => {
        if (taps === 0) return;

        const timer = setTimeout(() => {
            handleUpdateUserPoints();
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(timer);
        };
    }, [taps]);

    // Use a hook to update the timesClickedPerSession back to zero after the user has stopped clicking. Decrement the timesclickedpersession by 3 till the limit is reached
    useEffect(() => {
        // const limit = 1000 - timesClickedPerSession;
        // if (limit >= sessionLimit || timesClickedPerSession === 0) {
        //     return;
        // }
        if (sessionLimit - timesClickedPerSession >= sessionLimit) {
            setTimesClickedPerSession(0);
            return;
        };

        const timer = setTimeout(() => {
            // Decrement the timesClickedPerSession by 3
            setTimesClickedPerSession(timesClickedPerSession - 3);
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(timer);
        };
    }, [timesClickedPerSession]);

    return (
        <main className="flex min-h-screen flex-col items-center py-20">
            <div className="flex flex-col items-center mb-12">
                <div className="flex flex-row gap-2 items-center">
                    <span className="w-7 h-7 relative grid place-items-center">
                        <CustomImage src={images.coin} alt="Coin" />
                    </span>
                    <h1 className="text-[40px] text-white font-extrabold">{(taps).toLocaleString()}{metrics(taps)?.pointSuffix}</h1>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <span className="w-6 h-6 grid place-items-center">
                        <Icons.Trophy className="opacity-40" />
                    </span>
                    <p className="text-white/60 text-sm">{metrics(taps)?.status}</p>
                </div>
            </div>

            <div className="flex relative mb-12">
                <motion.span
                    onClick={() => {
                        if(sessionLimit - timesClickedPerSession <= 0) return;
                        
                        setTaps(taps + 1)
                        setTimesClickedPerSession(timesClickedPerSession + 1)
                    }}
                    whileTap={{
                        // scale: 1.1,
                        filter: "brightness(1.25)",
                        transition: { duration: 0.1 }
                    }}
                    className="w-60 h-60 relative">
                    <CustomImage src={images.clicker} alt="Durov" />
                </motion.span>
            </div>

            <div className="flex flex-row items-center text-white mb-5">
                <p className="text-slate-400">Energy level:</p>&nbsp;
                <span className="text-base">{sessionLimit - timesClickedPerSession}/{sessionLimit}</span>
            </div>

            {
                userProfileInformation && userProfileInformation.referralCount &&
                <div className="flex flex-row items-center text-white">
                    <p className="text-slate-400">Referral points:</p>&nbsp;
                    <span className="text-xl">{userProfileInformation.referralCount * 1000}</span>
                </div>
            }
        </main>
    );
}

export default Homepage;