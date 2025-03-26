"use client";

import { useLogin } from "@/providers/loginProvider";
import SignUpComp from "../_Components/signUp/SignUp";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Register() {
    const { user } = useLogin();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.replace("/");
        }
    }, [user]);

    if (user) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                Already Logged in, redirecting back to home page!
            </div>
        );
    }

    return (
        <>
            <SignUpComp />
        </>
    );
}