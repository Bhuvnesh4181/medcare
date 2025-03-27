import styles from "./login.module.css";
import LoginForm from "./login";

export default function LoginComp() {
    return (
        <div className={styles.login}>
            <LoginForm />
        </div>
    );
}