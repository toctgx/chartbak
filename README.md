# 🏥 병갔왔 (병원 갔다 왔어)

> "의사한테 못 한 말, 여기서 써요"

환자와 환우(보호자)가 진료실 밖에서 솔직한 이야기를 나누고,  
그 데이터를 의료·제약 산업의 실질적 인사이트로 전환하는 플랫폼.

---

## 📁 프로젝트 구조

```
byeonggasswatwo/
├── App.tsx                          # 메인 앱 (온보딩 플로우 관리)
├── app.json                         # Expo 설정
├── src/
│   ├── constants/
│   │   ├── diseases.ts              # 질환별 라운지 20개
│   │   └── theme.ts                 # 디자인 시스템 (컬러, 폰트, 스페이싱)
│   ├── types/index.ts               # 타입 정의
│   ├── lib/
│   │   ├── supabase.ts              # Supabase 클라이언트
│   │   └── mockData.ts              # MVP 목업 데이터
│   ├── screens/
│   │   ├── SplashScreen.tsx         # 스플래시
│   │   ├── HomeFeedScreen.tsx       # 홈 피드 (내 질환/전체/인기 탭)
│   │   ├── LoungeListScreen.tsx     # 라운지 목록 (20개 질환)
│   │   ├── WritePostScreen.tsx      # 글쓰기 (4가지 유형)
│   │   ├── PostDetailScreen.tsx     # 게시글 상세 + 댓글
│   │   ├── MyPageScreen.tsx         # 마이페이지
│   │   └── onboarding/
│   │       ├── PhoneScreen.tsx      # 1단계: 전화번호 인증
│   │       ├── RoleScreen.tsx       # 2단계: 환자/환우 선택
│   │       ├── DiseaseSelectScreen.tsx # 3단계: 질환 선택 (최대 3개)
│   │       ├── NicknameScreen.tsx   # 4단계: 익명 닉네임 생성
│   │       └── BasicInfoScreen.tsx  # 5단계: 나이대/진단연도
│   ├── components/
│   │   └── PostCard.tsx             # 피드 카드 컴포넌트
│   └── navigation/
│       └── AppNavigator.tsx         # 바텀탭 + 스택 네비게이션
└── supabase/
    └── schema.sql                   # DB 스키마 (PostgreSQL + RLS)
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
cp .env.example .env
# .env에 Supabase URL, anon key 입력
```

### 3. Supabase 설정
- [supabase.com](https://supabase.com)에서 프로젝트 생성
- `supabase/schema.sql` 내용을 SQL Editor에서 실행

### 4. 앱 실행
```bash
# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# Expo Go (테스트)
npm start
```

## 📱 MVP 화면 목록 (12개)

| 화면 | 파일 | 상태 |
|------|------|------|
| 스플래시 | SplashScreen.tsx | ✅ |
| 전화번호 인증 | onboarding/PhoneScreen.tsx | ✅ |
| 역할 선택 | onboarding/RoleScreen.tsx | ✅ |
| 질환 선택 | onboarding/DiseaseSelectScreen.tsx | ✅ |
| 닉네임 생성 | onboarding/NicknameScreen.tsx | ✅ |
| 기본정보 | onboarding/BasicInfoScreen.tsx | ✅ |
| 홈 피드 | HomeFeedScreen.tsx | ✅ |
| 라운지 목록 | LoungeListScreen.tsx | ✅ |
| 글쓰기 | WritePostScreen.tsx | ✅ |
| 게시글 상세 | PostDetailScreen.tsx | ✅ |
| 마이페이지 | MyPageScreen.tsx | ✅ |
| 라운지 상세 | _(다음 스프린트)_ | 🔜 |

## 🏷️ 질환별 라운지 (20개)

- **암**: 유방암, 폐암, 대장암, 갑상선암, 위암
- **만성질환**: 당뇨, 고혈압, 류마티스관절염, 루푸스, 크론병
- **희귀질환**: 파킨슨, 다발성경화증, 근육병
- **정신건강**: 우울증, 불안장애
- **기타**: 불임·난임, 만성통증, 갑상선질환, 신장질환, 섬유근육통

## 📝 게시글 4가지 유형

| 유형 | 설명 |
|------|------|
| 💊 치료 경험 | 나의 치료 과정 공유 |
| 💬 의사에게 못 한 말 | 진료실에서 못 꺼낸 이야기 |
| ❓ 질문 | 같은 경험자 찾기 |
| 🏥 병원/의사 후기 | 진료 경험 공유 |

## 💙 공감 이모지 3종

- 💙 도움됐어요
- 🤝 나도그래요
- 💪 힘내세요

## 🛠️ 기술 스택

| 영역 | 기술 |
|------|------|
| 모바일 | React Native (Expo) |
| 백엔드/DB | Supabase (PostgreSQL + Auth) |
| 네비게이션 | React Navigation v6 |
| 타입 | TypeScript |
| NLP (예정) | Python + KoNLPy + HuggingFace |
| 크롤러 (예정) | Python + Playwright |

## 📋 다음 스프린트

- [ ] LoungeDetailScreen (라운지 상세)
- [ ] Supabase Auth 전화번호 인증 실제 연동
- [ ] 실제 데이터 CRUD API 연동
- [ ] 알림 시스템 (Firebase FCM)
- [ ] 네이버 카페 크롤러 (Python)
- [ ] NLP 인사이트 파이프라인

## ⚠️ 법적 고지

이 앱의 모든 콘텐츠는 의료 조언이 아닙니다.  
증상 및 치료에 대해서는 반드시 전문 의료인과 상담하세요.
