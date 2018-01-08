import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';


function Square(props) {
  return props.highlight ? 
  (
    <button className="square" onClick={props.onClick}>
      <mark> {props.value} </mark>
    </button>
  ) : 
  (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/*
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}
*/

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square key={i}
        highlight={this.props.winSquares.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {[0,1,2].map(row => 
          <div key={row} className="board-row">
            {[0,1,2].map(col => this.renderSquare(row * 3 + col))}
          </div>
        )}
        
        {/*
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        */}
      </div>
    );
  }
}



class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares : Array(9).fill(null),
        move: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      showAscend: true,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext : (step % 2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();

    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        move: i,
      }]),
      stepNumber : this.state.stepNumber + 1,
      xIsNext: !this.state.xIsNext,
    });
  }

  toggleOrder() {
    this.setState({
      showAscend: !this.state.showAscend,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const [winner, winSquares] = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((state, step) => {
      let desc = step ? 
        `step # ${step}: (${Math.floor(state.move / 3)}, ${state.move % 3})` : 
        "game start";
      desc = step === this.state.stepNumber ? 
        <b> {desc} </b> :
        desc;

      return (
        <li key={step}>
          <button onClick={() => this.jumpTo(step)}> {desc} </button>
        </li>
      );
    });

    if (!this.state.showAscend) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winSquares={winSquares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.toggleOrder()}> toggle order </button>
          </div>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}


function calculateWinner(squares) {
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
      return [squares[a], lines[i]];
    }
  }
  return [null, []];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
