import { render, screen, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import Landing from "./Landing";

test("create podcast link goes to create podcast", () => {
    const history = createMemoryHistory();
    history.push = jest.fn();

    render(
        <Router location={history.location} navigator={history}>
            <Landing func={jest.fn()} />
        </Router>
    );


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
