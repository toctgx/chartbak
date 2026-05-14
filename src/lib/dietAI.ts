// 차트밖 - AI 식단 분석
// Claude API를 사용해 질환 기반 식단 적합성 분석

import { getNutritionGuidelines } from '../constants/diseaseNutrition';
import { DISEASES } from '../constants/diseases';

export type DietVerdict = 'good' | 'caution' | 'bad';

export interface DietAnalysisResult {
  verdict: DietVerdict;
  score: number;          // 0-100
  summary: string;        // 한 줄 요약
  reasons: string[];      // 판단 근거 2-3개
  improvements: string[]; // 개선 추천 2-3개
  encouragement: string;  // 따뜻한 응원 메시지
}

// Mock 결과 (API 키 없거나 오류 시)
const MOCK_RESULTS: DietAnalysisResult[] = [
  {
    verdict: 'good',
    score: 85,
    summary: '전반적으로 균형 잡힌 건강한 식단이에요',
    reasons: ['채소와 단백질이 잘 포함되어 있어요', '가공식품이 적고 신선 식재료 위주예요'],
    improvements: ['식이섬유를 조금 더 늘려보세요', '물을 충분히 마시는 것도 중요해요'],
    encouragement: '오늘 식사 정말 훌륭해요! 이 페이스 유지하면 건강이 눈에 띄게 좋아질 거예요 💚',
  },
  {
    verdict: 'caution',
    score: 55,
    summary: '몇 가지 주의가 필요한 식품이 포함되어 있어요',
    reasons: ['나트륨 함량이 다소 높을 수 있어요', '정제 탄수화물이 많이 포함됐어요'],
    improvements: ['국물은 적게, 건더기 위주로 드세요', '현미나 잡곡으로 바꿔보시면 좋아요'],
    encouragement: '완벽한 식단은 없어요! 조금씩 바꿔가는 과정이 중요해요. 오늘도 잘 하셨어요 🌿',
  },
  {
    verdict: 'bad',
    score: 30,
    summary: '질환 관리에 주의가 필요한 식단이에요',
    reasons: ['질환에 영향을 줄 수 있는 식품이 포함됐어요', '영양 불균형이 우려돼요'],
    improvements: ['다음 식사엔 채소를 절반 이상 채워보세요', '가공식품 대신 신선 식재료를 선택해보세요'],
    encouragement: '오늘 하루 힘드셨죠? 내일 한 끼만 건강하게 바꿔봐요. 작은 변화가 쌓여요 💪',
  },
];

function getMockResult(): DietAnalysisResult {
  // 개발 테스트용: 랜덤 mock 반환
  return MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
}

export async function analyzeDiet(params: {
  foodDescription: string;
  diseaseIds: string[];
  imageBase64?: string;
}): Promise<DietAnalysisResult> {
  const { foodDescription, diseaseIds, imageBase64 } = params;

  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;

  // API 키 없으면 mock 반환
  if (!apiKey || apiKey === 'your_key_here' || apiKey.trim() === '') {
    console.log('[dietAI] API 키 없음 — mock 결과 반환');
    await new Promise(r => setTimeout(r, 1500)); // 실제 API처럼 딜레이
    return getMockResult();
  }

  // 질환 이름 조회
  const diseaseNames = diseaseIds
    .map(id => DISEASES.find(d => d.id === id)?.name)
    .filter(Boolean) as string[];

  // 질환별 가이드라인 텍스트 생성
  const guidelines = getNutritionGuidelines(diseaseIds);
  const guidelinesText = guidelines.length > 0
    ? guidelines.map(g =>
        `[${g.diseaseName}]\n` +
        `- 피해야 할 식품: ${g.avoid.join(', ')}\n` +
        `- 권장 식품: ${g.recommended.join(', ')}\n` +
        `- 식단 팁: ${g.tips.join('; ')}`
      ).join('\n\n')
    : '특별한 식이 제한 가이드라인 없음';

  // 메시지 구성 (이미지 있을 때 vision 사용)
  const userContent: any[] = [];

  if (imageBase64) {
    userContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/jpeg',
        data: imageBase64,
      },
    });
  }

  userContent.push({
    type: 'text',
    text: `당신은 친절하고 따뜻한 영양사입니다. 아래 환자의 질환과 식단을 보고 분석해주세요.

환자 질환: ${diseaseNames.length > 0 ? diseaseNames.join(', ') : '없음'}
식단 내용: ${foodDescription}${imageBase64 ? ' (첨부된 사진 참고)' : ''}

질환별 주의사항:
${guidelinesText}

다음 JSON 형식으로만 응답해주세요 (다른 텍스트 없이):
{
  "verdict": "good" | "caution" | "bad",
  "score": 0-100,
  "summary": "한 줄 요약 (예: 당뇨 환자에게 탄수화물이 과다합니다)",
  "reasons": ["판단 근거1", "판단 근거2"],
  "improvements": ["개선 추천1", "개선 추천2"],
  "encouragement": "따뜻하고 공감 어린 응원 메시지 (1-2문장)"
}

판단 기준:
- good (80-100): 질환 관리에 적합한 식단
- caution (40-79): 일부 주의 필요
- bad (0-39): 질환 관리에 부적합`,
  });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('[dietAI] API 오류:', response.status, errText);
      return getMockResult();
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text ?? '';

    // JSON 파싱
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[dietAI] JSON 파싱 실패:', text);
      return getMockResult();
    }

    const parsed = JSON.parse(jsonMatch[0]) as DietAnalysisResult;

    // 필수 필드 검증
    if (!parsed.verdict || parsed.score == null || !parsed.summary) {
      console.warn('[dietAI] 응답 필드 부족:', parsed);
      return getMockResult();
    }

    return {
      verdict: parsed.verdict,
      score: Math.max(0, Math.min(100, Number(parsed.score))),
      summary: parsed.summary || '',
      reasons: Array.isArray(parsed.reasons) ? parsed.reasons : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      encouragement: parsed.encouragement || '오늘도 건강 챙기느라 수고하셨어요! 💚',
    };
  } catch (err) {
    console.warn('[dietAI] 분석 실패, mock 반환:', err);
    return getMockResult();
  }
}
