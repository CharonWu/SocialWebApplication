import {fireEvent, render, screen} from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import React from "react";

test('fetch articles test', async () => {
    await render(<App/>);

    fireEvent.change(screen.getByPlaceholderText('user'), {target: {value: 'Bret'}});
    fireEvent.change(screen.getByPlaceholderText('123'), {target: {value: '123'}});

    await userEvent.click(screen.getByText('Login'));

    setTimeout(1000, ()=>{
        const linkElement = screen.getByLabelText("postbody");expect(linkElement.children.length).toBe(40);
    })


});

test('filter articles test', async () => {
    render(<App/>);

    // fireEvent.change(screen.getByPlaceholderText('user'), {target: {value: 'Bret'}});
    // fireEvent.change(screen.getByPlaceholderText('123'), {target: {value: '123'}});
    //
    // userEvent.click(screen.getByText('Login'));

    fireEvent.change(screen.getByLabelText("search-bar"), {target: {value: 'hello'}});


    const linkElement = screen.getByLabelText("postbody");
    expect(linkElement.children.length).toBe(0);


});

test('add new user test', async () => {
    render(<App/>);

    // fireEvent.change(screen.getByPlaceholderText('user'), {target: {value: 'Bret'}});
    // fireEvent.change(screen.getByPlaceholderText('123'), {target: {value: '123'}});
    //
    // userEvent.click(screen.getByText('Login'));

    setTimeout(1000, ()=>{
        fireEvent.change(screen.getByLabelText('follow-input'), {target:{value: 'Kamren'}})
        userEvent.click(screen.getByText('follow'));
    })

    setTimeout(2000, ()=>{
        const linkElement = screen.getByLabelText("postbody");expect(linkElement.children.length).toBe(40);
    })


});