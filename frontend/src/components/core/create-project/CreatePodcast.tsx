import { ChangeEvent, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FileInfo } from "../../../Interfaces";

import  AddFile  from "./AddFile";
import { sizeConversion } from "../../../utils";

import styles from "./CreatePodcast.module.css";
import globalStyles from "../../../App.module.css";

import axios from 'axios';
import AWS from 'aws-sdk';
import EditorOption from "./EditorOption";

const CreatePodcast: React.FC = () => {

    const API_ENDPOINT = process.env.REACT_APP_FLASK_API_DEVELOP;

    const navigate = useNavigate();

    const [files, setFiles] = useState<Array<FileInfo>>([]);
    const [projectName, setProjectName] = useState<string>('');
    const [editorSelection, setEditorSelection] = useState<string>("regular");
    const inputFile: React.RefObject<HTMLInputElement> = useRef(null);
    const bucketName = "temp";

    AWS.config.update({
        accessKeyId: process.env.REACT_APP_MINIO_USER_NAME,
        secretAccessKey: process.env.REACT_APP_MINIO_PASSWORD,
        region: 'London', // Set the region accordingly
        s3ForcePathStyle: true, // Required for Minio
        signatureVersion: 'v4', // Use v4 signature for Minio
    });

    const s3 = new AWS.S3({
        endpoint: process.env.REACT_APP_MINIO_ENDPOINT,
    });

    const uploadFile = (event: ChangeEvent<HTMLInputElement>) => {

        const getThumbnail = async () => {
            if(event.target.files){
                const key = event.target.files[0].name;
                try{
                    const UPLOAD_ENDPOINT = (process.env.REACT_APP_FLASK_API_DEVELOP + '/get-thumbnail');
                    const data = {
                        "bucket": bucketName,
                        "key": key,
                    };
                    await axios.post(UPLOAD_ENDPOINT, data, {
                        headers: {
                            "content-type": "json",
                        },
                    });
                }catch (e) {
                    console.error(e);
                }
            }
        };
        if (event.target.files) {
            const key = event.target.files[0].name;
            const s3Params = {
                Bucket: bucketName,
                Key: event.target.files[0].name,
                Body: event.target.files[0]
            };

            s3.upload(s3Params).promise().then((data)=>{
                return s3.waitFor('objectExists', {Bucket: bucketName, Key: key});
            })
                .then(() =>{
                    getThumbnail().then(()=>{
                        if(event.target.files){
    
                            const date = new Date(event.target.files[0].lastModified);
                            const file_metadata = {
                                name: event.target.files[0].name,
                                date: date.toDateString(),
                                size: sizeConversion(event.target.files[0].size),
                                file_type: event.target.files[0].type,
                                thumbnail_url: (process.env.REACT_APP_MINIO_ENDPOINT + "/" + bucketName + "/" + event.target.files[0].name + "_thumbnail.jpg")
                            };
                            setFiles([...files, file_metadata]);
                            if (inputFile.current)
                                inputFile.current.value = '';
                        }
                    });
                });
        }
    };

    /**
     * Sends a request to the API to create a new podcast called {projectName}.
     * If successfully created, navigate to the editor page for the new project_id.
     */
    const uploadPodcast = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/create/${projectName}`, {
                method: 'POST',
                headers: {
                    "content-type": "json",
                },
            });
                
            if(!response.ok) {
                throw new Error(`Failed to create new project. Status: ${response.status.toString()}`);
            } 
            const responseData = await response.json();
            navigate(`/editor/${editorSelection}/${responseData.project_id}`);
        } catch (e) {
            console.error('Error creating new project:', e);
        }
    };

    const changeProjectName = (event: ChangeEvent<HTMLInputElement>) => {
        setProjectName(event.target.value);
    };

    /**
     * Constructs the button element that allows the user to start editing.
     * The button will be disabled until:
     *   - At least one file has been uploaded
     *   - There is a project name
     */
    const startEditingButton = (
        projectName && files[0] ? (
            <Link to={'#'} className={globalStyles.Link}>
                <button onClick={uploadPodcast}>Start Editing</button>
            </Link>
        ) : (
            <button disabled>Start Editing</button>
        )
    );


    return (
        <div className={globalStyles.mainContent} id={styles.main}>
            <AddFile 
                changeProjectName={changeProjectName}
                inputFile={inputFile}
                uploadFile={uploadFile}
                files={files}
            />
            <div id={styles.configurePodcast}>
                <EditorOption
                    chosen={editorSelection}
                    optionType={"Regular"}
                    handleChange={() => setEditorSelection("regular")}
                />
                <EditorOption
                    chosen={editorSelection}
                    optionType={"Waveform"}
                    handleChange={() => setEditorSelection("waveform")}
                />
                {startEditingButton}
            </div>
        </div>
    );
};

export default CreatePodcast;
