"use client"
import { FunctionComponent, ReactElement, useContext, useState } from "react";
import CustomImage from "../components/ui/image";
import images from "@/public/images";
import { Icons } from "../components/ui/icons";
import ModalWrapper from "../components/modal/ModalWrapper";
import ComponentLoader from "../components/Loader/ComponentLoader";
import { useUpdateUserPoints } from "../api/apiClient";
import { PointsUpdateRequest } from "../models/IPoints";
import { ApplicationContext, ApplicationContextData } from "../context/ApplicationContext";
import { Task } from "../enums/ITask";

interface TaskPageProps {

}

interface TaskStatusProps {
    status: boolean;
}

const TaskStatus: FunctionComponent<TaskStatusProps> = ({ status }) => {
    return (<p className={`text-sm ${status ? "text-green-300/80" : "text-white/60"}`}>{status ? "Done" : "Not done"}</p>);
}

const TaskPage: FunctionComponent<TaskPageProps> = (): ReactElement => {

    const updateUserPoints = useUpdateUserPoints();
    const { userProfileInformation, fetchUserProfileInformation } = useContext(ApplicationContext) as ApplicationContextData;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(Task.TELEGRAM);

    const [isJoinChannelBtnClicked, setIsJoinChannelBtnClicked] = useState(false);
    const [isFollowUsBtnClicked, setIsFollowUsBtnClicked] = useState(false);

    const [isVerifyingTask, setIsVerifyingTask] = useState(false);

    const telegramPoints = 4000;
    const twitterPoints = 4000;

    async function handleVerifyTask(specifiedTask: Task) {
        // Show loader
        setIsVerifyingTask(true);

        // construct the data 
        const data: PointsUpdateRequest = {
            username: userProfileInformation?.username as string,
            points: specifiedTask === Task.TELEGRAM ? telegramPoints : twitterPoints,
            task: specifiedTask
        };

        await updateUserPoints(data)
            .then(() => {
                fetchUserProfileInformation();

                switch (specifiedTask) {
                    case Task.TELEGRAM:
                        setIsJoinChannelBtnClicked(false);
                        break;
                    case Task.TWITTER:
                        setIsFollowUsBtnClicked(false);
                        break;
                
                    default:
                        break;
                }

                setIsModalVisible(false);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsVerifyingTask(false);
            });
    }

    const taskInfo = [
        {
            icon: (className?: string) => <Icons.Telegram className={className} />,
            task: Task.TELEGRAM,
            title: "Join our telegram channel",
            points: telegramPoints,
            action: "Join",
            isDone: isJoinChannelBtnClicked,
            actionFunction: () => {
                setIsJoinChannelBtnClicked(true)
                window.open("https://t.me/BuffyDurov", "_blank");
            },
            verificationFunction: () => handleVerifyTask(Task.TELEGRAM)
        },
        {
            icon: (className?: string) => <Icons.Twitter className={className} />,
            task: Task.TWITTER,
            title: "Follow us on twitter",
            points: twitterPoints,
            action: "Follow",
            isDone: isFollowUsBtnClicked,
            actionFunction: () => {
                setIsFollowUsBtnClicked(true)
                window.open("https://x.com/buffydurov?s=11", "_blank");
            },
            verificationFunction: () => handleVerifyTask(Task.TWITTER)
        }
    ];

    const selectedTaskInfo = taskInfo.find(task => task.task === selectedTask);

    return (
        <>
            <ModalWrapper
                visibility={isModalVisible}
                setVisibility={setIsModalVisible}>
                <div className="flex flex-col w-[80vw] items-center bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl p-5 pt-6 text-white border-b-[1px] border-orange-400">
                    <span className={"mx-auto mb-3"}>
                        {selectedTaskInfo?.icon(selectedTaskInfo?.task === Task.TWITTER ? "fill-white" : "")}
                    </span>
                    <h3 className="font-semibold text-xl mb-3 text-center">{selectedTaskInfo?.title}</h3>
                    <div className="flex items-center gap-1 mb-4">
                        <span className="relative w-6 h-6">
                            <CustomImage src={images.coin} alt="Coin" />
                        </span>
                        <h5 className="text-xl font-bold">+{selectedTaskInfo?.points.toLocaleString()}</h5>
                    </div>
                    <div className="flex flex-row gap-4 w-full">
                        <button
                            onClick={() => { selectedTaskInfo?.actionFunction() }}
                            className="w-full p-2 rounded-xl bg-blue-500 focus:bg-blue-600">
                            {selectedTaskInfo?.action}
                        </button>
                        <button
                            onClick={() => { selectedTaskInfo?.verificationFunction() }}
                            className={`relative w-full p-2 rounded-xl bg-blue-500 focus:bg-blue-600 ${selectedTaskInfo?.isDone ? "" : " bg-gray-500 pointer-events-none"}`}>
                            {
                                isVerifyingTask ?
                                    <ComponentLoader className="absolute inset-0 m-auto w-5 h-5" /> :
                                    "Check"
                            }
                        </button>
                    </div>
                </div>
            </ModalWrapper>

            <main className="flex min-h-screen flex-col items-center py-14">
                <h2 className="text-white font-medium text-3xl mb-10">Tasks</h2>

                {
                    userProfileInformation &&
                    <div className="w-full flex flex-col gap-3 mb-10">
                        <span className="font-bold text-white text-sm">Social tasks</span>
                        <button
                            onClick={() => {
                                setSelectedTask(Task.TELEGRAM);
                                setIsModalVisible(true);
                            }}
                            className={`bg-gray-700 rounded-3xl flex flex-row items-center justify-between p-4 pr-5 hover:bg-gray-600 ${userProfileInformation.telegramTaskDone ? "pointer-events-none opacity-70" : ""}`}>
                            <div className="flex flex-row items-center gap-3">
                                <span className="w-7 h-7 relative grid place-items-center">
                                    <Icons.Telegram />
                                </span>
                                <div className="flex flex-col gap-[2px] items-start">
                                    <h5 className="text-white font-medium leading-3 text-base">Join telegram channel</h5>
                                    <TaskStatus status={userProfileInformation.telegramTaskDone} />
                                </div>
                            </div>
                            <span className="w-7 h-7 rounded-full bg-white/30 grid place-items-center">
                                {
                                    userProfileInformation.telegramTaskDone ?
                                        <Icons.CheckFill className="fill-white" /> :
                                        <Icons.CloseFill className="fill-white" />
                                }
                            </span>
                        </button>
                        <button
                            onClick={() => {
                                setSelectedTask(Task.TWITTER);
                                setIsModalVisible(true);
                            }}
                            className={`bg-gray-700 rounded-3xl flex flex-row items-center justify-between p-4 pr-5 hover:bg-gray-600 ${userProfileInformation.twitterTaskDone ? "pointer-events-none opacity-70" : ""}`}>
                            <div className="flex flex-row items-center gap-3">
                                <span className="w-7 h-7 relative grid place-items-center">
                                    <Icons.Twitter className="fill-white" />
                                </span>
                                <div className="flex flex-col gap-[2px] items-start">
                                    <h5 className="text-white font-medium leading-3 text-base">Follow us on X</h5>
                                    <TaskStatus status={userProfileInformation.twitterTaskDone} />
                                </div>
                            </div>
                            <span className="w-7 h-7 rounded-full bg-white/30 grid place-items-center">
                                {
                                    userProfileInformation.twitterTaskDone ?
                                        <Icons.CheckFill className="fill-white" /> :
                                        <Icons.CloseFill className="fill-white" />
                                }
                            </span>
                        </button>
                    </div>
                }
            </main>
        </>
    );
}

export default TaskPage;