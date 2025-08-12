import { isAlphanumeric } from "@/utils/string";

describe("isAlphanumeric function", () => {
    it("should return false if the word doesn't contain only letter and number", () => {
        const words = ["helo1 " , "salut#" , "bonne partie" , "pas dingue387§"];
        words.forEach(word => expect(isAlphanumeric(word)).toBeFalsy());
    });
    it("should return true if the word contain only letter and number", () => {
        const words = ["helo1" , "salut" , "bonnePartie" , "pasDingue387"];
        words.forEach(word => expect(isAlphanumeric(word)).toBeTruthy());
    });
});
