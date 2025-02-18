// Combined strategy table for hard and soft totals
const blackjackStrategy = {
    hard: {
        21: { 2: "S", 3: "S", 4: "S", 5: "S", 6: "S", 7: "S", 8: "S", 9: "S", 10: "S", A: "S" },
        20: { 2: "S", 3: "S", 4: "S", 5: "S", 6: "S", 7: "S", 8: "S", 9: "S", 10: "S", A: "S" },
        19: { 2: "S", 3: "S", 4: "S", 5: "S", 6: "S", 7: "S", 8: "S", 9: "S", 10: "S", A: "S" },
        18: { 2: "S", 3: "S", 4: "S", 5: "S", 6: "S", 7: "S", 8: "S", 9: "S", 10: "S", A: "S" },
        17: { 2: "S", 3: "S", 4: "S", 5: "S", 6: "S", 7: "S", 8: "S", 9: "S", 10: "S", A: "S" },
        16: { 2: "S", 3: "S", 4: "S", 5: "S", 6: "S", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        15: { 2: "S", 3: "S", 4: "S", 5: "S", 6: "S", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        14: { 2: "S", 3: "S", 4: "S", 5: "S", 6: "S", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        13: { 2: "S", 3: "S", 4: "S", 5: "S", 6: "S", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        12: { 2: "H", 3: "H", 4: "S", 5: "S", 6: "S", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        11: { 2: "D", 3: "D", 4: "D", 5: "D", 6: "D", 7: "D", 8: "D", 9: "D", 10: "D", A: "D" },
        10: { 2: "D", 3: "D", 4: "D", 5: "D", 6: "D", 7: "D", 8: "D", 9: "D", 10: "H", A: "H" },
        9: { 2: "H", 3: "D", 4: "D", 5: "D", 6: "D", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        8: { 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        7: { 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        6: { 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        5: { 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        4: { 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        3: { 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        2: { 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
    },
    soft: {
        "A,9": { 2: "S", 3: "S", 4: "S", 5: "S", 6: "S", 7: "S", 8: "S", 9: "S", 10: "S", A: "S" },
        "A,8": { 2: "S", 3: "S", 4: "S", 5: "S", 6: "S", 7: "S", 8: "S", 9: "S", 10: "S", A: "S" },
        "A,7": { 2: "Ds", 3: "Ds", 4: "Ds", 5: "Ds", 6: "Ds", 7: "S", 8: "S", 9: "H", 10: "H", A: "H" },
        "A,6": { 2: "H", 3: "D", 4: "D", 5: "D", 6: "D", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        "A,5": { 2: "H", 3: "H", 4: "D", 5: "D", 6: "D", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        "A,4": { 2: "H", 3: "H", 4: "D", 5: "D", 6: "D", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        "A,3": { 2: "H", 3: "H", 4: "H", 5: "D", 6: "D", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        "A,2": { 2: "H", 3: "H", 4: "H", 5: "D", 6: "D", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" },
        "A,A": { 2: "H", 3: "H", 4: "H", 5: "D", 6: "D", 7: "H", 8: "H", 9: "H", 10: "H", A: "H" }, // until split is implemented, modify later
    },
    pairSplitting: {
        "A,A": { 2: "Y", 3: "Y", 4: "Y", 5: "Y", 6: "Y", 7: "Y", 8: "Y", 9: "Y", 10: "Y", A: "Y" },
        "T,T": { 2: "N", 3: "N", 4: "N", 5: "N", 6: "N", 7: "N", 8: "N", 9: "N", 10: "N", A: "N" },
        "9,9": { 2: "Y", 3: "Y", 4: "Y", 5: "Y", 6: "Y", 7: "N", 8: "Y", 9: "Y", 10: "N", A: "N" },
        "8,8": { 2: "Y", 3: "Y", 4: "Y", 5: "Y", 6: "Y", 7: "Y", 8: "Y", 9: "Y", 10: "Y", A: "Y" },
        "7,7": { 2: "Y", 3: "Y", 4: "Y", 5: "Y", 6: "Y", 7: "Y", 8: "N", 9: "N", 10: "N", A: "N" },
        "6,6": { 2: "Y", 3: "Y", 4: "Y", 5: "Y", 6: "Y", 7: "N", 8: "N", 9: "N", 10: "N", A: "N" },
        "5,5": { 2: "N", 3: "N", 4: "N", 5: "N", 6: "N", 7: "N", 8: "N", 9: "N", 10: "N", A: "N" },
        "4,4": { 2: "N", 3: "N", 4: "N", 5: "Y", 6: "Y", 7: "N", 8: "N", 9: "N", 10: "N", A: "N" },
        "3,3": { 2: "Y", 3: "Y", 4: "Y", 5: "Y", 6: "Y", 7: "N", 8: "N", 9: "N", 10: "N", A: "N" },
        "2,2": { 2: "Y", 3: "Y", 4: "Y", 5: "Y", 6: "Y", 7: "N", 8: "N", 9: "N", 10: "N", A: "N" }
    }
};

// Ds = Double if possible, otherwise stand
// H = Hit
// S = Stand
// D = Double if possible, otherwise hit


// Function to get the move for hard or soft totals
export function getBlackjackMove(playerHand, dealerUpcard, playerTotal) {

    if (playerTotal === 21) {
        return "S";
    }

    const upcard = dealerUpcard.rank === 'A' ? 'A' : dealerUpcard.rank;

    // Calculate player total
    let hasAce = false;
    playerHand.forEach(card => {
        if (card.rank === 'A') {
            hasAce = true;
        }
    });


    // if upcard is J, Q, K
    const upcardValue = (function () {
        if (upcard === 'J' || upcard === 'Q' || upcard === 'K') {
            return 10;
        }
        return upcard;
    })();

    let result;

    // Handle soft totals
    // New case: if player has 2 cards and both are aces
    if (playerHand.length === 2 && playerHand[0].rank === 'A' && playerHand[1].rank === 'A') {
        result = blackjackStrategy.soft['A,A']?.[upcardValue] || "Invalid"; // Until split is implemented, treat as hit

    } else if (hasAce && playerTotal < 21 && playerHand.length === 2) {
        result = blackjackStrategy.soft[`A,${playerTotal - 11}`]?.[upcardValue] || "Invalid";

    } else {
        // Handle hard totals
        result = blackjackStrategy.hard[playerTotal]?.[upcardValue] || "Invalid";

    }

    if (result === 'Invalid') {
        console.log(playerHand, dealerUpcard);
    }

    return result;

}

// Example usage:
// const playerHand = [{ rank: 'A', suit: '♠️' }, { rank: '7', suit: '♣️' }];
// const dealerUpcard = { rank: '3', suit: '♦️' };
// console.log(getBlackjackMove(playerHand, dealerUpcard)); // "Ds"
