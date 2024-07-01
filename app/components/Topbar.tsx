import { FunctionComponent, ReactElement } from "react";
import CustomImage from "./ui/image";
import images from "@/public/images";
import Button from "./ui/button";

interface TopbarProps {

}

const Topbar: FunctionComponent<TopbarProps> = (): ReactElement => {
    return (
        <header className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-3">
                <span className="w-14 h-14 rounded-full overflow-hidden relative border-4 border-orange-400">
                    <CustomImage src={images.avatar} alt="User" />
                </span>
                <h3 className="text-xl font-semibold text-white">simlex_x</h3>
            </div>
            <div>
                <Button className="bg-orange-500 text-sm !font-semibold">Refer friends</Button>
            </div>
        </header>
    );
}

export default Topbar;