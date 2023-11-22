import { ChangeEvent, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import FileComponent from "./FileComponent";
import { FileInfo } from "../Interfaces";

import axios from "axios";


import styles from "./CreatePodcast.module.css"
import globalStyles from '../App.module.css';

const CreatePodcast: React.FC = () => {

    const [files, setFiles] = useState<Array<FileInfo>>([]);
    const [fileToUpload, setFileToUpload]: any = useState(null);
    const [projectName, setProjectName]: any = useState('');
    const inputFile: any = useRef(null);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files)
            setFileToUpload(event.target.files[0]);
    }

    const nameSlug = (name: string): string => {
        return name.toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    const uploadFile = () => {
        if (fileToUpload !== null) {
            const file_metadata = {
                slug: nameSlug(fileToUpload.name),
                name: fileToUpload.name,
                date: fileToUpload.lastModifiedDate.getDate(),
                size: fileToUpload.size
            };
            setFiles([...files, file_metadata]);
            if (inputFile.current)
                inputFile.current.value = null;
        }
    }

    const uploadPodcastToServer = async () => {
        try {

            const UPLOAD_ENDPOINT = `http://127.0.0.1:5000/create/${projectName}`
            const data = {
                "slug": projectName,
                "name": projectName,
                "date": Date(),
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
        console.log("HELLO");
        uploadPodcastToServer();
    }

    const changeProjectName = (event: ChangeEvent<HTMLInputElement>) => {
        setProjectName(event.target.value);
    }

    return (
        <div className="mainContent" id={styles.main}>
            <div id={styles.fileAdd}>
                <div className={styles.projectName}>
                    <p> Name of project </p>
                    <input type="text" onChange={changeProjectName} />
                </div>
                <div className={styles.dragFiles}>
                    <p> Drag and drop to add files </p>
                    <input type="file" accept="video/*, audio/*" ref={inputFile} onChange={handleFileUpload} />
                    <button onClick={uploadFile}> Upload from computer </button>
                </div>
                <p> Uploaded Files </p>
                <div className={styles.uploadedFiles}>
                    {files.map((props: FileInfo) => {
                        return (
                            <FileComponent slug={props.slug} name={props.name} date={props.date} size={props.size} />
                        )
                    })}
                </div>
            </div>
            <div id={styles.configurePodcast}>
                <div className={styles.optionSelect}>
                    <label><input type="checkbox" id="sync" name="optionSelect" value="synchronise" />Synchronisation</label><br />
                    <label><input type="checkbox" id="transcript" name="optionSelect" value="transcription" />Transcription</label><br />
                    <label><input type="checkbox" id="master" name="optionSelect" value="mastering" />Audio Mastering</label><br />
                </div>
                <div id={styles.startProcessing}>
                    {(projectName && files[0]) &&
                        <Link to={`../editor/${projectName}`} className={globalStyles.Link} >
                            <button onClick={startProcessing}> Start Editing </button>
                        </Link>
                    }
                </div>
            </div>
        </div>
    )
}

export default CreatePodcast;
