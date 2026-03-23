import json
import re
from typing import Union, List, Dict, Any

def extract_json_from_response(text: str) -> List[Dict[str, Any]]:
    try:
        # 1. ```json ... ``` 블록 우선 탐색
        match = re.search(r"```json\n?(.*?)\n?```", text, re.DOTALL)
        if match:
            json_str = match.group(1).strip()
        else:
            json_str = text.strip()

        # 2. 여러 개의 JSON 객체가 붙어 있는 경우 → 모두 추출
        json_objects = re.findall(r'{.*?}', json_str, re.DOTALL)
        parsed = [json.loads(obj) for obj in json_objects]

        return parsed

    except json.JSONDecodeError as e:
        raise ValueError(f"JSON 파싱 오류: {e}")
