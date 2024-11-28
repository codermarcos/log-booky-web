import styles from '@/app/cadastrar/page.module.css';

import SignUpForm from '@/app/cadastrar/components/sign-up-form';

export default function Cadastrar() {
  return (
    <div className={styles.page}>
      <header>
        <h1>🌤️ Log Booky 🪽</h1>
        <h2>Cadastrar</h2>
      </header>
      <main className={styles.main}>
        <SignUpForm />
      </main>
      <footer className={styles.footer}>
        <a href="/entrar">Já é cadastrado? Acesse em sua conta!</a>
      </footer>
    </div>
  );
}
