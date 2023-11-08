import './Editor.css'

import FileComponent from './FileComponent';

const Landing = () => {

    const sampleData = [
        { name: "Project A", date: "Oct 25, 2023", size: 55.71 },
        { name: "Project B", date: "Oct 14, 2023", size: 25.61 },
    ]

    return (
        <div className="mainContent">
            {sampleData.map(({ name, date, size }) => {
                return (<FileComponent name={name} date={date} size={size} />
                )
            })}
        </div>
    )
}

export default Landing;