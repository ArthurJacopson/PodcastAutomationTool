import { PropsWithChildren } from "react";
import styles from "./EditingOptionsComponent.module.css";

const BasicOption:React.FC<PropsWithChildren<any>> = (props) => {
    const selectedOption = props.chosen ? styles.selectedOptions : '';
    return (
        <>
            <div className={styles.options} id={selectedOption}>
                <label><input type="checkbox" checked={props.chosen} onClick={props.handleChange}/>Basic Editing</label>
            </div>
        </>
    );
}

export default BasicOption;
