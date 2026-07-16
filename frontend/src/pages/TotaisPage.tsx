import { useEffect, useState } from 'react';
import { totaisApi } from '../api/totais';
import type { ResumoTotais } from '../types';
import { formatarMoeda } from '../utils/format';
import { mensagemDeErro } from '../utils/erros';
import { CabecalhoPagina } from '../components/CabecalhoPagina';
import { Alerta } from '../components/Alerta';
import { EstadoVazio } from '../components/EstadoVazio';
import { IconeSetaBaixo, IconeSetaCima, IconeCarteira, IconeTotais } from '../components/icons';

/**
 * Tela de consulta de totais: KPIs gerais (receitas, despesas, saldo líquido)
 * e uma tabela com os totais individuais de cada pessoa + linha de total geral.
 */
export function TotaisPage() {
  const [resumo, setResumo] = useState<ResumoTotais | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      setResumo(await totaisApi.obter());
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  // Classe de cor para o saldo (positivo em verde, negativo em vermelho).
  const classeSaldo = (valor: number) => (valor < 0 ? 'amount--neg' : 'amount--pos');

  return (
    <>
      <CabecalhoPagina
        titulo="Totais"
        subtitulo="Consolidação de receitas, despesas e saldos por pessoa."
      />

      <div className="page">
        {erro && <Alerta tipo="erro">{erro}</Alerta>}

        {resumo && (
          <>
            {/* KPIs gerais */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-card__top">
                  <span className="kpi-card__label">Total de receitas</span>
                  <span className="kpi-card__icon kpi-card__icon--receita">
                    <IconeSetaCima />
                  </span>
                </div>
                <span className="kpi-card__value amount--receita">
                  {formatarMoeda(resumo.totalReceitas)}
                </span>
              </div>

              <div className="kpi-card">
                <div className="kpi-card__top">
                  <span className="kpi-card__label">Total de despesas</span>
                  <span className="kpi-card__icon kpi-card__icon--despesa">
                    <IconeSetaBaixo />
                  </span>
                </div>
                <span className="kpi-card__value amount--despesa">
                  {formatarMoeda(resumo.totalDespesas)}
                </span>
              </div>

              <div className="kpi-card">
                <div className="kpi-card__top">
                  <span className="kpi-card__label">Saldo líquido</span>
                  <span className="kpi-card__icon kpi-card__icon--saldo">
                    <IconeCarteira />
                  </span>
                </div>
                <span className={`kpi-card__value ${classeSaldo(resumo.saldoLiquido)}`}>
                  {formatarMoeda(resumo.saldoLiquido)}
                </span>
              </div>
            </div>

            {/* Totais por pessoa */}
            <section className="card">
              <div className="card__header">
                <h2 className="card__title">Totais por pessoa</h2>
                <p className="card__desc">
                  Receitas, despesas e saldo (receitas − despesas) de cada pessoa.
                </p>
              </div>

              {resumo.pessoas.length === 0 ? (
                <EstadoVazio
                  icone={<IconeTotais />}
                  titulo="Nada para consolidar ainda"
                  texto="Cadastre pessoas e transações para visualizar os totais."
                />
              ) : (
                <div className="table-wrap">
                  <table className="table table--responsive">
                    <thead>
                      <tr>
                        <th>Pessoa</th>
                        <th className="num">Receitas</th>
                        <th className="num">Despesas</th>
                        <th className="num">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumo.pessoas.map((pessoa) => (
                        <tr key={pessoa.pessoaId}>
                          <td className="cell-strong" data-label="Pessoa">
                            <span className="table__value">{pessoa.nome}</span>
                          </td>
                          <td className="num amount amount--receita" data-label="Receitas">
                            <span className="table__value">
                              {formatarMoeda(pessoa.totalReceitas)}
                            </span>
                          </td>
                          <td className="num amount amount--despesa" data-label="Despesas">
                            <span className="table__value">
                              {formatarMoeda(pessoa.totalDespesas)}
                            </span>
                          </td>
                          <td
                            className={`num amount ${classeSaldo(pessoa.saldo)}`}
                            data-label="Saldo"
                          >
                            <span className="table__value">{formatarMoeda(pessoa.saldo)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td data-label="Resumo">
                          <span className="table__value">Total geral</span>
                        </td>
                        <td className="num amount--receita" data-label="Receitas">
                          <span className="table__value">
                            {formatarMoeda(resumo.totalReceitas)}
                          </span>
                        </td>
                        <td className="num amount--despesa" data-label="Despesas">
                          <span className="table__value">
                            {formatarMoeda(resumo.totalDespesas)}
                          </span>
                        </td>
                        <td
                          className={`num ${classeSaldo(resumo.saldoLiquido)}`}
                          data-label="Saldo"
                        >
                          <span className="table__value">
                            {formatarMoeda(resumo.saldoLiquido)}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
