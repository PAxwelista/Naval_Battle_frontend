import { ButtonProps } from "@/types";

import style from "@/styles/Button.module.css";
import Link from "next/link";

export const Button = ({ text, onClick, href }: ButtonProps) => {
    return href ? (
        <Link
            href={href}
            className={style.main}
        >
            {text}
        </Link>
    ) : (
        <button
            className={style.main}
            onClick={onClick}
        >
            {text}
        </button>
    );
};
