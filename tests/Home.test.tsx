import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../components/Home";
import router from 'next-router-mock';
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";


describe("Button new game", () => {
    it("should change the current page to newGame", async () => {
        
        render(<Home />, { wrapper: MemoryRouterProvider });
        const link = screen.queryByText(/Nouvelle partie/i)
        expect(link).toBeInTheDocument();
        link && fireEvent.click(link);
        expect(router.pathname).toBe("/newGame");
    });
});
describe("Button join game", () => {
    it("should change the current page to joinGame", () => {
        render(<Home />, { wrapper: MemoryRouterProvider });
        const link = screen.queryByText(/Rejoindre partie/i);
        expect(link).toBeInTheDocument();
        link && fireEvent.click(link);
        expect(router.pathname).toBe("/joinGame");
    });
});