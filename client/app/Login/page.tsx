"use client";

import { useLogin } from "@/providers/loginProvider";
import LoginComp from "../_Components/LoginComp/LoginComp";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
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
            <div>
                <LoginComp />
            </div>
        </>
    );
}