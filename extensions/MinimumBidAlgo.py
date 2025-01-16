import numpy as np

class MultiArmedBandit:
    def __init__(self, n_arms, epsilon=0.1):
        self.n_arms = n_arms
        self.epsilon = epsilon
        self.counts = np.zeros(n_arms)  # Number of times each arm was pulled
        self.values = np.zeros(n_arms)  # Estimated value of each arm

    def select_arm(self):
        """Selects an arm to pull using epsilon-greedy strategy."""
        if np.random.rand() > self.epsilon:
            # Exploitation: choose the arm with the highest estimated value
            return np.argmax(self.values)
        else:
            # Exploration: choose a random arm
            return np.random.randint(0, self.n_arms)

    def update(self, chosen_arm, reward):
        """Updates the value estimate of the chosen arm based on the observed reward."""
        self.counts[chosen_arm] += 1
        n = self.counts[chosen_arm]
        value = self.values[chosen_arm]
        # Incremental update formula for average
        self.values[chosen_arm] = ((n - 1) / float(n)) * value + (1 / float(n)) * reward

# Example usage
if __name__ == "__main__":
    n_arms = 3  # Example: 3 different minimum bid prices
    mab = MultiArmedBandit(n_arms)

    # Simulated rewards (e.g., user engagement or participation)
    rewards = [[1, 0, 0, 1, 1], [0, 1, 1, 0, 0], [1, 1, 1, 1, 0]]  # Rewards for each arm over time

    for i in range(100):  # Simulate 100 rounds of bidding
        chosen_arm = mab.select_arm()
        reward = rewards[chosen_arm][np.random.randint(0, len(rewards[chosen_arm]))]
        mab.update(chosen_arm, reward)

        print(f"Round {i+1}: Chosen arm = {chosen_arm}, Reward = {reward}")
        print(f"Updated values: {mab.values}\n")

    # After many rounds, the system will have adjusted the minimum bidding price dynamically
    optimal_bid_price = np.argmax(mab.values)
    print(f"The optimal bid price is associated with arm {optimal_bid_price}")
