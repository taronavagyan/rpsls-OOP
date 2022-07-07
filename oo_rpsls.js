const readline = require(`readline-sync`);

const WINNING_COMBOS = {
  rock: ["lizard", "scissors"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["spock", "paper"],
  spock: ["scissors", "rock"],
};

const RPSGAME = {
  human: createHuman(),
  computer: createComputer(),
  matchLength: 0,

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.resetGame();
      this.updateMatchLength();
      console.clear();
      while (this.getLeadingScore() < this.matchLength) {
        this.human.choose();
        this.computer.choose();
        this.improveComputerPlay();
        console.clear();
        this.displayWinner();
        this.displayScore();
      }
      if (!this.playAgain()) break;
    }
    this.displayGoodbyeMessage();
  },

  resetGame() {
    this.human.resetPlay();
    this.computer.resetPlay();
  },

  getLeadingScore() {
    return this.human.score > this.computer.score
      ? this.human.score
      : this.computer.score;
  },

  updateMatchLength() {
    while (true) {
      let matchLength = Number(
        readline.question("How many points does the winner need to score? ")
      );
      if (Number.isInteger(matchLength) && matchLength > 0) {
        this.matchLength = matchLength;
        break;
      }
      console.log("Please enter an integer greater than 0.");
    }
  },

  improveComputerPlay() {
    let counterMove = Object.keys(WINNING_COMBOS).find((move) =>
      WINNING_COMBOS[move].includes(this.human.move)
    );
    this.computer.choices.push(counterMove);
  },
  displayWelcomeMessage() {
    console.log(`Welcome to Rock, Paper, Scissors, Lizard, Spock! Have fun!`);
  },

  displayGoodbyeMessage() {
    console.log(
      `Thanks for playing Rock, Paper, Scissors, Lizard, Spock. Goodbye!`
    );
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;
    let humanWon = WINNING_COMBOS[humanMove].includes(computerMove);
    console.log(`You chose: ${humanMove}`);
    console.log(`Computer chose: ${computerMove}`);

    if (humanWon) {
      this.human.score += 1;
      console.log("You win!");
    } else if (humanMove === computerMove) {
      console.log("It's a tie!");
    } else {
      this.computer.score += 1;
      console.log("Computer wins!");
    }
  },

  displayScore() {
    console.log("------");
    console.log("Score:");
    console.log("------");
    console.log(`You: ${this.human.score} Computer: ${this.computer.score}`);
  },

  playAgain() {
    console.log("Would you like to play again? (y/n)");
    let answer = readline.question();
    return answer.toLowerCase()[0] === "y";
  },
};

RPSGAME.play();

function createPlayer() {
  return {
    move: null,
    moveHistory: [],
    score: 0,
    choices: Object.keys(WINNING_COMBOS),

    countWin() {
      this.score += 1;
    },

    resetPlay() {
      this.score = 0;
      this.moveHistory = [];
      this.choices = Object.keys(WINNING_COMBOS);
    },

    updateMoveHistory(move) {
      this.moveHistory.push(move);
    },
  };
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;
      while (true) {
        console.log("Please choose rock, paper, scissors, lizard, or spock:");
        choice = readline.question();
        if (this.choices.includes(choice)) break;
        console.log("Sorry, invalid choice.");
      }

      this.move = choice;
      this.updateMoveHistory(choice);
    },
  };

  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      let randomIndex = Math.floor(Math.random() * this.choices.length);
      let choice = this.choices[randomIndex];
      this.move = choice;
      this.updateMoveHistory(choice);
    },
  };

  return Object.assign(playerObject, computerObject);
}
