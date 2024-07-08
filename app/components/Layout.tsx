"use client"
import { FunctionComponent, ReactElement, ReactNode, useState, useEffect, useContext, useMemo } from "react";
import CustomImage from "./ui/image";
import images from "@/public/images";
import { motion } from "framer-motion";
import Topbar from "./Topbar";
import BottomBar from "./BottomBar";
import NextTopLoader from "nextjs-toploader";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { useSearchParams } from "next/navigation";
import { UserProfileInformation } from "../models/IUser";
import { StorageKeys } from "../constants/storageKeys";
import { splashScreenVariant } from "../animations/splashScreen";
import { useCreateReferral, useCreateUser, useFetchUserInformation } from "../api/apiClient";
import { ReferralCreationRequest } from "../models/IReferral";
import { sessionLimit } from "../constants/user";

interface LayoutProps {
    children?: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }): ReactElement => {

    const createUser = useCreateUser();
    const createReferral = useCreateReferral();

    const {
        userProfileInformation, fetchUserProfileInformation, updateNextUpdateTimestamp, timesClickedPerSession,
        nextUpdateTimestamp, updateTimeLeft: setTimeLeft, timeLeft, updateTimesClickedPerSession,
    } = useContext(ApplicationContext) as ApplicationContextData;

    const [loaderIsVisible, setLoaderIsVisible] = useState(true);
    const [isReferralCreated, setIsReferralCreated] = useState(false);
    const [isBoostTimeRetrieved, setIsBoostTimeRetrieved] = useState(false);

    const iswindow = typeof window !== 'undefined' ? true : false;

    const params = useSearchParams();
    const userId = params.get('id');
    const userName = params.get('userName');
    const referralId = params.get('referralId');

    async function handleCreateUser(userInfo: UserProfileInformation) {
        await createUser(userInfo)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    async function handleCreateReferral(username: string, referrerId: string) {

        const data: ReferralCreationRequest = {
            username,
            referrerId
        };

        await createReferral(data)
            .then((response) => {
                console.log("Referral created", response);
                setIsReferralCreated(true);
            })
            .catch((error) => {
                console.error("Error creating referral", error);
            });
    };

    // const DEBOUNCE_DELAY_FOR_SESSION = 32400; // Delay for 3 clicks for 3hrs
    const DEBOUNCE_DELAY_FOR_SESSION = 10800; // Delay for 1 click for 3hrs

    useEffect(() => {
        // Load the end time from localStorage when the component mounts
        const storedBoostRefillEndTime = localStorage.getItem(StorageKeys.BoostRefillEndTime(userProfileInformation?.username as string));

        if (storedBoostRefillEndTime) {
            const endTime = new Date(storedBoostRefillEndTime).getTime();
            const now = Date.now();
            const remainingTime = endTime - now;

            if (remainingTime > 0) {
                const remainingTicks = Math.ceil(remainingTime / DEBOUNCE_DELAY_FOR_SESSION);
                updateTimesClickedPerSession(remainingTicks);
                console.log("🚀 ~ useEffect ~ remainingTicks:", remainingTicks)
            } else {
                updateTimesClickedPerSession(0);
            }
        };

        // update retrieval status
        setIsBoostTimeRetrieved(true);
    }, [])

    // Use a hook to update the timesClickedPerSession back to zero after the user has stopped clicking. Decrement the timesclickedpersession by 3 till the limit is reached
    useEffect(() => {
        if(!isBoostTimeRetrieved) return;

        // console.log("🚀 ~ useEffect ~ timesClickedPerSession:", timesClickedPerSession);

        if (sessionLimit - timesClickedPerSession >= sessionLimit || timesClickedPerSession <= 0) {
            // reset the state
            updateTimesClickedPerSession(0);
            return;
        };
        
        // Calculate the end time and store it
        const remainingTicks = timesClickedPerSession;
        const endTime = new Date(Date.now() + remainingTicks * DEBOUNCE_DELAY_FOR_SESSION);
        localStorage.setItem(StorageKeys.BoostRefillEndTime(userProfileInformation?.username as string), endTime.toString());
        
        // Calculate the remaining time
        // const remainingTime = remainingTicks * DEBOUNCE_DELAY_FOR_SESSION;

        let timer: NodeJS.Timeout;

        if (timesClickedPerSession > 0) {
            timer = setTimeout(() => {
                // Decrement the timesClickedPerSession by 3
                updateTimesClickedPerSession(timesClickedPerSession - 1);
            }, DEBOUNCE_DELAY_FOR_SESSION);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [timesClickedPerSession, isBoostTimeRetrieved]);

    useEffect(() => {
        if (typeof window !== 'undefined' && userProfileInformation) {
            setLoaderIsVisible(false);
            // Set a timeout to hide the loader after 5 seconds
            // const timeout = setTimeout(() => {
            // }, 3000); 

            // Cleanup function to clear the timeout if the component unmounts or dependencies change
            // return () => clearTimeout(timeout);
        }
    }, [iswindow, userProfileInformation]);

    // Effect to start the countdown timer for the next boost update
    useEffect(() => {
        if (!nextUpdateTimestamp) return;

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = nextUpdateTimestamp - now;

            if (distance < 0) {
                setTimeLeft('00:00:00');
                updateNextUpdateTimestamp(0);
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        };

        // Update the countdown every second
        const interval = setInterval(updateCountdown, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [nextUpdateTimestamp]);

    useEffect(() => {
        if (timeLeft === '00:00:00') {
            // reset the times clicked per session to 0 so that the user can click again
            updateTimesClickedPerSession(0);
        }
    }, [timeLeft]);

    useMemo(() => {
        if (!iswindow) return;

        if (userId && userName) {

            // construct user information
            const userInfo: UserProfileInformation = {
                id: userId,
                userId: Number(userId),
                dailyFreeBoosters: 6,
                telegramTaskDone: false,
                twitterTaskDone: false,
                level: 1,
                username: userName
            };

            handleCreateUser(userInfo);

            // save to session storage
            sessionStorage.setItem(StorageKeys.UserInformation, JSON.stringify(userInfo));
        }

        const userProfileInformation = sessionStorage.getItem(StorageKeys.UserInformation);

        if (userProfileInformation) {
            fetchUserProfileInformation();
        }
    }, [userId, userName, iswindow]);

    useMemo(() => {
        if (referralId && userProfileInformation && !isReferralCreated) {
            console.log("Calling referral creation")
            handleCreateReferral(userProfileInformation.username, referralId);
        }
    }, [referralId, userProfileInformation]);

    return (
        <motion.div
            initial="opened"
            animate={loaderIsVisible ? "opened" : "closed"}
        >
            <NextTopLoader
                color="#ffffff"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #f1fa9e,0 0 5px #ceb0fa"
            />

            {!loaderIsVisible && (
                <>
                    <Topbar />
                    {children}
                    <BottomBar />
                </>
            )}

            <motion.div
                variants={splashScreenVariant}
                className='w-[100vw] h-[100vh] fixed top-0 left-0 z-30 min-h-[100vh] grid place-items-center bg-white pointer-events-none'>
                <div className='w-60 h-60 animate-pulse transition-all duration-150 ease-in-out object-contain relative'>
                    <CustomImage src={images.splash} alt='logo' />
                </div>
            </motion.div>
        </motion.div>
    );
}

export default Layout;