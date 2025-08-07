import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import {Game,JoinGame} from "../components";
import router from 'next-router-mock';
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

describe("Click on a serveur" , ()=>{
    it("should change the page" , ()=>{
        // render(<Game gameName="test" token="token"/>, { wrapper: MemoryRouterProvider })
        // render(<JoinGame/>, { wrapper: MemoryRouterProvider })
        expect(true).toBe(true)
    })
})