import json
import re
from typing import Union, List, Dict, Any

def extract_json_from_response(text: str) -> List[Dict[str, Any]]:
    try:
        match = re.search(r"```json\n(.+?)\n```", text, re.DOTALL)
        if not match:
            raise ValueError("JSON 블록을 찾을 수 없습니다.")

        json_str = match.group(1).strip()
        parsed = json.loads(json_str)

        if isinstance(parsed, dict):
            return [parsed]
        elif isinstance(parsed, list):
            return parsed
        else:
            raise ValueError(f"지원하지 않는 JSON 형식입니다: {type(parsed)}")

    except json.JSONDecodeError as e:
        raise ValueError(f"JSON 파싱 오류: {e}")
