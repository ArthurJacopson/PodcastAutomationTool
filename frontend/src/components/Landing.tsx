import './Editor.css'

import FileComponent from './FileComponent';

interface funcProp {
    func: (data: string) => void;
}

const Landing = (props: funcProp) => {

    props.func("Podplisticss");

    const sampleData = [
        { slug: "a", name: "Project A", date: "Oct 25, 2023", size: 55.71 },
        { slug: "b", name: "Project B", date: "Oct 14, 2023", size: 25.61 },
    ]

    return (
        <div className="mainContent">
            {sampleData.map(({ slug, name, date, size }) => {
                return (<FileComponent slug={slug} name={name} date={date} size={size} />
                )
            })}
        </div>
    )
}

export default Landing;