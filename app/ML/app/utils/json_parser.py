import json
import re

def extract_json_from_response(text: str):
    # 답변 json으로 파싱하기
    try:
        match = re.search(r"```json\n(.+?)\n```", text, re.DOTALL)
        if not match:
            raise ValueError("JSON 블록을 찾을 수 없습니다.")
        json_str = match.group(1)
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON 파싱 오류: {e}")