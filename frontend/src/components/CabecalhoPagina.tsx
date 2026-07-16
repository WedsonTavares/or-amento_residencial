interface CabecalhoPaginaProps {
  titulo: string;
  subtitulo: string;
}

/** Cabeçalho (topbar) exibido no topo de cada página, com título e descrição. */
export function CabecalhoPagina({ titulo, subtitulo }: CabecalhoPaginaProps) {
  return (
    <header className="topbar">
      <h1 className="topbar__title">{titulo}</h1>
      <p className="topbar__subtitle">{subtitulo}</p>
    </header>
  );
}
