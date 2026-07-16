import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { pessoasApi } from '../api/pessoas';
import { transacoesApi } from '../api/transacoes';
import type { Pessoa, TipoTransacao, Transacao } from '../types';
import { formatarMoeda } from '../utils/format';
import { mensagemDeErro } from '../utils/erros';
import { CabecalhoPagina } from '../components/CabecalhoPagina';
import { Alerta } from '../components/Alerta';
import { EstadoVazio } from '../components/EstadoVazio';
import { ConfirmModal } from '../components/ConfirmModal';
import { IconeEditar, IconeTransacoes } from '../components/icons';

/**
 * Tela de cadastro de transações: formulário de criação/edição + listagem.
 * O desafio original exigia apenas criação e listagem; a edição foi
 * adicionada como recurso extra, reaplicando as mesmas regras de negócio da
 * criação (pessoa existir; menor de idade só registra despesa).
 */
export function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<TipoTransacao>('Despesa');
  const [pessoaId, setPessoaId] = useState('');

  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Quando preenchido, o formulário está em modo de edição desta transação.
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const emEdicao = editandoId !== null;

  // Modal de confirmação de edição, no lugar do window.confirm nativo.
  const [confirmandoEdicao, setConfirmandoEdicao] = useState(false);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      // Carrega transações e pessoas em paralelo (pessoas alimentam o seletor).
      const [listaTransacoes, listaPessoas] = await Promise.all([
        transacoesApi.listar(),
        pessoasApi.listar(),
      ]);
      setTransacoes(listaTransacoes);
      setPessoas(listaPessoas);
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  // Pessoa atualmente selecionada no formulário.
  const pessoaSelecionada = useMemo(
    () => pessoas.find((p) => p.id === pessoaId),
    [pessoas, pessoaId],
  );

  // Regra de negócio (espelhada do back-end): menor de idade só registra despesa.
  const menorDeIdade = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false;

  // Se a pessoa selecionada é menor, força o tipo para "Despesa".
  useEffect(() => {
    if (menorDeIdade) {
      setTipo('Despesa');
    }
  }, [menorDeIdade]);

  function iniciarEdicao(transacao: Transacao) {
    setEditandoId(transacao.id);
    setDescricao(transacao.descricao);
    setValor(String(transacao.valor));
    setTipo(transacao.tipo);
    setPessoaId(transacao.pessoaId);
    setErro('');
  }

  function limparFormulario() {
    setEditandoId(null);
    setDescricao('');
    setValor('');
    setTipo('Despesa');
    setPessoaId('');
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
      const dados = { descricao, valor: Number(valor), tipo, pessoaId };

      if (emEdicao && editandoId) {
        await transacoesApi.atualizar(editandoId, dados);
        // Edição concluída: limpa tudo e volta ao modo de novo lançamento.
        limparFormulario();
      } else {
        await transacoesApi.criar(dados);
        // Limpa apenas os campos do lançamento, mantendo a pessoa selecionada.
        setDescricao('');
        setValor('');
        setTipo('Despesa');
      }
      await carregar();
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  const semPessoas = pessoas.length === 0;

  return (
    <>
      <CabecalhoPagina
        titulo="Transações"
        subtitulo="Lance receitas e despesas vinculadas a cada pessoa."
      />

      <div className="page">
        {erro && <Alerta tipo="erro">{erro}</Alerta>}

        {semPessoas && (
          <Alerta tipo="erro">
            Cadastre ao menos uma pessoa antes de lançar transações.
          </Alerta>
        )}

        <section className="card">
          <div className="card__header">
            <h2 className="card__title">{emEdicao ? 'Editar transação' : 'Nova transação'}</h2>
            <p className="card__desc">
              {emEdicao
                ? 'Altere os campos e confirme para salvar.'
                : 'Selecione a pessoa, o tipo, e informe a descrição e o valor.'}
            </p>
          </div>
          <div className="card__body">
            <form className="form" onSubmit={solicitarSalvar}>
              <div className="field field--full">
                <label className="field__label" htmlFor="descricao">
                  Descrição
                </label>
                <input
                  id="descricao"
                  className="input"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex.: Conta de luz"
                  required
                  maxLength={200}
                  disabled={semPessoas}
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="pessoa">
                  Pessoa
                </label>
                <select
                  id="pessoa"
                  className="select"
                  value={pessoaId}
                  onChange={(e) => setPessoaId(e.target.value)}
                  required
                  disabled={semPessoas}
                >
                  <option value="" disabled>
                    Selecione…
                  </option>
                  {pessoas.map((pessoa) => (
                    <option key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome} ({pessoa.idade} anos)
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="tipo">
                  Tipo
                </label>
                <select
                  id="tipo"
                  className="select"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoTransacao)}
                  disabled={semPessoas || menorDeIdade}
                >
                  <option value="Despesa">Despesa</option>
                  <option value="Receita">Receita</option>
                </select>
                {menorDeIdade && (
                  <span className="field__hint">
                    Menor de idade: apenas despesas são permitidas.
                  </span>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="valor">
                  Valor (R$)
                </label>
                <input
                  id="valor"
                  className="input"
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                  required
                  min={0.01}
                  step="0.01"
                  disabled={semPessoas}
                />
              </div>

              <div className="field" style={{ flexDirection: 'row', gap: 10 }}>
                <button
                  className="btn btn--primary"
                  type="submit"
                  disabled={salvando || semPessoas}
                >
                  {salvando ? 'Salvando…' : emEdicao ? 'Salvar alterações' : 'Lançar transação'}
                </button>
                {emEdicao && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={limparFormulario}
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
            <h2 className="card__title">Transações lançadas</h2>
            <p className="card__desc">
              {transacoes.length} {transacoes.length === 1 ? 'lançamento' : 'lançamentos'} no total.
            </p>
          </div>

          {transacoes.length === 0 ? (
            <EstadoVazio
              icone={<IconeTransacoes />}
              titulo="Nenhuma transação lançada"
              texto="Os lançamentos aparecerão aqui após o cadastro."
            />
          ) : (
            <div className="table-wrap">
              <table className="table table--responsive">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Pessoa</th>
                    <th>Tipo</th>
                    <th className="num">Valor</th>
                    <th className="table__actions-header"></th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes.map((transacao) => (
                    <tr key={transacao.id}>
                      <td className="cell-strong" data-label="Descrição">
                        <span className="table__value">{transacao.descricao}</span>
                      </td>
                      <td data-label="Pessoa">
                        <span className="table__value">{transacao.pessoaNome}</span>
                      </td>
                      <td data-label="Tipo">
                        <span className="table__value">
                          <span className={`badge badge--${transacao.tipo === 'Receita' ? 'receita' : 'despesa'}`}>
                            <span className="badge__dot" />
                            {transacao.tipo}
                          </span>
                        </span>
                      </td>
                      <td
                        className={`num amount amount--${transacao.tipo === 'Receita' ? 'receita' : 'despesa'}`}
                        data-label="Valor"
                      >
                        <span className="table__value">
                          {transacao.tipo === 'Receita' ? '+' : '−'} {formatarMoeda(transacao.valor)}
                        </span>
                      </td>
                      <td className="num table__actions" data-label="Ações">
                        <div className="table__action-buttons">
                          <button
                            className="btn btn--ghost btn--sm"
                            onClick={() => iniciarEdicao(transacao)}
                            title="Editar transação"
                          >
                            <IconeEditar style={{ width: 15, height: 15 }} />
                            Editar
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
        mensagem={`Salvar as alterações do lançamento "${descricao}"?`}
        textoConfirmar="Salvar"
        onConfirmar={efetivarSalvar}
        onCancelar={() => setConfirmandoEdicao(false)}
      />
    </>
  );
}
