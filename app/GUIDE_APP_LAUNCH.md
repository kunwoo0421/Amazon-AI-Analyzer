# 📱 Next.js 웹사이트를 앱(App)으로 출시하는 가이드

현재 만드신 웹 프로젝트를 **Google Play Store(안드로이드)**와 **Apple App Store(아이폰)**에 정식 앱으로 출시하는 방법입니다.
우리는 **[Capacitor](https://capacitorjs.com/)**라는 도구를 사용하여, 웹 코드를 수정하지 않고 그대로 앱으로 변환할 것입니다.

---

## ✅ 필수 준비물

### 1. 계정 및 비용 (스토어 등록비)
- **Google Play Console (안드로이드)**: 등록비 **$25 (약 3만원, 평생 1회)** 결제 필요.
- **Apple Developer Program (아이폰)**: 연회비 **$99 (약 13만원, 매년)** 결제 필요.

### 2. 개발 환경
- **안드로이드 앱 빌드용**: [Android Studio](https://developer.android.com/studio) 설치 (무료, Windows/Mac 모두 가능)
- **아이폰 앱 빌드용**: **Mac 컴퓨터(MacBook, iMac 등)** 필수 + [Xcode](https://developer.apple.com/xcode/) 설치 (무료)
  > ⚠️ **주의**: Windows 컴퓨터만 가지고 계시다면 **안드로이드 앱만** 만드실 수 있습니다. 아이폰 앱을 만드시려면 Mac을 빌리거나 구하셔야 합니다.

---

## 🚀 1단계: 프로젝트 설정 변경 (Next.js -> Static App)

앱은 인터넷이 없어도 켜져야 하므로, 서버 기능 없이 동작하는 **정적 내보내기(Static Export)** 설정이 필요합니다.

1. `next.config.mjs` (또는 `next.config.js`) 파일을 열고 아래 옵션을 추가합니다.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 이 줄을 추가 (정적 html로 내보내기)
  images: {
    unoptimized: true // 이 줄을 추가 (Next.js 이미지 최적화 끄기 - 앱에서는 필수)
  }
};

export default nextConfig;
```

---

## 🛠 2단계: Capacitor 설치 및 초기화

터미널(Terminal)을 열고 프로젝트 폴더에서 아래 명령어들을 차례로 입력하세요.

1. **Capacitor 설치**
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
   ```

2. **앱 초기화**
   ```bash
   npx cap init
   ```
   - **Name**: 앱 이름 입력 (예: `AmzMaster`)
   - **Package ID**: 고유 ID 입력 (보통 역순 도메인, 예: `com.withalice.amzmaster`)

---

## 📦 3단계: 앱으로 빌드하기

1. **웹 코드 빌드**
   ```bash
   npm run build
   ```
   - 이 과정이 끝나면 `out` 폴더가 생깁니다. 이 폴더가 실제 앱 안에 들어갈 내용물입니다.

2. **안드로이드 프로젝트 생성**
   ```bash
   npx cap add android
   npx cap sync
   ```

3. **아이폰 프로젝트 생성 (Mac 사용자만 가능)**
   ```bash
   npx cap add ios
   npx cap sync
   ```

---

## 📲 4단계: Android Studio에서 실행 및 파일 생성 (APK)

1. **Android Studio 열기**
   ```bash
   npx cap open android
   ```
   - 잠시 기다리면 안드로이드 스튜디오가 열립니다.

2. **테스트 실행**
   - 상단 메뉴의 `▶` (Run) 버튼을 누르면 PC의 에뮬레이터나 연결된 핸드폰에서 앱이 실행됩니다.

3. **스토어 등록용 파일 만들기 (배포)**
   - 상단 메뉴: **Build** > **Generate Signed Bundle / APK**
   - **Android App Bundle** 선택 -> **Next**
   - **Key store path**: `Create new`를 눌러서 키(비밀번호 같은 것)를 생성합니다. (이 키 파일은 절대 잃어버리면 안 됩니다! 나중에 업데이트 못 합니다.)
   - 완료되면 `.aab` 파일이 생성됩니다. 이 파일을 구글 플레이 콘솔에 업로드하면 됩니다.

---

## 🍏 5단계: Xcode에서 아이폰 앱 만들기 (Mac 사용자 전용)

1. **Xcode 열기**
   ```bash
   npx cap open ios
   ```

2. **설정 및 서명**
   - 좌측 프로젝트 이름을 클릭 -> **Signing & Capabilities** 탭 클릭
   - **Team**에서 본인의 Apple ID를 선택합니다.

3. **스토어 업로드**
   - 상단 메뉴: **Product** > **Archive**
   - 완료되면 **Distribute App** 버튼을 눌러 앱스토어 커넥트(App Store Connect)로 전송합니다.

---

## 💡 팁과 주의사항

- **뒤로가기 버튼**: 안드로이드의 물리 뒤로가기 버튼을 처리하려면 `@capacitor/app` 플러그인을 설치하고 코드를 조금 추가해야 합니다.
- **아이콘 및 스플래시 화면**: `capacitor-assets` 도구를 쓰면 아이콘 이미지를 자동으로 사이즈별로 만들어줍니다.
  - 준비물: `assets/logo.png` (1024x1024 고화질), `assets/splash.png` (2732x2732)
  - 명령어: `npx capacitor-assets generate`

이 과정을 완료하면, 
**구글 플레이 스토어**와 **애플 앱스토어**에서 "Amazon Master" 앱을 검색해서 다운로드할 수 있게 됩니다! 🎉
