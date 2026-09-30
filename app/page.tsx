'use client';

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Lightbulb, Eraser } from 'lucide-react';

const PUZZLES = {
  easy: {
    initial: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
    solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
  },
  medium: {
    initial: "295743861431865927876192543387459216612387495549216378158674932723951684964128759",
    solution: "295743861431865927876192543387459216612387495549216378158674932723951684964128759"
  },
  hard: {
    initial: "800000000003600000070090200050007000000045700000100030001000068008500010090000400",
    solution: "827154396965327148341689752593468217472513986618972435786235194154796823239841567"
  }
};

export default function SudokuGenZ() {
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  // Lazy initial state untuk menghindari setState di dalam useEffect
  const [initial, setInitial] = useState<number[]>(() => PUZZLES.easy.initial.split('').map(Number));
  const [board, setBoard] = useState<number[]>(() => PUZZLES.easy.initial.split('').map(Number));
  const [solution, setSolution] = useState<number[]>(() => PUZZLES.easy.solution.split('').map(Number));
  
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [statusMsg, setStatusMsg] = useState<string>('Yuk, pecahkan puzlenya! ✨');

  const startNewGame = useCallback((selectedLevel: 'easy' | 'medium' | 'hard') => {
    const puzzle = PUZZLES[selectedLevel];
    const initArr = puzzle.initial.split('').map(Number);
    const solArr = puzzle.solution.split('').map(Number);

    setLevel(selectedLevel);
    setInitial(initArr);
    setBoard([...initArr]);
    setSolution(solArr);
    setSelectedCell(null);
    setHintsLeft(3);
    setStatusMsg('Skenario baru dimulai! Semangat 🚀');
  }, []);

  const checkWinCondition = useCallback((currentBoard: number[]) => {
    if (currentBoard.includes(0)) return;

    if (currentBoard.join('') === solution.join('')) {
      setStatusMsg('SLAYYY! 🎉 Kamu berhasil selesaikan Sudoku!');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      setStatusMsg('Waduh, ada angka yang masih belum klop nih! 🤔');
    }
  }, [solution]);

  const handleNumberInput = useCallback((num: number) => {
    if (selectedCell === null) {
      setStatusMsg('Pilih kotaknya dulu dong, Bestie! 🫣');
      return;
    }
    if (initial[selectedCell] !== 0) {
      setStatusMsg('Kotak itu bawaan soal, gabisa diganti ya! ❌');
      return;
    }

    const newBoard = [...board];
    newBoard[selectedCell] = num;
    setBoard(newBoard);
    checkWinCondition(newBoard);
  }, [selectedCell, initial, board, checkWinCondition]);

  const handleErase = useCallback(() => {
    if (selectedCell === null || initial[selectedCell] !== 0) return;
    const newBoard = [...board];
    newBoard[selectedCell] = 0;
    setBoard(newBoard);
  }, [selectedCell, initial, board]);

  // Support Keyboard Laptop (1-9 dan Backspace/Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberInput, handleErase]);

  const handleHint = () => {
    if (hintsLeft <= 0) {
      setStatusMsg('Aaa, kuota Hint kamu udah habis! 😢');
      return;
    }
    if (selectedCell === null) {
      setStatusMsg('Klik kotak kosong yang mau dibantu dulu! 💡');
      return;
    }
    if (initial[selectedCell] !== 0) return;

    const correctVal = solution[selectedCell];
    const newBoard = [...board];
    newBoard[selectedCell] = correctVal;
    setBoard(newBoard);
    setHintsLeft(hintsLeft - 1);
    setStatusMsg('Nih dikasih bocoran 1 angka! 😉');
    checkWinCondition(newBoard);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans select-none relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-600/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent flex items-center gap-2 tracking-wide">
              SUDOKU <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-400 font-medium">Gen-Z Brain Workout 🧠✨</p>
          </div>

          {/* Level Switcher */}
          <div className="flex gap-1 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/50">
            {(['easy', 'medium', 'hard'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => startNewGame(lvl)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all duration-200 ${
                  level === lvl
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-pink-500/25 scale-105'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl === 'easy' ? 'Santai' : lvl === 'medium' ? 'Serius' : 'Hardcore'}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center mb-4 text-xs font-semibold">
          <button
            onClick={handleHint}
            className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-2 rounded-2xl transition-all active:scale-95"
          >
            <Lightbulb className="w-4 h-4" /> Hint ({hintsLeft})
          </button>
          
          <button
            onClick={() => startNewGame(level)}
            className="flex items-center gap-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-2 rounded-2xl transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" /> Acak Soal
          </button>
        </div>

        {/* 9x9 Sudoku Board Grid */}
        <div className="grid grid-cols-9 gap-1 bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/60 shadow-inner mb-5">
          {board.map((val, idx) => {
            const isInitial = initial[idx] !== 0;
            const isSelected = selectedCell === idx;
            const row = Math.floor(idx / 9);
            const col = idx % 9;

            const borderRight = col % 3 === 2 && col !== 8 ? 'mr-1' : '';
            const borderBottom = row % 3 === 2 && row !== 8 ? 'mb-1' : '';

            return (
              <button
                key={idx}
                onClick={() => setSelectedCell(idx)}
                className={`aspect-square flex items-center justify-center font-extrabold text-base rounded-xl transition-all duration-150 ${borderRight} ${borderBottom} ${
                  isSelected
                    ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white scale-110 shadow-lg shadow-pink-500/50 z-20 ring-2 ring-white'
                    : isInitial
                    ? 'bg-slate-800 text-slate-100 font-black'
                    : val !== 0
                    ? 'bg-slate-700/80 text-cyan-300 font-black'
                    : 'bg-slate-900/60 hover:bg-slate-800/60 text-transparent'
                }`}
              >
                {val !== 0 ? val : ''}
              </button>
            );
          })}
        </div>

        {/* Keypad Inputs */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              className="bg-slate-800/80 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white border border-slate-700/80 text-purple-300 font-black py-3 rounded-2xl text-lg transition-all active:scale-95 shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleErase}
            className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold py-3 rounded-2xl text-xs flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95"
          >
            <Eraser className="w-4 h-4" /> Hapus
          </button>
        </div>

        {/* Status Bar */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 text-center">
          <p className="text-xs font-semibold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
            {statusMsg}
          </p>
        </div>

      </div>
    </div>
  );
}