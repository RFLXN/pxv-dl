# PXV-DL

## 1. 필요한거
- Node.js v18.20.4 이상
- Yarn v1.22.22 이상

설치 방법은 [Node.js 홈페이지](https://nodejs.org/ko/download)에 나와있음    
킹반인들은 **Windows** 환경에서 **fnm** 방식으로 **yarn**을 이용해 설치하세요~ 에 나와있는 스크립트 쓰면 될듯

## 2. 소스코드 다운로드
오른쪽 위에 초록색 code 버튼 누르면 Download ZIP 버튼 있음    
다운로드 받고 대충 압축 풀어두셈

## 3. 소스코드 빌드
1. 터미널 열고 압축 풀어둔 폴더로 이동
    - 소스코드 다운로드 폴더에 뒀다면 `cd C:\Users\{님 윈도우 유저명}\Downloads\pxv-dl-main` 치면 됨    
2. 종속성 라이브러리 설치 (`yarn install`)
3. 소스코드 빌드 (`yarn build`)

## 4. 실행
1. 빌드할때랑 똑같이 터미널 열고 압축 풀어둔 폴더로 이동
2. `yarn start` 치면 실행됨
3. 작가 ID 넣으면 잠시 뒤에 압축 풀어둔 폴더 내부에 artworks 폴더가 생기고 그 안쪽에 작가 일러스트들이 저장됨