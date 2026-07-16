interface EstadoVazioProps {
  icone: React.ReactNode;
  titulo: string;
  texto: string;
}

/** Mensagem exibida quando uma listagem ainda não possui registros. */
export function EstadoVazio({ icone, titulo, texto }: EstadoVazioProps) {
  return (
    <div className="empty">
      <div className="empty__icon">{icone}</div>
      <p className="empty__title">{titulo}</p>
      <p className="empty__text">{texto}</p>
    </div>
  );
}
