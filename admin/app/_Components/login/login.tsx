"use client"
import styles from "./login.module.css";
import Image from "next/image";
import { useState } from "react";
export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e:any){
         e.preventDefault();

         const response = await fetch("http://localhost:3001/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        
        });

        const data = await response.json();
        if (response.ok) {
            alert("Login successful!");
        } else {
            alert(`Login failed: ${data.message}`);
        }

    }
    return (
        <div className={styles.loginContainer}>
            <h2>Admin Login</h2>
            
            <br/>
            <label>Email</label>
            <div className={styles.inputField}>
                <section className={styles.inputcontainer}>
                    <span>
                    <Image src="/email.svg" alt="Email logo" height={20} width={20}></Image>
                    </span>
                    <input type="email" placeholder="Enter your email address" value={email} 
                            onChange={(e) => setEmail(e.target.value)} className={styles.input} />
                </section>
            </div>
            
            

            <label>Password</label>
            <div className={styles.inputField}>
                <section className={styles.inputcontainer}>
                    <span>
                    <Image src="/lockPass.svg" alt="pass logo" height={20} width={20}></Image>
                    </span>
                    <input type="password" placeholder="********" value={password} 
                            onChange={(e) => setPassword(e.target.value)} className={styles.input} />
                </section>
            </div>

            <button className={`${styles.button} ${styles.loginButton}`} onClick={handleLogin}>Login</button>
   
            <br/>
            <br/>
            
        </div>
    );
}