# Orpheus0615 fixed build

## 업로드 방법

기존 저장소의 파일을 모두 지우고, 이 압축 파일 안의 파일과 폴더를 저장소 최상위에 그대로 업로드하세요.

필수 구조:

```text
index.html
gate.html
orpheus.html
style.css
script.js
README.md
assets/
  background.png
  orpheus-gate.png
  torn-paper.png
```

## 수정 사항

- 폰트와 스타일을 다시 `style.css`로 분리했습니다.
- HTML 안에 거대한 base64 이미지를 넣는 방식을 제거했습니다.
- `style.css?v=20260615-04`, `script.js?v=20260615-04`를 사용해 브라우저 캐시를 우회합니다.
- 음악 아이콘은 JavaScript 실행 전에도 보이도록 `▶` 텍스트를 HTML에 직접 넣었습니다.
- 비밀번호 `0427` 입력 후 같은 문서 안에서 Orpheus 화면을 보여 주고, 그 사용자 동작을 이용해 YouTube BGM 재생을 시도합니다.

## 주의

Chrome, Safari, 모바일 브라우저에서는 소리 있는 자동재생이 차단될 수 있습니다. 이 경우 본문 하단의 `▶` 아이콘을 눌러 재생하세요.


수정 기록: 49.462일 → 49.462 일, 캐시 버전 20260615-04 적용.


수정 기록: 49.462&nbsp;일로 비분리 공백을 적용해 시각적으로 반드시 띄어 보이도록 수정. 캐시 버전 20260615-04 적용.
