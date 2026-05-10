/**
 * 차트밖 커스텀 아이콘
 * SVG → base64 data URI → Image 컴포넌트 (웹/네이티브 모두 작동)
 * 클립아트코리아 의료 플랫 스타일 — 따뜻한 파랑/노랑 채워진 아이콘
 */
import React from 'react';
import { Image } from 'react-native';

const svg2uri = (svg: string) =>
  `data:image/svg+xml,${encodeURIComponent(svg)}`;

// ── 탭바: 홈 ─────────────────────────────────────────────
const SVG_HOME = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 22l18-16 18 16v20a2 2 0 01-2 2H8a2 2 0 01-2-2V22z" fill="#B0B3BB"/>
  <path d="M8 23l16-14 16 14v19H8V23z" fill="#D0D4DA"/>
  <rect x="18" y="30" width="12" height="12" rx="2" fill="#B0B3BB"/>
</svg>`;

const SVG_HOME_ACTIVE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 22l18-16 18 16v20a2 2 0 01-2 2H8a2 2 0 01-2-2V22z" fill="#F5B731"/>
  <path d="M8 23l16-14 16 14v19H8V23z" fill="#FDD878"/>
  <rect x="18" y="30" width="12" height="12" rx="2" fill="#E8A838"/>
</svg>`;

// ── 탭바: 라운지 ──────────────────────────────────────────
const SVG_LOUNGE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="15" cy="16" r="8" fill="#B0B3BB"/>
  <circle cx="15" cy="16" r="6" fill="#D0D4DA"/>
  <circle cx="33" cy="16" r="8" fill="#B0B3BB"/>
  <circle cx="33" cy="16" r="6" fill="#D0D4DA"/>
  <path d="M2 40c0-8 5.8-14 13-14h18c7.2 0 13 6 13 14" fill="#B0B3BB"/>
  <path d="M4 40c0-7 5.4-12 12-12h16c6.6 0 12 5 12 12" fill="#D0D4DA"/>
</svg>`;

const SVG_LOUNGE_ACTIVE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="15" cy="16" r="8" fill="#F5B731"/>
  <circle cx="15" cy="16" r="6" fill="#FDD878"/>
  <circle cx="33" cy="16" r="8" fill="#F5B731"/>
  <circle cx="33" cy="16" r="6" fill="#FDD878"/>
  <path d="M2 40c0-8 5.8-14 13-14h18c7.2 0 13 6 13 14" fill="#F5B731"/>
  <path d="M4 40c0-7 5.4-12 12-12h16c6.6 0 12 5 12 12" fill="#FDD878"/>
</svg>`;

// ── 탭바: 마이 ────────────────────────────────────────────
const SVG_MYPAGE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="17" r="10" fill="#B0B3BB"/>
  <circle cx="24" cy="17" r="8" fill="#D0D4DA"/>
  <path d="M4 44c0-11 9-20 20-20s20 9 20 20" fill="#B0B3BB"/>
  <path d="M7 44c0-9.4 7.6-17 17-17s17 7.6 17 17" fill="#D0D4DA"/>
</svg>`;

const SVG_MYPAGE_ACTIVE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="17" r="10" fill="#F5B731"/>
  <circle cx="24" cy="17" r="8" fill="#FDD878"/>
  <path d="M4 44c0-11 9-20 20-20s20 9 20 20" fill="#F5B731"/>
  <path d="M7 44c0-9.4 7.6-17 17-17s17 7.6 17 17" fill="#FDD878"/>
</svg>`;

// ── 탭바: 한줄일기 ───────────────────────────────────────
const SVG_DIARY = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="4" width="28" height="36" rx="4" fill="#B0B3BB"/>
  <rect x="9" y="5" width="26" height="34" rx="3" fill="#D0D4DA"/>
  <line x1="14" y1="16" x2="32" y2="16" stroke="#B0B3BB" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="14" y1="22" x2="32" y2="22" stroke="#B0B3BB" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="14" y1="28" x2="24" y2="28" stroke="#B0B3BB" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="36" cy="36" r="8" fill="#D0D4DA"/>
  <line x1="33" y1="36" x2="39" y2="36" stroke="#B0B3BB" stroke-width="2" stroke-linecap="round"/>
  <line x1="36" y1="33" x2="36" y2="39" stroke="#B0B3BB" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const SVG_DIARY_ACTIVE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="4" width="28" height="36" rx="4" fill="#F5B731"/>
  <rect x="9" y="5" width="26" height="34" rx="3" fill="#FDD878"/>
  <line x1="14" y1="16" x2="32" y2="16" stroke="#E8A838" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="14" y1="22" x2="32" y2="22" stroke="#E8A838" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="14" y1="28" x2="24" y2="28" stroke="#E8A838" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="36" cy="36" r="8" fill="#F5B731"/>
  <line x1="33" y1="36" x2="39" y2="36" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="36" y1="33" x2="36" y2="39" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>`;

// ── 환자 태그 ─────────────────────────────────────────────
const SVG_PATIENT = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="8" r="5" fill="#3B82F6"/>
  <circle cx="12" cy="8" r="3.5" fill="#60A5FA"/>
  <path d="M3 21c0-5 4-9 9-9s9 4 9 9" fill="#3B82F6"/>
  <rect x="10" y="5.5" width="4" height="1.5" rx="0.7" fill="white"/>
  <rect x="11.25" y="4" width="1.5" height="4" rx="0.7" fill="white"/>
</svg>`;

// ── 환우 태그 ─────────────────────────────────────────────
const SVG_CAREGIVER = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="7" r="4" fill="#22C55E"/>
  <circle cx="8" cy="7" r="2.8" fill="#4ADE80"/>
  <circle cx="16" cy="7" r="4" fill="#22C55E"/>
  <circle cx="16" cy="7" r="2.8" fill="#4ADE80"/>
  <path d="M1 21c0-4 3.1-7 7-7h8c3.9 0 7 3 7 7" fill="#22C55E"/>
</svg>`;

// ── 공감: 도움됐어요 ──────────────────────────────────────
const SVG_HEART_OFF = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 21C12 21 3 14.5 3 8.5A4.5 4.5 0 0112 6a4.5 4.5 0 019 2.5C21 14.5 12 21 12 21z" fill="#D0D4DA"/>
</svg>`;

const SVG_HEART_ON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 21C12 21 3 14.5 3 8.5A4.5 4.5 0 0112 6a4.5 4.5 0 019 2.5C21 14.5 12 21 12 21z" fill="#EF4444"/>
  <path d="M12 19C12 19 5 13.5 5 9a3 3 0 016 0 3 3 0 016 0c0 4.5-7 10-7 10z" fill="#FCA5A5" opacity="0.5"/>
</svg>`;

// ── 공감: 나도그래요 ──────────────────────────────────────
const SVG_SAME_OFF = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="7" r="3.5" fill="#D0D4DA"/>
  <circle cx="16" cy="7" r="3.5" fill="#D0D4DA"/>
  <path d="M2 19c0-4 2.7-7 6-7h8c3.3 0 6 3 6 7" fill="#D0D4DA"/>
</svg>`;

const SVG_SAME_ON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="7" r="3.5" fill="#22C55E"/>
  <circle cx="8" cy="7" r="2.5" fill="#4ADE80"/>
  <circle cx="16" cy="7" r="3.5" fill="#22C55E"/>
  <circle cx="16" cy="7" r="2.5" fill="#4ADE80"/>
  <path d="M2 19c0-4 2.7-7 6-7h8c3.3 0 6 3 6 7" fill="#22C55E"/>
</svg>`;

// ── 공감: 힘내세요 ────────────────────────────────────────
const SVG_CHEER_OFF = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="10" width="12" height="10" rx="3" fill="#D0D4DA"/>
  <rect x="7.5" y="6.5" width="3" height="5" rx="1.5" fill="#D0D4DA"/>
  <rect x="11.5" y="5.5" width="3" height="6" rx="1.5" fill="#D0D4DA"/>
  <rect x="15.5" y="6.5" width="3" height="5" rx="1.5" fill="#D0D4DA"/>
  <rect x="4" y="11" width="3" height="5" rx="1.5" fill="#D0D4DA"/>
</svg>`;

const SVG_CHEER_ON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="10" width="12" height="10" rx="3" fill="#F5B731"/>
  <rect x="7" y="11" width="10" height="8" rx="2" fill="#FDD878"/>
  <rect x="7.5" y="6.5" width="3" height="5" rx="1.5" fill="#F5B731"/>
  <rect x="11.5" y="5.5" width="3" height="6" rx="1.5" fill="#F5B731"/>
  <rect x="15.5" y="6.5" width="3" height="5" rx="1.5" fill="#F5B731"/>
  <rect x="4" y="11" width="3" height="5" rx="1.5" fill="#F5B731"/>
</svg>`;

// ── 글 유형 ───────────────────────────────────────────────
const SVG_TYPE_TREATMENT = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="4" width="20" height="24" rx="4" fill="#4AACDE"/>
  <rect x="6" y="5" width="18" height="22" rx="3" fill="white"/>
  <line x1="9" y1="12" x2="21" y2="12" stroke="#4AACDE" stroke-width="2" stroke-linecap="round"/>
  <line x1="9" y1="17" x2="21" y2="17" stroke="#4AACDE" stroke-width="2" stroke-linecap="round"/>
  <line x1="9" y1="22" x2="16" y2="22" stroke="#4AACDE" stroke-width="2" stroke-linecap="round"/>
  <rect x="12" y="1" width="6" height="5" rx="2.5" fill="#2E86DE"/>
</svg>`;

const SVG_TYPE_UNSAID = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 5h20c1.7 0 3 1.3 3 3v13c0 1.7-1.3 3-3 3H18l-5 4-5-4H4c-1.7 0-3-1.3-3-3V8c0-1.7 1.3-3 3-3z" fill="#F5B731"/>
  <path d="M5 6h18c1.4 0 2.5 1.1 2.5 2.5v12c0 1.4-1.1 2.5-2.5 2.5H17.5l-4.5 3.5-4.5-3.5H5c-1.4 0-2.5-1.1-2.5-2.5v-12C2.5 7.1 3.6 6 5 6z" fill="#FDD878"/>
  <circle cx="25" cy="25" r="6" fill="#EF4444"/>
  <line x1="22" y1="22" x2="28" y2="28" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="28" y1="22" x2="22" y2="28" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

const SVG_TYPE_QUESTION = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="14" fill="#4AACDE"/>
  <circle cx="16" cy="16" r="12" fill="#5EC2F5"/>
  <text x="16" y="23" text-anchor="middle" font-size="18" font-weight="bold" fill="white" font-family="Arial, sans-serif">?</text>
</svg>`;

const SVG_TYPE_HOSPITAL = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="12" width="20" height="17" rx="2" fill="#4AACDE"/>
  <rect x="5" y="13" width="18" height="15" rx="1.5" fill="#5EC2F5"/>
  <rect x="4" y="5" width="20" height="10" rx="2" fill="#2E86DE"/>
  <rect x="11" y="8" width="6" height="1.5" rx="0.7" fill="white"/>
  <rect x="13.25" y="6" width="1.5" height="5" rx="0.7" fill="white"/>
  <rect x="8" y="18" width="4" height="4" rx="1" fill="white" opacity="0.85"/>
  <rect x="16" y="18" width="4" height="4" rx="1" fill="white" opacity="0.85"/>
  <rect x="11" y="23" width="6" height="5" rx="1" fill="white" opacity="0.9"/>
  <path d="M21 7l1.5 1.5 3-3" stroke="#F5B731" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// ── 글쓰기 버튼 아이콘 ────────────────────────────────────
const SVG_WRITE = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="white"/>
  <path d="M20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="white" opacity="0.8"/>
</svg>`;

// ── 댓글 아이콘 ───────────────────────────────────────────
const SVG_COMMENT = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 4h16c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2h-5l-3 3-3-3H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="#C6B8A9"/>
</svg>`;

// ── 검색 아이콘 ───────────────────────────────────────────
const SVG_SEARCH = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="11" cy="11" r="7" stroke="#B0B3BB" stroke-width="2.5" fill="none"/>
  <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#B0B3BB" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

const SVG_SEARCH_ACTIVE = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="11" cy="11" r="7" stroke="#7089C9" stroke-width="2.5" fill="none"/>
  <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#7089C9" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

// ─────────────────────────────────────────────────────────
// React 컴포넌트
// ─────────────────────────────────────────────────────────

interface IconProps { size?: number }

export const IconHome       = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_HOME) }} style={{ width: size, height: size }} />;
export const IconHomeActive = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_HOME_ACTIVE) }} style={{ width: size, height: size }} />;
export const IconLounge       = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_LOUNGE) }} style={{ width: size, height: size }} />;
export const IconLoungeActive = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_LOUNGE_ACTIVE) }} style={{ width: size, height: size }} />;
export const IconMyPage       = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_MYPAGE) }} style={{ width: size, height: size }} />;
export const IconMyPageActive = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_MYPAGE_ACTIVE) }} style={{ width: size, height: size }} />;
export const IconDiary       = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_DIARY) }} style={{ width: size, height: size }} />;
export const IconDiaryActive = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_DIARY_ACTIVE) }} style={{ width: size, height: size }} />;

export const IconPatient   = ({ size = 14 }: IconProps) => <Image source={{ uri: svg2uri(SVG_PATIENT) }} style={{ width: size, height: size }} />;
export const IconCaregiver = ({ size = 14 }: IconProps) => <Image source={{ uri: svg2uri(SVG_CAREGIVER) }} style={{ width: size, height: size }} />;

export const IconHeartOff  = ({ size = 14 }: IconProps) => <Image source={{ uri: svg2uri(SVG_HEART_OFF) }} style={{ width: size, height: size }} />;
export const IconHeartOn   = ({ size = 14 }: IconProps) => <Image source={{ uri: svg2uri(SVG_HEART_ON) }} style={{ width: size, height: size }} />;
export const IconSameOff   = ({ size = 14 }: IconProps) => <Image source={{ uri: svg2uri(SVG_SAME_OFF) }} style={{ width: size, height: size }} />;
export const IconSameOn    = ({ size = 14 }: IconProps) => <Image source={{ uri: svg2uri(SVG_SAME_ON) }} style={{ width: size, height: size }} />;
export const IconCheerOff  = ({ size = 14 }: IconProps) => <Image source={{ uri: svg2uri(SVG_CHEER_OFF) }} style={{ width: size, height: size }} />;
export const IconCheerOn   = ({ size = 14 }: IconProps) => <Image source={{ uri: svg2uri(SVG_CHEER_ON) }} style={{ width: size, height: size }} />;

export const IconTypeTreatment = ({ size = 16 }: IconProps) => <Image source={{ uri: svg2uri(SVG_TYPE_TREATMENT) }} style={{ width: size, height: size }} />;
export const IconTypeUnsaid    = ({ size = 16 }: IconProps) => <Image source={{ uri: svg2uri(SVG_TYPE_UNSAID) }} style={{ width: size, height: size }} />;
export const IconTypeQuestion  = ({ size = 16 }: IconProps) => <Image source={{ uri: svg2uri(SVG_TYPE_QUESTION) }} style={{ width: size, height: size }} />;
export const IconTypeHospital  = ({ size = 16 }: IconProps) => <Image source={{ uri: svg2uri(SVG_TYPE_HOSPITAL) }} style={{ width: size, height: size }} />;

export const IconWrite   = ({ size = 18 }: IconProps) => <Image source={{ uri: svg2uri(SVG_WRITE) }} style={{ width: size, height: size }} />;
export const IconComment = ({ size = 14 }: IconProps) => <Image source={{ uri: svg2uri(SVG_COMMENT) }} style={{ width: size, height: size }} />;
export const IconSearch       = ({ size = 16 }: IconProps) => <Image source={{ uri: svg2uri(SVG_SEARCH) }} style={{ width: size, height: size }} />;
export const IconSearchActive = ({ size = 16 }: IconProps) => <Image source={{ uri: svg2uri(SVG_SEARCH_ACTIVE) }} style={{ width: size, height: size }} />;

// ── Deprecated (SvgXml 방식 제거) ─────────────────────────
export const IconHeart     = ({ size = 14, active = false }: IconProps & { active?: boolean }) =>
  active ? <IconHeartOn size={size} /> : <IconHeartOff size={size} />;
export const IconHandshake = ({ size = 14, active = false }: IconProps & { active?: boolean }) =>
  active ? <IconSameOn size={size} /> : <IconSameOff size={size} />;
export const IconFist      = ({ size = 14, active = false }: IconProps & { active?: boolean }) =>
  active ? <IconCheerOn size={size} /> : <IconCheerOff size={size} />;
