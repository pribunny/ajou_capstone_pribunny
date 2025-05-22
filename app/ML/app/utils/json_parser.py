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
            # 2. 블록이 없을 경우 전체 문자열 자체를 JSON으로 시도
            json_str = text.strip()

        parsed = json.loads(json_str)

        # 3. 파싱 결과가 dict이면 리스트로 감싸기
        if isinstance(parsed, dict):
            return [parsed]
        elif isinstance(parsed, list):
            return parsed
        else:
            raise ValueError(f"지원하지 않는 JSON 형식입니다: {type(parsed)}")

    except json.JSONDecodeError as e:
        raise ValueError(f"JSON 파싱 오류: {e}")
