import styles from "./page.module.css";

import SignInForm from "./components/sign-in-form";

export default function Home() {
  return (
    <div className={styles.page}>
      <header>
        <h1>🌤️ Log Booky 🪽</h1>
      </header>
      <main className={styles.main}>
        <SignInForm />
      </main>
      <footer className={styles.footer}>
        <a href="/cadastro">Ainda não tem um cadastro? Cadastre-se!</a>
      </footer>
    </div>
  );
}
