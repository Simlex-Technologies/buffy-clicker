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

    const { userProfileInformation, fetchUserProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;

    // const params = useSearchParams();
    // const userId = params.get('id');
    // const userName = params.get('userName');

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
        if(taps === 0) return;

        const timer = setTimeout(() => {
            handleUpdateUserPoints();
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(timer);
        };
    }, [taps]);

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
                    onClick={() => setTaps(taps + 1)}
                    whileTap={{
                        // scale: 1.1,
                        filter: "brightness(1.25)",
                        transition: { duration: 0.1 }
                    }}
                    className="w-60 h-60 relative">
                    <CustomImage src={images.clicker} alt="Durov" />
                </motion.span>
            </div>

            <div className="flex flex-row items-center text-white">
                <p className="text-slate-400">Referral points:</p>&nbsp;
                <span className="text-xl">0</span>
            </div>
        </main>
    );
}

export default Homepage;