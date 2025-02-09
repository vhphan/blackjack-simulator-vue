export const suits = ['♠️', '♥️', '♦️', '♣️'];
export const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck(numDecks = 1) {
  const deck = [];
  for (let i = 0; i < numDecks; i++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }
  }
  return deck;
}

export function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function calculateTotal(hand) {
  let total = 0
  let aces = 0

  hand.forEach(card => {
    if (card.rank === 'A') {
      aces += 1
      total += 11
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      total += 10
    } else {
      total += parseInt(card.rank)
    }
  })

  while (total > 21 && aces > 0) {
    total -= 10
    aces -= 1
  }

  return total
}

export function determineResultForPlayer(dealerTotalValue, playerTotalValue) {
  if (playerTotalValue > 21) {
    return 'lose' // Player loses
  } else if (dealerTotalValue > 21 || playerTotalValue > dealerTotalValue) {
    return 'win' // Player wins
  } else if (playerTotalValue < dealerTotalValue) {
    return 'lose' // Player loses
  } else {
    return 'tie' // It's a tie
  }
}