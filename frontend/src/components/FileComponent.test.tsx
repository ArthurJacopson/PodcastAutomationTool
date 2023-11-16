import { render, screen, fireEvent } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from 'history';
import FileComponent from "./FileComponent";



test('correct stuff is shown in component', () => {

    const sampleData = { 
        slug: "a", 
        name: "Project A",
        date: "Oct 25, 2023",
        size: 55.71 
    }
    const history = createMemoryHistory();
    history.push = jest.fn();

    render(
        <Router location={history.location} navigator={history}>
            <FileComponent 
                slug={sampleData.slug}
                name={sampleData.name}
                date={sampleData.date}
                size={sampleData.size}
            />
        </Router>
    )

    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project size: 55.71')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/Project A/i));
    expect(history.push).toHaveBeenCalledWith(
        {
            hash: '',
            pathname: '/editor/a',
            search: '',
            preventScrollReset: undefined,
        },
        undefined,
        {
            preventScrollReset: undefined,
            relative: undefined,
            replace: false,
            state: undefined,
        }
    );

});
