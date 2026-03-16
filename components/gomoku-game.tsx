"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface GomokuGameProps {
  accentColor: string
}

type Player = "black" | "white"
type Cell = Player | null

const BOARD_SIZE = 15

export function GomokuGame({ accentColor }: GomokuGameProps) {
  const [board, setBoard] = useState<Cell[][]>(() =>
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  )
  const [currentPlayer, setCurrentPlayer] = useState<Player>("black")
  const [winner, setWinner] = useState<Player | "draw" | null>(null)
  const [winningLine, setWinningLine] = useState<[number, number][]>([])
  const [lastMove, setLastMove] = useState<[number, number] | null>(null)
  const [isThinking, setIsThinking] = useState(false)

  // 检查获胜
  const checkWin = useCallback((board: Cell[][], row: number, col: number, player: Player): [number, number][] | null => {
    const directions = [
      [[0, 1], [0, -1]], // 水平
      [[1, 0], [-1, 0]], // 垂直
      [[1, 1], [-1, -1]], // 对角线
      [[1, -1], [-1, 1]], // 反对角线
    ]

    for (const [[dr1, dc1], [dr2, dc2]] of directions) {
      const line: [number, number][] = [[row, col]]

      let r = row + dr1, c = col + dc1
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        line.push([r, c])
        r += dr1
        c += dc1
      }

      r = row + dr2
      c = col + dc2
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        line.push([r, c])
        r += dr2
        c += dc2
      }

      if (line.length >= 5) {
        return line
      }
    }
    return null
  }, [])

  const checkDraw = useCallback((board: Cell[][]): boolean => {
    return board.every(row => row.every(cell => cell !== null))
  }, [])

  const aiMove = useCallback((board: Cell[][]): [number, number] => {
    // 1. 检查是否能赢
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] === null) {
          const testBoard = board.map(row => [...row])
          testBoard[r][c] = "white"
          if (checkWin(testBoard, r, c, "white")) {
            return [r, c]
          }
        }
      }
    }

    // 2. 阻止玩家赢
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] === null) {
          const testBoard = board.map(row => [...row])
          testBoard[r][c] = "black"
          if (checkWin(testBoard, r, c, "black")) {
            return [r, c]
          }
        }
      }
    }

    // 3. 进攻策略
    let bestMove: [number, number] | null = null
    let bestScore = -1

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] === null) {
          let score = 0
          const centerDist = Math.abs(r - 7) + Math.abs(c - 7)
          score += (14 - centerDist) * 10

          const neighbors = [
            [r - 1, c - 1], [r - 1, c], [r - 1, c + 1],
            [r, c - 1], [r, c + 1],
            [r + 1, c - 1], [r + 1, c], [r + 1, c + 1],
          ]
          for (const [nr, nc] of neighbors) {
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] !== null) {
              score += 50
            }
          }

          if (score > bestScore) {
            bestScore = score
            bestMove = [r, c]
          }
        }
      }
    }

    return bestMove || [7, 7]
  }, [checkWin])

  const handleCellClick = useCallback((row: number, col: number) => {
    if (board[row][col] !== null || winner || currentPlayer !== "black" || isThinking) {
      return
    }

    const newBoard = board.map(r => [...r])
    newBoard[row][col] = "black"
    setBoard(newBoard)
    setLastMove([row, col])

    const winLine = checkWin(newBoard, row, col, "black")
    if (winLine) {
      setWinner("black")
      setWinningLine(winLine)
      return
    }

    if (checkDraw(newBoard)) {
      setWinner("draw")
      return
    }

    setCurrentPlayer("white")
    setIsThinking(true)

    setTimeout(() => {
      const [aiR, aiC] = aiMove(newBoard)
      const aiBoard = newBoard.map(r => [...r])
      aiBoard[aiR][aiC] = "white"
      setBoard(aiBoard)
      setLastMove([aiR, aiC])

      const aiWinLine = checkWin(aiBoard, aiR, aiC, "white")
      if (aiWinLine) {
        setWinner("white")
        setWinningLine(aiWinLine)
        setIsThinking(false)
        return
      }

      if (checkDraw(aiBoard)) {
        setWinner("draw")
        setIsThinking(false)
        return
      }

      setCurrentPlayer("black")
      setIsThinking(false)
    }, 500)
  }, [board, winner, currentPlayer, isThinking, checkWin, checkDraw, aiMove])

  const resetGame = useCallback(() => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)))
    setCurrentPlayer("black")
    setWinner(null)
    setWinningLine([])
    setLastMove(null)
    setIsThinking(false)
  }, [])

  // 对外暴露重置方法
  if (typeof window !== 'undefined') {
    (window as any).resetGomokuGame = resetGame
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* 黑白方标注 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          padding: "8px 16px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#1a1a1a",
              border: "2px solid #444",
              boxShadow: currentPlayer === "black" ? `0 0 8px ${accentColor}` : "none",
            }}
          />
          <span style={{ color: "white", fontSize: 13 }}>你（黑）</span>
          {currentPlayer === "black" && !winner && (
            <span style={{ color: accentColor, fontSize: 11 }}>●</span>
          )}
        </div>

        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>VS</span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "white",
              border: "2px solid #ddd",
              boxShadow: currentPlayer === "white" ? `0 0 8px ${accentColor}` : "none",
            }}
          />
          <span style={{ color: "white", fontSize: 13 }}>小思（白）</span>
          {currentPlayer === "white" && !winner && (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ color: accentColor, fontSize: 11 }}
            >
              思考中...
            </motion.span>
          )}
        </div>
      </div>

      {/* 棋盘 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 8,
        }}
      >
        <div
          style={{
            position: "relative",
            background: "#DEB887",
            borderRadius: 6,
            padding: 6,
          }}
        >
          <svg
            width={BOARD_SIZE * 20}
            height={BOARD_SIZE * 20}
            style={{ display: "block" }}
          >
            {Array.from({ length: BOARD_SIZE }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1={10}
                y1={10 + i * 20}
                x2={10 + (BOARD_SIZE - 1) * 20}
                y2={10 + i * 20}
                stroke="#8B4513"
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: BOARD_SIZE }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={10 + i * 20}
                y1={10}
                x2={10 + i * 20}
                y2={10 + (BOARD_SIZE - 1) * 20}
                stroke="#8B4513"
                strokeWidth={1}
              />
            ))}
            {[[3, 3], [3, 11], [7, 7], [11, 3], [11, 11]].map(([r, c]) => (
              <circle
                key={`star-${r}-${c}`}
                cx={10 + c * 20}
                cy={10 + r * 20}
                r={2.5}
                fill="#8B4513"
              />
            ))}
          </svg>

          {/* 棋子层 */}
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              width: BOARD_SIZE * 20,
              height: BOARD_SIZE * 20,
            }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                if (!cell) return null
                const isWinning = winningLine.some(([wr, wc]) => wr === r && wc === c)
                const isLast = lastMove?.[0] === r && lastMove?.[1] === c

                return (
                  <motion.div
                    key={`${r}-${c}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: "absolute",
                      left: c * 20,
                      top: r * 20,
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: cell === "black" ? "#1a1a1a" : "white",
                        border: `1px solid ${cell === "black" ? "#444" : "#ccc"}`,
                        boxShadow: isWinning
                          ? `0 0 10px ${accentColor}`
                          : isLast
                          ? `0 0 6px ${accentColor}`
                          : "1px 1px 2px rgba(0,0,0,0.3)",
                      }}
                    />
                  </motion.div>
                )
              })
            )}
          </div>

          {/* 点击层 */}
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              width: BOARD_SIZE * 20,
              height: BOARD_SIZE * 20,
              display: "grid",
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, 20px)`,
            }}
          >
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
              const r = Math.floor(i / BOARD_SIZE)
              const c = i % BOARD_SIZE
              return (
                <div
                  key={`cell-${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  style={{
                    cursor: board[r][c] || winner || isThinking ? "default" : "pointer",
                    background: "transparent",
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* 获胜提示 */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              padding: "12px 16px",
              background: "rgba(0,0,0,0.8)",
              borderRadius: 12,
              border: `1px solid ${accentColor}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, color: accentColor, marginBottom: 4 }}>
              {winner === "black" ? "你赢了！" : winner === "white" ? "小思赢了！" : "平局！"}
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 8 }}>
              {winner === "black"
                ? "太厉害了！"
                : winner === "white"
                ? "别灰心！"
                : "势均力敌！"}
            </p>
            <button
              onClick={resetGame}
              style={{
                padding: "6px 16px",
                borderRadius: 16,
                background: accentColor,
                border: "none",
                color: "white",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              再来一局
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
