
# 🔑 네이버 & 카카오 로그인 API 키 발급 가이드

소셜 로그인을 작동시키기 위해 네이버와 카카오에서 **"열쇠(Key)"**를 받아야 합니다.
아래 순서대로 따라 해 주세요.

---

## 1. 네이버 로그인 설정 (Naver)

1. **[네이버 개발자 센터](https://developers.naver.com/apps/#/register?api=nvlogin)** 접속 및 로그인.
2. **"Application 등록"** 클릭.
3. **설정 입력**:
   - **애플리케이션 이름**: `아마존 셀러 마스터` (원하는 이름)
   - **사용 API**: `네이버 로그인` 선택
     - **제공 정보**: `회원이름`, `이메일`, `별명`, `프로필 사진` 등을 **[필수]**로 체크하세요.
   - **환경 추가**: `PC 웹` 선택.
   - **서비스 URL**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:3000/api/auth/callback/naver` (정확히 입력!)
4. **등록하기** 클릭.
5. 생성된 앱의 **[개요]** 탭에서 **`Client ID`**와 **`Client Secret`**을 복사해 두세요.

---

## 2. 카카오 로그인 설정 (Kakao)

1. **[카카오 디벨로퍼스](https://developers.kakao.com/console/app)** 접속 및 로그인.
2. **"애플리케이션 추가하기"** 클릭 -> 이름 입력(예: 아마존 셀러 마스터) -> 저장.
3. 좌측 메뉴 **[플랫폼]** 클릭 -> **Web 플랫폼 등록** 클릭.
   - 사이트 도메인: `http://localhost:3000` -> 저장.
4. 좌측 메뉴 **[카카오 로그인]** 클릭.
   - **활성화 설정**: `ON`으로 변경.
   - **Redirect URI 등록** 클릭 -> `http://localhost:3000/api/auth/callback/kakao` 입력 -> 저장.
5. 좌측 메뉴 **[요약 정보]** 클릭.
   - **`REST API 키`**를 복사해 두세요. (이것이 Client ID입니다)
6. 좌측 메뉴 **[카카오 로그인]** -> **[보안]** 클릭 (선택 사항).
   - **Client Secret** 코드를 생성하면 보안이 더 강화됩니다. (생성했다면 복사해 두세요)

---

## 3. 내 프로젝트에 키 입력하기

1. VS Code에서 프로젝트 최상위 폴더(바탕화면의 `withalice_antigravity`)에 **새 파일**을 만듭니다.
2. 파일 이름: `.env.local` (점(.)으로 시작해야 합니다!)
3. 아래 내용을 복사해서 붙여넣고, `여기에_붙여넣기` 부분을 위에서 받은 키로 바꿔주세요.

```env
# NextAuth 설정 (그대로 두세요)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=b4dM5@s7eR_k3y_r@nd0m_g3n  # 아무거나 복잡한 문자열이면 됩니다

# 네이버 키 (위에서 복사한 것)
NAVER_CLIENT_ID=여기에_네이버_Client_ID_붙여넣기
NAVER_CLIENT_SECRET=여기에_네이버_Client_Secret_붙여넣기

# 카카오 키 (위에서 복사한 것)
KAKAO_CLIENT_ID=여기에_카카오_REST_API_키_붙여넣기
KAKAO_CLIENT_SECRET=여기에_카카오_Client_Secret_붙여넣기
```
*(카카오 Secret을 안 만들었다면 KAKAO_CLIENT_SECRET은 비워두거나 지워도 됩니다)*

---

### 🎉 설정 끝!
이제 터미널에서 서버를 껐다가 다시 켜면(`Ctrl+C` 누르고 `npm run dev`), 로그인 버튼이 진짜로 작동합니다!
