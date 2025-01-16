#!/usr/bin/env python
# coding: utf-8

# ## Time-series forecasting (Prophet) for inventory management and restocking alerts

# In[2]:


from prophet import Prophet
import pandas as pd
import matplotlib.pyplot as plt


# ### Input historical sales data

# In[3]:


def input_historical_data():
    print("Enter historical sales data (date and number of items sold). Type 'done' to finish.")
    data = []
    while True:
        date = input("Enter date (YYYY-MM-DD): ")
        if date.lower() == 'done':
            break
        try:
            sales = int(input(f"Enter items sold on {date}: "))
            data.append({"ds": date, "y": sales})
        except ValueError:
            print("Invalid input. Please enter the correct format.")
    return pd.DataFrame(data)


# ### Train Prophet Model

# In[4]:


# Train Prophet model
def train_predictive_model(dataframe):
    model = Prophet()
    model.fit(dataframe)
    return model

# Predict future sales
def predict_future_sales(model, periods=7):
    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)
    print("\nFuture Predictions:")
    print(forecast[['ds', 'yhat']].tail(periods))
    return forecast

# Analyze restocking needs
def analyze_restocking(forecast, threshold):
    forecasted_demand = forecast[['ds', 'yhat']].tail(7)
    forecasted_demand['restock_needed'] = forecasted_demand['yhat'].apply(lambda x: x > threshold)
    print("\nRestocking Analysis:")
    print(forecasted_demand)
    return forecasted_demand


# ###  Visualise Analysed Data

# In[5]:


# Enhanced visualization
def visualize_forecast_with_analysis(model, forecast, threshold):
    fig, ax = plt.subplots(figsize=(10, 6))

    # Plot historical data
    model.plot(forecast, ax=ax)
    
    # Overlay low-stock threshold
    ax.axhline(y=threshold, color='red', linestyle='--', label='Low-Stock Threshold')
    
    # Highlight restocking days
    future_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(7)
    for i, row in future_data.iterrows():
        if row['yhat'] > threshold:
            ax.plot(row['ds'], row['yhat'], 'ro', label='Restock Needed' if 'Restock Needed' not in ax.get_legend_handles_labels()[1] else "")

    # Labels and legend
    ax.set_title("Sales Forecast and Restocking Analysis", fontsize=16)
    ax.set_xlabel("Date", fontsize=12)
    ax.set_ylabel("Predicted Sales", fontsize=12)
    ax.legend()
    plt.grid()

    plt.show()

    # Cumulative demand visualization
    cumulative_demand = future_data['yhat'].cumsum()
    plt.figure(figsize=(10, 5))
    plt.plot(future_data['ds'], cumulative_demand, marker='o', label='Cumulative Demand')
    plt.axhline(y=threshold * len(future_data), color='green', linestyle='--', label='Cumulative Stock Threshold')
    plt.title("Cumulative Demand vs. Stock Threshold")
    plt.xlabel("Date")
    plt.ylabel("Cumulative Sales")
    plt.legend()
    plt.grid()
    plt.show()


# ### Main Function

# In[6]:


def main():
    print("### Predictive Restocking System ###")
    historical_data = input_historical_data()
    if historical_data.empty:
        print("No data entered. Exiting...")
        return

    print("\nTraining predictive model...")
    model = train_predictive_model(historical_data)

    print("\nEnter the number of days to predict into the future:")
    future_periods = int(input("Number of days (e.g., 7): "))

    forecast = predict_future_sales(model, periods=future_periods)

    print("\nEnter the low-stock threshold (e.g., 50 items):")
    low_stock_threshold = int(input("Threshold: "))

    restocking_analysis = analyze_restocking(forecast, threshold=low_stock_threshold)
    visualize_forecast_with_analysis(model, forecast, threshold=low_stock_threshold)

if __name__ == "__main__":
    main()


# ### Output
# 
# Future Sales Predictions: The script will display the predicted sales for the specified period.
# 
# Restocking Analysis: It will indicate whether restocking is needed for each day based on the threshold.
# 
# Visualization: A graph of the forecasted sales will be displayed.

# In[ ]:




