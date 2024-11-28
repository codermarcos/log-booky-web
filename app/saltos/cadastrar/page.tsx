import styles from '@/app/saltos/page.module.css';

import JumpForm from './components/jump-form';

export default async function CadastrarSaltos() {
  return (
    <div className={styles.page}>
      <header>
        <h1>🌤️ Log Booky 🪽</h1>
        <h2>Cadastrar saltos</h2>
      </header>
      <main className={styles.main}>
        <JumpForm />
      </main>
    </div>
  );
}
