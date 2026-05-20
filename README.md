# Video to GIF PWA

브라우저에서 MP4, MOV, WEBM 영상을 GIF로 변환하는 설치형 PWA입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드 확인

```bash
npm run build
npm run preview:host
```

휴대폰에서 같은 Wi-Fi에 접속한 뒤 PC의 로컬 IP와 preview 포트로 접속하면 설치 전 테스트를 할 수 있습니다.

## GitHub Pages 배포

1. GitHub에 새 저장소를 만듭니다.
2. 이 폴더를 저장소에 push합니다.
3. 저장소 Settings > Pages > Build and deployment에서 Source를 `GitHub Actions`로 설정합니다.
4. `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 `dist`를 빌드해 Pages에 배포합니다.

`package-lock.json`이 없는 상태에서도 Actions가 설치를 진행하도록 현재 워크플로는 `npm install`을 사용합니다. 로컬에서 `npm install`을 실행해 lockfile을 만든 뒤에는 워크플로를 `npm ci`로 바꾸면 더 재현성 있는 배포가 됩니다.

배포된 HTTPS 주소를 휴대폰 브라우저로 열고, Android Chrome에서는 "홈 화면에 추가" 또는 설치 버튼을 사용합니다. iPhone Safari에서는 공유 버튼 > "홈 화면에 추가"를 사용합니다.
