import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import App from './App';
import {LandingView} from "./Landing";
import React from "react";
import userEvent from "@testing-library/user-event";

// test('change to signup view', async () => {
//     render(<LandingView/>);
//     await userEvent.click(screen.getByText('Sign Up'));
//     expect(screen.getByRole("h1")).toHaveTextContent('signup');
// });
afterEach(() => {
    cleanup()
})

test('failed login test', ()=>{
    render(<App/>);

    fireEvent.change(screen.getByPlaceholderText('user'), {target: {value: '123'}});
    fireEvent.change(screen.getByPlaceholderText('123'), {target: {value: '123'}});

    userEvent.click(screen.getByText('Login'));

    const linkElement = screen.getByText("Login");
    expect(linkElement).toBeInTheDocument();

});


test('login test', ()=>{
    render(<App/>);

    fireEvent.change(screen.getByPlaceholderText('user'), {target: {value: 'Bret'}});
    fireEvent.change(screen.getByPlaceholderText('123'), {target: {value: '123'}});

    userEvent.click(screen.getByText('Login'));

    const linkElement = screen.getByText("Log Out");
    expect(linkElement).toBeInTheDocument();

});


test('logout test', async () => {
    await render(<App/>);

    // fireEvent.change(screen.getByPlaceholderText('user'), {target: {value: 'Bret'}});
    // fireEvent.change(screen.getByPlaceholderText('123'), {target: {value: '123'}});
    //
    // userEvent.click(screen.getByText('Login'));

    userEvent.click(screen.getByText("Log Out"));

    const linkElement = screen.getByText("Login");
    expect(linkElement).toBeInTheDocument();

});




