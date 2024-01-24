export interface FileInfo {
    name: string;
    size: string;
    file_type: string;
    thumbnail_url: string;
}

export interface ProjectInfo {
    project_id: string;
    slug: string;
    name: string;
    created_at: string;
    last_edited: string;
    size: string;
    onDelete: (slug: string) => void;
}

export interface funcProp {
    func: (data: string) => void;
}

export interface TranscriptWordInfo {
    id: number;
    start: number;
    end: number;
    text: string;
}

export interface TimeStampInfo {
    id: number;
    start: number;
    end: number;
}

export interface removeNavBarFuncProp{
    removeNavBar: () => void;
}

export interface OptionsInfo {
    chosen: string;
    optionType: string;
    handleChange: () => void;
}

export interface NavbarProps {
    title: string;
}