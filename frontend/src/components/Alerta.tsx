import { IconeAlerta, IconeCheck } from './icons';

interface AlertaProps {
  tipo: 'erro' | 'sucesso';
  children: React.ReactNode;
}

/**
 * Faixa de mensagem para feedback ao usuário (erro ou sucesso).
 * Usa ícone + texto para que o significado não dependa só da cor (acessibilidade).
 */
export function Alerta({ tipo, children }: AlertaProps) {
  return (
    <div className={`alert alert--${tipo}`} role="alert">
      {tipo === 'erro' ? <IconeAlerta /> : <IconeCheck />}
      <span>{children}</span>
    </div>
  );
}
