import styles from "./signup.module.css";
import SignUpForm from "./SignupForm";

export default function SignUpComp() {
    return (
        <div className={styles.signup}>
            <SignUpForm />
        </div>
    );
}
