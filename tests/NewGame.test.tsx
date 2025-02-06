import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import NewGame from "../components/NewGame";
import router from 'next-router-mock';
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

describe("Input gameName", () => {
    it("sould work correctly", () => {
        const newName = "gameName"
        render(<NewGame />, { wrapper: MemoryRouterProvider })
        const input = screen.getByPlaceholderText(/Nom de la partie/i)
        expect(input).toBeInTheDocument()
        input && fireEvent.change(input,{target : {value : newName}})
        expect(screen.queryByDisplayValue(newName)).toBeInTheDocument()
    });
});

describe("Validate Button" , ()=>{
    it("should change the page if all inputs are setUp", ()=>{
        const newName = "CoolGame"
        render(<NewGame />, { wrapper: MemoryRouterProvider })
        const input = screen.getByPlaceholderText(/Nom de la partie/i)
        expect(input).toBeInTheDocument()
        const button = screen.queryByText(/Prêt/i)
        expect(button).toBeInTheDocument()
        input && fireEvent.change(input,{target : {value : newName}})
        button && fireEvent.click(button)
        expect(router.pathname).toContain(`/game/${newName}/`)
    })
    it("should show an error message if no all inputs are setUp", ()=>{
        render(<NewGame />, { wrapper: MemoryRouterProvider })
        const button = screen.queryByText(/Prêt/i)
        expect(button).toBeInTheDocument()
        button && fireEvent.click(button)
        expect(screen.getByText("Inputs non remplis")).toBeInTheDocument()
    })
})