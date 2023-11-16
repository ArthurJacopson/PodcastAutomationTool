import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate }  from "react-router-dom";
import Navbar from "./Navbar";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockNavigate,
}));

test('if the navbar loads correctly and routes to the correct places', async () => {
    render(
        <MemoryRouter>
            <Navbar title={"test title"}/>
        </MemoryRouter>
    );


    expect(screen.getByRole('heading')).toHaveTextContent('test title');

    await userEvent.click(screen.getByAltText("Logo"));

    expect(mockNavigate).toHaveBeenCalledWith('/');

});
