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
import { useCreateUser, useFetchUserInformation } from "../api/apiClient";

interface LayoutProps {
    children?: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }): ReactElement => {

    const createUser = useCreateUser();

    const { userProfileInformation, fetchUserProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;
    const [loaderIsVisible, setLoaderIsVisible] = useState(true);

    const iswindow = typeof window !== 'undefined' ? true : false;

    const params = useSearchParams();
    const userId = params.get('id');
    const userName = params.get('userName');

    async function handleCreateUser(userInfo: UserProfileInformation) {
        await createUser(userInfo)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && userProfileInformation) {
            // Set a timeout to hide the loader after 5 seconds
            const timeout = setTimeout(() => {
                setLoaderIsVisible(false);
            }, 3000);

            // Cleanup function to clear the timeout if the component unmounts or dependencies change
            return () => clearTimeout(timeout);
        }
    }, [iswindow, userProfileInformation]);

    useMemo(() => {
        if (userId && userName) {

            // construct user information
            const userInfo: UserProfileInformation = {
                id: userId,
                userId: Number(userId),
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
    }, [userId, userName]);

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