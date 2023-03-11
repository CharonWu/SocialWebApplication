import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import React from "react";

test('fetch articles test', async () => {
    cleanup();
    await render(<App/>);

    fireEvent.change(screen.getByPlaceholderText('user'), {target: {value: 'Bret'}});
    fireEvent.change(screen.getByPlaceholderText('123'), {target: {value: '123'}});

    userEvent.click(screen.getByText('Login'));

    userEvent.click(screen.getByText('Profile'))
    expect(screen.getByText('Bret')).toBeInTheDocument();
});