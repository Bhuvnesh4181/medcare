"use client";

import Image from "next/image";
import style from "./GoogleSignInButton.module.css";

interface GoogleSignInButtonProps {
    onClick: () => void;
    text?: string;
}

export default function GoogleSignInButton({
    onClick,
    text = "Sign in with Google",
}: GoogleSignInButtonProps) {
    return (
        <button className={style.googleButton} onClick={onClick}>
            <div className={style.googleIconWrapper}>
                <Image
                    className={style.googleIcon}
                    src="/google.svg"
                    alt="Google logo"
                    width={18}
                    height={18}
                />
            </div>
            <p className={style.buttonText}>{text}</p>
        </button>
    );
}