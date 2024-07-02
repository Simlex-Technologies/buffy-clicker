import { FunctionComponent, ReactElement } from "react";
import CustomImage from "../components/ui/image";
import images from "@/public/images";

interface TaskPageProps {

}

const TaskPage: FunctionComponent<TaskPageProps> = (): ReactElement => {
    return (
        <main className="flex min-h-screen flex-col items-center py-20">
            <h2 className="text-white font-medium text-3xl">Tasks</h2>

            <div className="my-8">
                <span className="w-56 h-56 relative block mb-3">
                    <CustomImage src={images.splash} alt="Buffy" />
                </span>
                <h4 className="text-white font-normal text-xl text-center">Coming Soon</h4>
            </div>
        </main>
    );
}

export default TaskPage;