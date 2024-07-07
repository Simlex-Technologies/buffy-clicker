import { Task } from "../enums/ITask";

export interface PointsUpdateRequest {
    username: string;
    points: number;
    task?: Task
}