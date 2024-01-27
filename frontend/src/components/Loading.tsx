import { useEffect, useState } from "react";
import styles from "./Loading.module.css";


const Loading : React.FC = () => {


    const [dotsCount, setDotsCount] = useState<number>(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDotsCount(prevCount => (prevCount + 1) % 4);
        }, 500);
    
        return () => clearInterval(intervalId);
    }, []);

    const renderDots = () => {
        return Array.from({ length: dotsCount }, (_, index) => <span key={index}>.</span>);
    };

    return (
        <div className={styles.LoadingScreen}>
            <div className={styles.LoadingSpinner} />
            <p>Loading{renderDots()}</p>
            <p className={styles.LoadingHint}>Do not refresh your browser window</p>
        </div>
    );
};


export default Loading;