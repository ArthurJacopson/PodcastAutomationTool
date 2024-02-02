import { ChangeEvent, useRef, useState } from "react";
import { FileInfo, UploadSectionInfo } from "../../../Interfaces";
import styles from "./UploadSection.module.css";
import FileComponent from "../../shared/file-comp/FileComponent";

const UploadSection = ({id, name, uploadFile ,fileState}:UploadSectionInfo): JSX.Element => {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const inputFile = useRef<HTMLInputElement>(null);

    const upload = async  (event:ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files){
            console.error("No files found");
            return;
        }
        const fileMetadata = await uploadFile(event);
        fileState(id,event.target.files[0]);
        if (fileMetadata !== null){
            setFiles([...files, fileMetadata]);
        }
    };

    return (
        <div className={styles.uploadBlock}>
            <p>{name}</p>
            <div className={styles.dragFiles}>
                <p className={styles.dragChild}> Drag and drop to add files </p>
                <input type="file" 
                    id="files" 
                    accept="video/*, audio/*" 
                    className={`${styles.dragChild} ${styles.fileUpload}`} 
                    ref={inputFile} 
                    onChange={upload}
                    title=" "/>
            </div>
            <div className={styles.filesText}>
                <p> Uploaded Files </p>
            </div>
            <div className={styles.uploadedFiles}>
                {files.map((props: FileInfo) => {
                    return (
                        <FileComponent
                            key={props.name}
                            name={props.name} 
                            size={props.size}
                            file_type={props.file_type}
                            thumbnail_url={props.thumbnail_url}/>
                    );
                })}
            </div>
        </div>
    );

};

export default UploadSection;
