import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const Square = ({value, onClick}) => (
    <button
        className="square"
        onClick={() => onClick()}
    >
        {value}
    </button>
);

function Board({squares, onClick}) {
    function renderSquare(i) {
        return (
            <Square
                value={squares[i]}
                onClick={() => onClick(i)}
            />
        );
    }

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}{renderSquare(1)}{renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}{renderSquare(4)}{renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}{renderSquare(7)}{renderSquare(8)}
            </div>
        </div>
    );
}

function Game() {
    const [history, setHistory] = useState([{
        squares: Array(9).fill(null),
    }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);

    function jumpTo(step) {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }

    const current = history[stepNumber];
    const winner = winnerIs(current.squares);
    const status = winner
        ? 'Winner: ' + winner
        : 'Next player: ' + (xIsNext ? 'X' : 'O');

    useEffect(function updateTitle() {
        document.title = status;
    }, [status]);

    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    function makeMove(i) {
        const newHistory = history.slice(0, stepNumber + 1);
        const current = newHistory[newHistory.length - 1];
        const squares = current.squares.slice();
        if (winnerIs(squares) || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? 'X' : 'O';
        setHistory(newHistory.concat([{
            squares: squares,
        }]));
        setStepNumber(newHistory.length);
        setXIsNext(!xIsNext);
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => makeMove(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function winnerIs(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
