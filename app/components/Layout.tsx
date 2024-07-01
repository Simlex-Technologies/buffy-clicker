"use client"
import { FunctionComponent, ReactElement, ReactNode, useState, useEffect } from "react";
import CustomImage from "./ui/image";
import images from "@/public/images";
import { motion } from "framer-motion";
import Topbar from "./Topbar";
import BottomBar from "./BottomBar";

interface LayoutProps {
    children?: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }): ReactElement => {

    const [loaderIsVisible, setLoaderIsVisible] = useState(true);
    const iswindow = typeof window !== 'undefined' ? true : false;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Set a timeout to hide the loader after 5 seconds
            const timeout = setTimeout(() => {
                setLoaderIsVisible(false);
            }, 4000);

            // Cleanup function to clear the timeout if the component unmounts or dependencies change
            return () => clearTimeout(timeout);
        }
    }, [iswindow]);

    const splashScreenVariant = {
        opened: {
            opacity: 1,
            height: "100vh",
            transition: {
              duration: 0.25,
              ease: "easeOut",
            },
          },
          closed: {
            opacity: 0,
            height: "auto",
            transition: {
              duration: 0.25,
              ease: "easeInOut",
            },
          },
    }

    return (
        <motion.div
            initial="opened"
            animate={loaderIsVisible ? "opened" : "closed"}
        >
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