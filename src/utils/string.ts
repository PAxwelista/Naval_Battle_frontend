export const isAlphanumeric = (word: string): boolean => {
    return /^[a-z0-9]+$/i.test(word);
};
