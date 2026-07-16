import { useEffect } from 'react';
import { IconeAlerta } from './icons';

interface ConfirmModalProps {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  /** "perigo" destaca o botão de confirmação em vermelho (ex.: exclusão). */
  variante?: 'padrao' | 'perigo';
  onConfirmar: () => void;
  onCancelar: () => void;
}

/**
 * Modal de confirmação usado no lugar dos diálogos nativos do navegador
 * (window.confirm), mantendo a mesma identidade visual do restante do sistema.
 */
export function ConfirmModal({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'padrao',
  onConfirmar,
  onCancelar,
}: ConfirmModalProps) {
  // Fecha o modal com a tecla Esc, um atalho esperado nesse tipo de diálogo.
  useEffect(() => {
    if (!aberto) return;

    function aoPressionarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onCancelar();
    }

    window.addEventListener('keydown', aoPressionarTecla);
    return () => window.removeEventListener('keydown', aoPressionarTecla);
  }, [aberto, onCancelar]);

  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div
        className="modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className={`modal-card__icone modal-card__icone--${variante}`}>
          <IconeAlerta />
        </div>
        <h3 id="modal-titulo" className="modal-card__titulo">
          {titulo}
        </h3>
        <p className="modal-card__mensagem">{mensagem}</p>
        <div className="modal-card__acoes">
          <button type="button" className="btn btn--ghost" onClick={onCancelar}>
            {textoCancelar}
          </button>
          <button
            type="button"
            className={`btn ${variante === 'perigo' ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirmar}
            autoFocus
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
