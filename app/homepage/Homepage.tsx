"use client"
import { ReactElement, FunctionComponent, useState } from "react"
import images from "@/public/images";
import { motion } from "framer-motion"
import CustomImage from "../components/ui/image";
import { Icons } from "../components/ui/icons";
import { useSearchParams } from "next/navigation";

interface HomepageProps {

}

const Homepage: FunctionComponent<HomepageProps> = (): ReactElement => {

    const params = useSearchParams();
    const userId = params.get('id');
    const userName = params.get('userName');

    const [taps, setTaps] = useState(0);

    return (
        <main className="flex min-h-screen flex-col items-center py-20">
            <div className="flex flex-col items-center mb-12">
                <div className="flex flex-row gap-2 items-center">
                    <span className="w-7 h-7 relative grid place-items-center">
                        <CustomImage src={images.coin} alt="Coin" />
                    </span>
                    <h1 className="text-[40px] text-white font-extrabold">{(taps).toLocaleString()}&nbsp;M</h1>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <span className="w-6 h-6 grid place-items-center">
                        <Icons.Trophy className="opacity-40" />
                    </span>
                    <p className="text-white/60 text-sm">Noob</p>
                </div>
            </div>

            <div className="flex relative">
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
        </main>
    );
}

export default Homepage;