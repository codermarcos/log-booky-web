import styles from '@/app/entrar/page.module.css';

import SignInForm from '@/app/entrar/components/sign-in-form';

export default async function Entrar() {
  return (
    <div className={styles.page}>
      <header>
        <h1>🌤️ Log Booky 🪽</h1>
        <h2>Entrar</h2>
      </header>
      <main className={styles.main}>
        <SignInForm />
      </main>
      <footer className={styles.footer}>
        <a href="/cadastrar">Ainda não tem um cadastro? Cadastre-se!</a>
      </footer>
    </div>
  );
}
