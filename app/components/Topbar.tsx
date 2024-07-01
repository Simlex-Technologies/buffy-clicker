import { FunctionComponent, ReactElement } from "react";
import CustomImage from "./ui/image";
import images from "@/public/images";
import Button from "./ui/button";
import { useSearchParams } from "next/navigation";

interface TopbarProps {

}

const Topbar: FunctionComponent<TopbarProps> = (): ReactElement => {

    const params = useSearchParams();
    const userId = params.get('id');
    const userName = params.get('userName');

    return (
        <header className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-3">
                <span className="w-14 h-14 rounded-full overflow-hidden relative border-4 border-orange-400">
                    {/* <CustomImage src={images.avatar} alt="User" /> */}
                    {userName && <CustomImage src={`https://placehold.co/300x300/8133F1/FFFFFF/png?text=${userName[0].toUpperCase()}`} alt="User" />}
                </span>
                <h3 className="text-xl font-semibold text-white">{userName}</h3>
            </div>
            <div>
                <Button className="bg-orange-500 text-sm !font-semibold">Refer friends</Button>
            </div>
        </header>
    );
}

export default Topbar;