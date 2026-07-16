import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PessoasPage } from './pages/PessoasPage';
import { TransacoesPage } from './pages/TransacoesPage';
import { TotaisPage } from './pages/TotaisPage';

/**
 * Definição das rotas da aplicação. Todas ficam dentro do <Layout />, que
 * fornece a barra lateral. A rota raiz redireciona para "Pessoas".
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/pessoas" replace />} />
        <Route path="pessoas" element={<PessoasPage />} />
        <Route path="transacoes" element={<TransacoesPage />} />
        <Route path="totais" element={<TotaisPage />} />
        {/* Qualquer rota desconhecida volta para a tela de pessoas. */}
        <Route path="*" element={<Navigate to="/pessoas" replace />} />
      </Route>
    </Routes>
  );
}
