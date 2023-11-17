import { render, screen, fireEvent } from "@testing-library/react"
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import Landing from "./Landing";


test("data is mapped correctly", () => {

    const history = createMemoryHistory();
    history.push = jest.fn();

    render(
        <Router location={history.location} navigator={history}>
            <Landing func={jest.fn()} />
        </Router>
    )


    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project size: 55.71')).toBeInTheDocument();

});

test("podcast link goes to editor", () => {
    const history = createMemoryHistory();
    history.push = jest.fn();

    render(
        <Router location={history.location} navigator={history}>
            <Landing func={jest.fn()} />
        </Router>
    )



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


test("podcast link goes to editor", () => {
    const history = createMemoryHistory();
    history.push = jest.fn();

    render(
        <Router location={history.location} navigator={history}>
            <Landing func={jest.fn()} />
        </Router>
    )


    fireEvent.click(screen.getByText(/Create Podcast/i));
    expect(history.push).toHaveBeenCalledWith(
    
        {
            hash: '',
            pathname: '/create',
            search: '',
            preventScrollReset: undefined,
        },
        undefined,
        {}
    );
});
