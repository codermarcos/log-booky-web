import styles from "@/app/confirmar/page.module.css";

import ConfirmForm from "@/app/confirmar/components/confirm-form";

export default function Confirmar() {
  return (
    <div className={styles.page}>
      <header>
        <h1>🌤️ Log Booky 🪽</h1>
        <h2>Confirmar email</h2>
      </header>
      <main className={styles.main}>
        <ConfirmForm />
      </main>
      <footer className={styles.footer}>
        <a href="/cadastrar">Ainda não iniciou o cadastro? Acesse em sua conta!</a>
      </footer>
    </div>
  );
}
