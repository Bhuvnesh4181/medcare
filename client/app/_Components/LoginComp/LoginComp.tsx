import styles from "./Login.module.css";
import LoginForm from "./LoginForm";

export default function LoginComp() {
    return (
        <div className={styles.login}>
            <LoginForm />
        </div>
    );
}
