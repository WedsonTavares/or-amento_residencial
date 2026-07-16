import { useEffect, useState, type FormEvent } from 'react';
import { pessoasApi } from '../api/pessoas';
import type { Pessoa } from '../types';
import { mensagemDeErro } from '../utils/erros';
import { CabecalhoPagina } from '../components/CabecalhoPagina';
import { Alerta } from '../components/Alerta';
import { EstadoVazio } from '../components/EstadoVazio';
import { ConfirmModal } from '../components/ConfirmModal';
import { IconeEditar, IconePessoas } from '../components/icons';

/**
 * Tela de cadastro de pessoas: formulário de criação/edição + tabela com
 * listagem e exclusão. Ao excluir uma pessoa, o back-end remove suas
 * transações em cascata. A edição (nome/idade) é um recurso adicional ao
 * desafio original, que exigia apenas criação, exclusão e listagem.
 */
export function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Quando preenchido, o formulário está em modo de edição desta pessoa.
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const emEdicao = editandoId !== null;

  // Estado dos modais de confirmação (edição e exclusão), no lugar dos
  // diálogos nativos do navegador (window.confirm).
  const [confirmandoEdicao, setConfirmandoEdicao] = useState(false);
  const [pessoaParaExcluir, setPessoaParaExcluir] = useState<Pessoa | null>(null);

  // Carrega a lista de pessoas ao abrir a tela.
  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      setPessoas(await pessoasApi.listar());
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  function iniciarEdicao(pessoa: Pessoa) {
    setEditandoId(pessoa.id);
    setNome(pessoa.nome);
    setIdade(String(pessoa.idade));
    setErro('');
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNome('');
    setIdade('');
  }

  function solicitarSalvar(evento: FormEvent) {
    evento.preventDefault();

    // Edição exige confirmação explícita antes de persistir a alteração.
    if (emEdicao) {
      setConfirmandoEdicao(true);
      return;
    }
    efetivarSalvar();
  }

  async function efetivarSalvar() {
    setConfirmandoEdicao(false);
    setErro('');
    setSalvando(true);
    try {
      if (emEdicao && editandoId) {
        await pessoasApi.atualizar(editandoId, { nome, idade: Number(idade) });
      } else {
        await pessoasApi.criar({ nome, idade: Number(idade) });
      }
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  async function efetivarRemocao() {
    const pessoa = pessoaParaExcluir;
    if (!pessoa) return;
    setPessoaParaExcluir(null);

    setErro('');
    try {
      await pessoasApi.remover(pessoa.id);
      // Se a pessoa removida era a que estava sendo editada, sai do modo edição.
      if (editandoId === pessoa.id) cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  return (
    <>
      <CabecalhoPagina
        titulo="Pessoas"
        subtitulo="Cadastre e gerencie as pessoas do controle de gastos."
      />

      <div className="page">
        {erro && <Alerta tipo="erro">{erro}</Alerta>}

        <section className="card">
          <div className="card__header">
            <h2 className="card__title">{emEdicao ? 'Editar pessoa' : 'Nova pessoa'}</h2>
            <p className="card__desc">
              {emEdicao
                ? 'Altere o nome e a idade e confirme para salvar.'
                : 'Informe o nome e a idade para cadastrar.'}
            </p>
          </div>
          <div className="card__body">
            <form className="form" onSubmit={solicitarSalvar}>
              <div className="field">
                <label className="field__label" htmlFor="nome">
                  Nome
                </label>
                <input
                  id="nome"
                  className="input"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Maria Souza"
                  required
                  minLength={2}
                  maxLength={120}
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="idade">
                  Idade
                </label>
                <input
                  id="idade"
                  className="input"
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  placeholder="Ex.: 30"
                  required
                  min={0}
                  max={130}
                />
              </div>

              <div className="field" style={{ flexDirection: 'row', gap: 10 }}>
                <button className="btn btn--primary" type="submit" disabled={salvando}>
                  {salvando ? 'Salvando…' : emEdicao ? 'Salvar alterações' : 'Cadastrar pessoa'}
                </button>
                {emEdicao && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={cancelarEdicao}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        <section className="card">
          <div className="card__header">
            <h2 className="card__title">Pessoas cadastradas</h2>
            <p className="card__desc">
              {pessoas.length} {pessoas.length === 1 ? 'pessoa' : 'pessoas'} no total.
            </p>
          </div>

          {pessoas.length === 0 ? (
            <EstadoVazio
              icone={<IconePessoas />}
              titulo="Nenhuma pessoa cadastrada"
              texto="Cadastre a primeira pessoa usando o formulário acima."
            />
          ) : (
            <div className="table-wrap">
              <table className="table table--responsive">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th className="table__actions-header"></th>
                  </tr>
                </thead>
                <tbody>
                  {pessoas.map((pessoa) => (
                    <tr key={pessoa.id}>
                      <td className="cell-strong" data-label="Nome">
                        <span className="table__value">{pessoa.nome}</span>
                      </td>
                      <td data-label="Idade">
                        <span className="table__value table__value--inline">
                          {pessoa.idade} anos
                          {pessoa.idade < 18 && (
                            <span className="badge badge--pill">Menor de idade</span>
                          )}
                        </span>
                      </td>
                      <td className="num table__actions" data-label="Ações">
                        <div className="table__action-buttons">
                          <button
                            className="btn btn--ghost btn--sm"
                            onClick={() => iniciarEdicao(pessoa)}
                            title="Editar pessoa"
                          >
                            <IconeEditar style={{ width: 15, height: 15 }} />
                            Editar
                          </button>
                          <button
                            className="btn btn--danger-soft"
                            onClick={() => setPessoaParaExcluir(pessoa)}
                            title="Excluir pessoa"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <ConfirmModal
        aberto={confirmandoEdicao}
        titulo="Salvar alterações"
        mensagem={`Salvar as alterações de "${nome}"?`}
        textoConfirmar="Salvar"
        onConfirmar={efetivarSalvar}
        onCancelar={() => setConfirmandoEdicao(false)}
      />

      <ConfirmModal
        aberto={pessoaParaExcluir !== null}
        titulo="Excluir pessoa"
        mensagem={
          pessoaParaExcluir
            ? `Excluir "${pessoaParaExcluir.nome}"? Todas as transações desta pessoa também serão apagadas.`
            : ''
        }
        textoConfirmar="Excluir"
        variante="perigo"
        onConfirmar={efetivarRemocao}
        onCancelar={() => setPessoaParaExcluir(null)}
      />
    </>
  );
}
