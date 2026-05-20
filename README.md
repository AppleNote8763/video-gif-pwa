# Video to GIF PWA

브라우저에서 영상을 GIF로 변환하는 설치형 PWA입니다.

```text
https://applenote8763.github.io/video-gif-pwa/
```

## 주요 기능

- MP4, MOV, WEBM 영상 업로드
- 시작/종료 시간 선택
- GIF 품질 프리셋 제공
- GIF 미리보기 및 다운로드
- 홈 화면 추가를 통한 앱처럼 사용
- 첫 로딩 후 오프라인 사용 지원

## 품질 프리셋

| 프리셋 | 설정 | 용도 |
| --- | --- | --- |
| 저용량 | 320px / 8FPS | 모바일 공유용 |
| 기본 | 480px / 10FPS | 일반 변환용 |
| 고화질 | 720px / 15FPS | 선명도 우선 |

모바일에서는 3~10초 길이의 짧은 영상을 권장합니다. 긴 영상이나 고화질 설정은 GIF 용량과 변환 시간이 크게 늘어날 수 있습니다.

## 오프라인 사용

처음 한 번은 온라인에서 앱을 열고 FFmpeg 준비가 완료될 때까지 기다려야 합니다. 이후 홈 화면에 추가하면 인터넷이 없어도 앱을 실행하고 GIF 변환을 할 수 있습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드하고 GitHub Pages에 배포합니다.
