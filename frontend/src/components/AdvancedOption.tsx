import { PropsWithChildren } from "react";
import styles from "./EditingOptionsComponent.module.css";

const AdvancedOption:React.FC<PropsWithChildren<any>> = (props) => {

    const selectedOption = props.chosen ? styles.selectedOptions : '';
    return (

        <>
            <div className={styles.options} id={selectedOption}>
                <label><input type="checkbox" checked={props.chosen} onClick={props.handleChange} />Advanced Editing</label>
                {props.chosen && (  
                    <div>
                        <label><input type="checkbox" id="sync" name="optionSelect" value="synchronise" />Synchronisation</label>
                        <label><input type="checkbox" id="transcript" name="optionSelect" value="transcription" />Transcription</label>
                        <label><input type="checkbox" id="master" name="optionSelect" value="mastering" />Audio Mastering</label>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdvancedOption;
