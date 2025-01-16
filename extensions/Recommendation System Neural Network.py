#!/usr/bin/env python
# coding: utf-8

# ## Recommendation System using Neural Network

# In[6]:


import numpy as np


# ### Define the Neural Network

# In[7]:


class RecommendationSystem:
    def __init__(self, input_size, hidden_size, output_size):
        # Initialize weights
        self.weights_input_hidden = np.random.rand(input_size, hidden_size)
        self.weights_hidden_output = np.random.rand(hidden_size, output_size)
        self.learning_rate = 0.1

    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

    def sigmoid_derivative(self, x):
        return x * (1 - x)

    def forward(self, inputs):
        # Forward pass
        self.hidden_layer_input = np.dot(inputs, self.weights_input_hidden)
        self.hidden_layer_output = self.sigmoid(self.hidden_layer_input)

        self.output_layer_input = np.dot(self.hidden_layer_output, self.weights_hidden_output)
        self.output = self.sigmoid(self.output_layer_input)
        return self.output

    def backward(self, inputs, actual_output, predicted_output):
        # Backpropagation
        error = actual_output - predicted_output
        d_output = error * self.sigmoid_derivative(predicted_output)

        error_hidden_layer = d_output.dot(self.weights_hidden_output.T)
        d_hidden_layer = error_hidden_layer * self.sigmoid_derivative(self.hidden_layer_output)

        # Update weights
        self.weights_hidden_output += self.hidden_layer_output.T.dot(d_output) * self.learning_rate
        self.weights_input_hidden += inputs.T.dot(d_hidden_layer) * self.learning_rate

    def train(self, inputs, actual_output, epochs=1000):
        for _ in range(epochs):
            predicted_output = self.forward(inputs)
            self.backward(inputs, actual_output, predicted_output)


# ### Prepare training data

# In[8]:


def prepare_data():
    # Residents and products
    residents = ["John", "Alice", "Bob"]
    products = ["Product A", "Product B", "Product C"]

    # User purchase history (input matrix)
    # Rows: Residents, Columns: Products (1 = purchased, 0 = not purchased)
    user_data = np.array([
        [1, 0, 1],  # John bought Product A and Product C
        [1, 1, 0],  # Alice bought Product A and Product B
        [0, 1, 1]   # Bob bought Product B and Product C
    ])

    # Product preferences (output matrix)
    # Rows: Residents, Columns: Products
    preferences = np.array([
        [0, 1, 0],  # Recommend Product B to John
        [0, 0, 1],  # Recommend Product C to Alice
        [1, 0, 0]   # Recommend Product A to Bob
    ])

    return user_data, preferences, residents, products


# ### Implementing Recommendation System for Users

# In[11]:


def get_recommendations(network, user_data, user_index, products):
    predictions = network.forward(user_data[user_index].reshape(1, -1))
    recommendations = [(products[i], predictions[0][i]) for i in range(len(products))]
    recommendations.sort(key=lambda x: x[1], reverse=True)  # Sort by prediction score
    return recommendations


# ### Main function to visualise the code

# In[5]:


def main():
    print("### Recommendation System for Residents ###")
    
    # Prepare data
    user_data, preferences, residents, products = prepare_data()

    # Initialize and train the neural network
    input_size = user_data.shape[1]
    hidden_size = 5  # Arbitrary number of hidden neurons
    output_size = preferences.shape[1]

    network = RecommendationSystem(input_size, hidden_size, output_size)
    print("\nTraining the recommendation model...")
    network.train(user_data, preferences, epochs=5000)
    print("Training completed.")

    # Get user input for recommendations
    print("\nResidents:")
    for i, resident in enumerate(residents):
        print(f"{i + 1}. {resident}")
    
    user_choice = int(input("\nSelect a resident (1-3): ")) - 1
    if user_choice < 0 or user_choice >= len(residents):
        print("Invalid choice. Exiting...")
        return

    recommendations = get_recommendations(network, user_data, user_choice, products)
    print(f"\nRecommendations for {residents[user_choice]}:")
    for product, score in recommendations:
        print(f"{product}: {score:.2f}")

if __name__ == "__main__":
    main()


# ### Output
# 
# Neural Network with Weighted Inputs: Demonstrates the learning process and how weights adjust to improve recommendations.
# 
# User Interaction: Allows real-time input to see personalized recommendations for any resident.
# 
# Scalability: Easily extendable to include more residents, products, or features.
