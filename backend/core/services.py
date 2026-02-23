import os
import json
import time
import random
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from django.conf import settings
from google import genai
from google.genai import types

# Initialize Gemini client
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", ""))

class GenerativeAIService:
    @staticmethod
    def get_transcript(youtube_url):
        try:
            if "v=" not in youtube_url:
                raise ValueError("Invalid YouTube URL")
            print(f"1. Fetching transcript for URL: {youtube_url}")
                
            video_id = youtube_url.split("v=")[1]
            if "&" in video_id:
                video_id = video_id.split("&")[0]

            print(f"2. Extracted video ID: {video_id}")
            
            api = YouTubeTranscriptApi()
            try:
                transcript_data = api.fetch(video_id, languages=['en'])
            except:
                transcript_data = api.fetch(video_id)

            print(f"3. Fetched transcript items: {len(transcript_data)}")
            
            transcript_text = " ".join([item.text for item in transcript_data])

            print(f"4. Transcript text length: {len(transcript_text)}")
            return transcript_text

        except Exception as e:
            print(f"ERROR in get_transcript: {str(e)}")
            import traceback
            traceback.print_exc()
            raise Exception(f"Failed to get transcript: {str(e)}")


    @staticmethod
    def generate_notes(transcript):
        if not transcript:
            raise ValueError("No transcript provided")

        prompt = (
            "You are an AI Note Taker. Summarize the transcript into key points, "
            "5 flashcards, and a 5-question quiz. "
            "Return the result strictly as a JSON object with keys: "
            "'summary' (list of key points), 'flashcards' (list of objects with front/back), "
            "and 'quiz' (list of objects with question/options/answer). "
            f"Transcript: {transcript[:30000]}" # Limit length
        )

        try:
            response = client.models.generate_content(
                model='models/gemini-2.5-flash',
                contents=prompt
            )
            result_text = response.text
            
            # Clean up json markdown if present
            if result_text.startswith("```json"):
                result_text = result_text.replace("```json", "").replace("```", "")
            
            return json.loads(result_text)
        except Exception as e:
             raise Exception(f"AI Generation failed: {str(e)}")
