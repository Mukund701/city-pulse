# scraper/scraper.py
import os
import sys
import time
import json
import requests
import google.generativeai as genai
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# --- Configuration ---
# Load environment variables from .env file
load_dotenv()
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
# Set a limit for how many events to process per run to manage API costs.
# Set to a high number (e.g., 999) to process all found events.
MAX_EVENTS_TO_PROCESS = 5

# --- AI Configuration ---
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def structure_event_with_ai(raw_text: str) -> dict | None:
    """Uses Gemini AI to structure the raw event text into a JSON object."""
    if not GEMINI_API_KEY:
        raise ValueError("GOOGLE_API_KEY not found. Please check your .env file.")

    prompt = f"""
    You are an expert data extraction assistant. Based on the following raw text scraped from an event website,
    extract the event information and return it as a clean JSON object.
    The JSON object must have these exact keys: "title", "category", "date", "location", "description", "imageUrl".

    Instructions:
    1. "title": The official name of the event.
    2. "category": Infer a single category from the title. The value MUST be one of these exact uppercase options: CULTURAL, SPORTS, BUSINESS, TECHNOLOGY, ENTERTAINMENT, EDUCATION, HEALTH, ENVIRONMENT, OTHER.
    3. "date": Convert the date provided into a standard YYYY-MM-DD format. Use the current year, 2025.
    4. "location": The name of the venue or place.
    5. "description": A short, one-sentence description of the event based on the description text provided. If no description is available, leave it as an empty string.
    6. "imageUrl": The full URL of the event image. If no URL is provided, leave it as an empty string.

    Here is the raw text:
    ---
    {raw_text}
    ---
    Return only the JSON object, with no other text before or after it.
    """
    try:
        response = model.generate_content(prompt)
        json_response = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(json_response)
    except Exception as e:
        print(f"Error processing with AI: {e}")
        return None

def save_event_to_api(event_data: dict, city_id: int) -> None:
    """Sends the structured event data to our Node.js API to be saved."""
    API_ENDPOINT = "http://localhost:3001/api/events"
    event_data['cityId'] = city_id
    
    try:
        response = requests.post(API_ENDPOINT, json=event_data)
        if response.status_code == 201:
            print(f"Success: Saved event '{event_data['title']}'")
        else:
            print(f"Error: Could not save event '{event_data['title']}'. Status: {response.status_code}, Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"API connection error: {e}")

def main() -> None:
    """Main function to scrape, process, and save events."""
    if len(sys.argv) != 3:
        print("Usage: python scraper.py <city_name> <city_id>")
        print("Example: python scraper.py delhi 2")
        sys.exit(1)
        
    city_name = sys.argv[1].lower()
    city_id = int(sys.argv[2])

    URL = f"https://allevents.in/{city_name}/all"
    print(f"Fetching events for '{city_name.capitalize()}' from: {URL}...")

    service = Service(ChromeDriverManager().install())
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=service, options=options)
    
    processed_count = 0
    try:
        driver.get(URL)
        time.sleep(5) # Allow time for the page to load dynamically
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, "html.parser")
        
        event_cards = soup.find_all('li', class_='event-card')
        print(f"\nFound {len(event_cards)} events. Processing up to {MAX_EVENTS_TO_PROCESS} events...\n")
        
        for card in event_cards:
            title_element = card.find('h3')
            date_element = card.find('div', class_='date')
            location_element = card.find('div', class_='subtitle')
            image_element = card.find('img', class_='event-img')
            description_element = card.find('p', class_='card-text')
            
            if title_element and date_element and location_element:
                title = title_element.text.strip()
                date = date_element.text.strip()
                location = location_element.text.strip()
                image_url = image_element.get('src') if image_element else ""
                description = description_element.text.strip() if description_element else ""
                
                raw_event_text = f"Title: {title}, Date: {date}, Location: {location}, ImageURL: {image_url}, Description: {description}"
                
                print(f"Processing: {title}...")
                structured_event = structure_event_with_ai(raw_event_text)
                
                if structured_event:
                    save_event_to_api(structured_event, city_id)
                
                print("-" * 20)
                
                processed_count += 1
                if processed_count >= MAX_EVENTS_TO_PROCESS:
                    print(f"\nProcessed {MAX_EVENTS_TO_PROCESS} events. Exiting.")
                    break
    finally:
        driver.quit()

if __name__ == "__main__":
    main()