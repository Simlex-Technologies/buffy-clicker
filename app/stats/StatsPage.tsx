"use client"
import { FunctionComponent, ReactElement, useState, useEffect } from "react";
import CustomImage from "../components/ui/image";
import images from "@/public/images";
import { useFetchLeaderboard } from "../api/apiClient";
import { metrics } from "../constants/userMetrics";

interface StatsPageProps {

}

interface LeaderboardData {
    username: string;
    points: number;
}

const StatsPage: FunctionComponent<StatsPageProps> = (): ReactElement => {

    const fetchLeaderboard = useFetchLeaderboard();

    const [leaderboard, setLeaderboard] = useState<LeaderboardData[]>();

    async function handleFetchLeaderboard() {
        await fetchLeaderboard()
            .then((response) => {
                console.log("🚀 ~ .then ~ response:", response)
                setLeaderboard(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        handleFetchLeaderboard();
    }, [])


    return (
        <main className="flex min-h-screen flex-col items-center py-20">
            <h2 className="text-white font-medium text-3xl">Leaderboard</h2>

            {
                leaderboard &&
                <div className="mt-6 w-full rounded-md overflow-hidden">
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="text-gray-500 bg-white p-2 text-left">Rank</th>
                                <th className="text-gray-500 bg-white p-2 text-left">Username</th>
                                <th className="text-gray-500 bg-white p-2 text-left">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                leaderboard?.map((user, index) => (
                                    <tr key={index}>
                                        <td className="text-white p-2">{index + 1}</td> 
                                        <td className="text-white p-2 flex items-baseline gap-2">@{user.username} <span className="text-xs text-yellow-400 font-medium">{metrics(Number(user.points))?.status}</span></td>
                                        <td className="text-white p-2 font-semibold">{user.points}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            }

            {/* <div className="my-8">
                <span className="w-56 h-56 relative block mb-3">
                    <CustomImage src={images.splash} alt="Buffy" />
                </span>
                <h4 className="text-white font-normal text-xl text-center">Coming Soon</h4>
            </div> */}
        </main>
    );
}

export default StatsPage;