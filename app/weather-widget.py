from flask import Flask, render_template
import requests

app = Flask(__name__)


def get_weather(api_key, city):
    base_url = "http://api.openweathermap.org/data/2.5/weather"
    params = {"q": city, "appid": api_key, "units": "metric"}
    response = requests.get(base_url, params=params)
    data = response.json()
    return data


@app.route("/")
def index():
    api_key = "b3157daeee69981a9f55aff05785b3b9"
    city = "Port Area, Metro Manila"
    weather_data = get_weather(api_key, city)
    if weather_data["cod"] == 200:
        weather = weather_data["weather"][0]["description"].capitalize()
        temperature = weather_data["main"]["temp"]
        rainfall = weather_data.get("rain", {}).get("1h", 0)  # Handle missing rain data
        wind_speed = weather_data["wind"]["speed"]
        return render_template(
            "weather-widget.html",
            city=city,
            weather=weather,
            temperature=temperature,
            rainfall=rainfall,
            wind_speed=wind_speed,
        )
    else:
        return render_template("weather-widget.html", error="Error fetching weather data.")

if __name__ == "__main__":
    app.run(debug=True, port=6700)
