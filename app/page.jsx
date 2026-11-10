"use client";

import { useState, useEffect } from "react";
import "./globals.css";

export default function TodoList() {
  const [tarefas, setTarefas] = useState([]);
  const [textoDigitado, setTextoDigitado] = useState("");
  const [filtroAtual, setFiltroAtual] = useState("todas");

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("minhasTarefas");
    if (tarefasSalvas) {
      setTarefas(JSON.parse(tarefasSalvas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("minhasTarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const handleAdicionarTarefa = (evento) => {
    evento.preventDefault();

    if (textoDigitado.trim() === "") return;

    const novaTarefa = {
      id: Date.now(),
      texto: textoDigitado,
      concluida: false,
    };

    setTarefas([...tarefas, novaTarefa]);
    setTextoDigitado("");
  };

  const handleAlternarStatus = (id) => {
    const listaAtualizada = tarefas.map((tarefa) => {
      if (tarefa.id === id) {
        return { ...tarefa, concluida: !tarefa.concluida };
      }
      return tarefa;
    });
    setTarefas(listaAtualizada);
  };

  const handleExcluirTarefa = (id) => {
    const listaSemExcluida = tarefas.filter((tarefa) => tarefa.id !== id);
    setTarefas(listaSemExcluida);
  };

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtroAtual === "pendentes") return !tarefa.concluida;
    if (filtroAtual === "concluidas") return tarefa.concluida;
    return true;
  });

  return (
    <div className="container">
      <div className="card">
        <h1>Minha Lista de Tarefas</h1>

        <form onSubmit={handleAdicionarTarefa} className="formulario">
          <input
            type="text"
            placeholder="O que precisa ser feito?"
            value={textoDigitado}
            onChange={(e) => setTextoDigitado(e.target.value)}
          />
          <button type="submit">Adicionar</button>
        </form>

        <div className="controles">
          <span className="contador">Total: {tarefas.length} tarefas</span>

          <div className="filtros">
            <button
              className={filtroAtual === "todas" ? "ativo" : ""}
              onClick={() => setFiltroAtual("todas")}
            >
              Todas
            </button>
            <button
              className={filtroAtual === "pendentes" ? "ativo" : ""}
              onClick={() => setFiltroAtual("pendentes")}
            >
              Pendentes
            </button>
            <button
              className={filtroAtual === "concluidas" ? "ativo" : ""}
              onClick={() => setFiltroAtual("concluidas")}
            >
              Concluídas
            </button>
          </div>
        </div>

        <ul className="lista">
          {tarefasFiltradas.length === 0 ? (
            <p className="mensagem-vazia">Nenhuma tarefa encontrada.</p>
          ) : (
            tarefasFiltradas.map((tarefa) => (
              <li
                key={tarefa.id}
                className={
                  tarefa.concluida ? "item-concluido" : "item-pendente"
                }
              >
                <div className="tarefa-conteudo">
                  <input
                    type="checkbox"
                    checked={tarefa.concluida}
                    onChange={() => handleAlternarStatus(tarefa.id)}
                  />
                  <span>{tarefa.texto}</span>
                </div>
                <button
                  className="btn-excluir"
                  onClick={() => handleExcluirTarefa(tarefa.id)}
                >
                  Excluir
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
