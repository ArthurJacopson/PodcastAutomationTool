export interface FileInfo {
    slug: string;
    name: string;
    date: string;
    size: number;
}


export interface funcProp {
    func: (data: string) => void;
}
