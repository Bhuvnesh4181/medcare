import Link from "next/link";
import styles from "./Login.module.css";
import Image from "next/image";
export default function LoginForm() {
    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            <p>Are you a new member? <Link href="/register">Sign up here.</Link></p>
            <br/>
            <label>Email</label>
            <div className={styles.inputField}>
                <section className={styles.inputcontainer}>
                    <span>
                    <Image src="/email.svg" alt="Email logo" height={20} width={20}></Image>
                    </span>
                    <input type="email" placeholder="Enter your email address"/>
                </section>
            </div>
            

            <label>Password</label>
            <div className={styles.inputField}>
                <section className={styles.inputcontainer}>
                    <span>
                    <Image src="/lockPass.svg" alt="pass logo" height={20} width={20}></Image>
                    </span>
                    <input type="password" placeholder="********"/>
                </section>
            </div>
            <button className={`${styles.button} ${styles.loginButton}`}>Login</button>
            <button className={`${styles.button} ${styles.resetButton}`}>Reset</button>
            <br/>
            <br/>
            <p className={styles.forgot}><Link href="/forgot-password">Forgot Password?</Link></p>
        </div>
    );
}