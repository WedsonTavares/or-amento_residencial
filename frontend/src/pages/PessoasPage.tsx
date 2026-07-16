import { useEffect, useState, type FormEvent } from 'react';
import { pessoasApi } from '../api/pessoas';
import type { Pessoa } from '../types';
import { mensagemDeErro } from '../utils/erros';
import { CabecalhoPagina } from '../components/CabecalhoPagina';
import { Alerta } from '../components/Alerta';
import { EstadoVazio } from '../components/EstadoVazio';
import { IconePessoas } from '../components/icons';

/**
 * Tela de cadastro de pessoas: formulário de criação + tabela com listagem
 * e exclusão. Ao excluir uma pessoa, o back-end remove suas transações em cascata.
 */
export function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

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

  async function criar(evento: FormEvent) {
    evento.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await pessoasApi.criar({ nome, idade: Number(idade) });
      // Limpa o formulário e recarrega a lista após o sucesso.
      setNome('');
      setIdade('');
      await carregar();
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  async function remover(pessoa: Pessoa) {
    // Confirmação explícita: a exclusão também apaga as transações da pessoa.
    const confirmado = window.confirm(
      `Excluir "${pessoa.nome}"? Todas as transações desta pessoa também serão apagadas.`,
    );
    if (!confirmado) return;

    setErro('');
    try {
      await pessoasApi.remover(pessoa.id);
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
            <h2 className="card__title">Nova pessoa</h2>
            <p className="card__desc">Informe o nome e a idade para cadastrar.</p>
          </div>
          <div className="card__body">
            <form className="form" onSubmit={criar}>
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

              <div className="field">
                <button className="btn btn--primary" type="submit" disabled={salvando}>
                  {salvando ? 'Salvando…' : 'Cadastrar pessoa'}
                </button>
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
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th style={{ width: 1 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {pessoas.map((pessoa) => (
                    <tr key={pessoa.id}>
                      <td className="cell-strong">{pessoa.nome}</td>
                      <td>
                        {pessoa.idade} anos
                        {pessoa.idade < 18 && (
                          <span className="badge badge--pill" style={{ marginLeft: 8 }}>
                            Menor de idade
                          </span>
                        )}
                      </td>
                      <td className="num">
                        <button
                          className="btn btn--danger-soft"
                          onClick={() => remover(pessoa)}
                          title="Excluir pessoa"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
