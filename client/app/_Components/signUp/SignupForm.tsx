import styles from "./signup.module.css";
import Image from "next/image";
import Link from "next/link";
export default function SignUpForm() {
    return (
        <div className={styles.signupContainer}>
            <h2>Sign Up</h2>
            <p>
                Already a member? <Link href="/login">Login.</Link>
            </p>

            {/* <label>Role</label>
            <div className={styles.inputField}>
                <section className={styles.inputcontainer}>
                    <span>
                    <Image src="/role.svg" alt="role logo" height={20} width={20}></Image>
                    </span>
                    <input type="input" placeholder="Select Role"/>
                </section>
            </div> */}

            <label>Name</label>
            <div className={styles.inputField}>
                <section className={styles.inputcontainer}>
                    <span>
                        <Image
                            src="/name.svg"
                            alt="name logo"
                            height={20}
                            width={20}
                        ></Image>
                    </span>
                    <input type="input" placeholder="Enter your name" />
                </section>
            </div>

           

            <label>Email</label>
            <div className={styles.inputField}>
                <section className={styles.inputcontainer}>
                    <span>
                        <Image
                            src="/email.svg"
                            alt="Email logo"
                            height={20}
                            width={20}
                        ></Image>
                    </span>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                    />
                </section>
            </div>

            <label>Password</label>
            <div className={styles.inputField}>
                <section className={styles.inputcontainer}>
                    <span>
                        <Image
                            src="/lockPass.svg"
                            alt="pass logo"
                            height={20}
                            width={20}
                        ></Image>
                    </span>
                    <input type="password" placeholder="********" />
                </section>
            </div>

            <button className={`${styles.button} ${styles.submitButton}`}>
                Submit
            </button>
            <button className={`${styles.button} ${styles.resetButton}`}>
                Reset
            </button>
        </div>
    );
}