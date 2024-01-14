import { ChangeEvent, useState, useRef } from "react";
import { FileInfo } from "../Interfaces";
import  AddFile  from "./AddFile";
import { nameSlug, sizeConversion} from "../utils"
import axios from "axios";

import styles from "./CreatePodcast.module.css"
import StartEditingButton from "./StartEditingButton";
import BasicOption from "./BasicOption";
import AdvancedOption from "./AdvancedOption";

const CreatePodcast: React.FC = () => {

    const [files, setFiles] = useState<Array<FileInfo>>([]);
    const [projectName, setProjectName] = useState<string>('');
    const [basicSelected, setBasicSelected] = useState<boolean>(true);
    const inputFile: React.RefObject<HTMLInputElement> = useRef(null);

    const uploadFile = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const date = new Date(event.target.files[0].lastModified);
            const file_metadata = {
                slug: nameSlug(event.target.files[0].name),
                name: event.target.files[0].name,
                date: date.toDateString(),
                size: sizeConversion(event.target.files[0].size),
                component_type: event.target.files[0].type
            };
            setFiles([...files, file_metadata]);
            if (inputFile.current)
                inputFile.current.value = '';
        }
    }

    const uploadPodcastToServer = async () => {
        try {
            const UPLOAD_ENDPOINT = process.env.REACT_APP_FLASK_API_DEVELOP + `/create/${projectName}`
            const data = {
                "slug": projectName,
                "name": projectName,
                "date": new Date().toDateString(),
                "size": (Math.random() * 100).toFixed(2)
            }
            await axios.post(UPLOAD_ENDPOINT, data, {
                headers: {
                    "content-type": "json",
                },
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    const startProcessing = () => {
        uploadPodcastToServer();
    }

    const changeProjectName = (event: ChangeEvent<HTMLInputElement>) => {
        setProjectName(event.target.value);
    }

    return (
        <div className="mainContent" id={styles.main}>
            <AddFile 
                changeProjectName={changeProjectName}
                inputFile={inputFile}
                uploadFile={uploadFile}
                files={files}
            />
            <div id={styles.configurePodcast}>
                <BasicOption 
                    chosen={basicSelected}
                    handleChange={() => setBasicSelected(true)}
                    className={styles.optionSelect}
                />
                <AdvancedOption
                    chosen={!basicSelected}
                    handleChange={() => setBasicSelected(false)}
                    className={styles.optionSelect}
                />
                <div id={styles.startProcessing}>
                    <StartEditingButton
                        canContinue={projectName && files[0]}
                        startProcessing={startProcessing}
                        projectName={projectName}
                    />
                </div>
            </div>
        </div>
    )
}

export default CreatePodcast;
