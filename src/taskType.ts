export type TaskType = {
    id : number;
    title : string;
    description? : string;
    done : boolean;
    createdAt: number;
    updatedAt: number;
}