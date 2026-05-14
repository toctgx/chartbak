/**
 * 차트밖 커스텀 아이콘 — Wellness Aging Care 디자인 시스템
 * 탭바: 흰 라인 아이콘 (인디고 배경용)
 * 인라인: 카드/화면용 색상 아이콘
 */
import React from 'react';
import { Image } from 'react-native';

const svg2uri = (svg: string) =>
  `data:image/svg+xml,${encodeURIComponent(svg)}`;

// ── 탭바: 홈 (흰색 라인, 인디고 배경용) ──────────────────
const SVG_HOME = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 22l18-16 18 16v20a2 2 0 01-2 2H8a2 2 0 01-2-2V22z" fill="rgba(255,255,255,0.55)"/>
  <rect x="18" y="30" width="12" height="12" rx="2" fill="rgba(255,255,255,0.4)"/>
</svg>`;

const SVG_HOME_ACTIVE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 22l18-16 18 16v20a2 2 0 01-2 2H8a2 2 0 01-2-2V22z" fill="#3D3D8F"/>
  <rect x="18" y="30" width="12" height="12" rx="2" fill="#2F2F7A"/>
</svg>`;

// ── 탭바: 라운지 ──────────────────────────────────────────
const SVG_LOUNGE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="15" cy="16" r="8" fill="rgba(255,255,255,0.55)"/>
  <circle cx="33" cy="16" r="8" fill="rgba(255,255,255,0.55)"/>
  <path d="M2 40c0-8 5.8-14 13-14h18c7.2 0 13 6 13 14" fill="rgba(255,255,255,0.55)"/>
</svg>`;

const SVG_LOUNGE_ACTIVE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="15" cy="16" r="8" fill="#3D3D8F"/>
  <circle cx="33" cy="16" r="8" fill="#3D3D8F"/>
  <path d="M2 40c0-8 5.8-14 13-14h18c7.2 0 13 6 13 14" fill="#3D3D8F"/>
</svg>`;

// ── 탭바: 마이 ────────────────────────────────────────────
const SVG_MYPAGE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="17" r="10" fill="rgba(255,255,255,0.55)"/>
  <path d="M4 44c0-11 9-20 20-20s20 9 20 20" fill="rgba(255,255,255,0.55)"/>
</svg>`;

const SVG_MYPAGE_ACTIVE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="17" r="10" fill="#3D3D8F"/>
  <path d="M4 44c0-11 9-20 20-20s20 9 20 20" fill="#3D3D8F"/>
</svg>`;

// ── 탭바: 한줄일기 ───────────────────────────────────────
const SVG_DIARY = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="4" width="28" height="36" rx="4" fill="rgba(255,255,255,0.55)"/>
  <line x1="14" y1="16" x2="32" y2="16" stroke="rgba(255,255,255,0.3)" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="14" y1="22" x2="32" y2="22" stroke="rgba(255,255,255,0.3)" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="14" y1="28" x2="24" y2="28" stroke="rgba(255,255,255,0.3)" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

const SVG_DIARY_ACTIVE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="4" width="28" height="36" rx="4" fill="#3D3D8F"/>
  <line x1="14" y1="16" x2="32" y2="16" stroke="#2F2F7A" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="14" y1="22" x2="32" y2="22" stroke="#2F2F7A" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="14" y1="28" x2="24" y2="28" stroke="#2F2F7A" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

// ── 탭바: 식단 ────────────────────────────────────────────
const SVG_DIET = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="24" cy="32" rx="16" ry="6" fill="rgba(255,255,255,0.55)"/>
  <rect x="22" y="10" width="4" height="20" rx="2" fill="rgba(255,255,255,0.55)"/>
  <path d="M18 10 Q18 18 22 22" stroke="rgba(255,255,255,0.55)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M30 10 Q30 18 26 22" stroke="rgba(255,255,255,0.55)" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_DIET_ACTIVE = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="24" cy="32" rx="16" ry="6" fill="#3D3D8F"/>
  <rect x="22" y="10" width="4" height="20" rx="2" fill="#3D3D8F"/>
  <path d="M18 10 Q18 18 22 22" stroke="#3D3D8F" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M30 10 Q30 18 26 22" stroke="#3D3D8F" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

// ── FAB 쓰기 아이콘 (흰색) ───────────────────────────────
const SVG_WRITE = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <line x1="12" y1="5" x2="12" y2="19" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="5" y1="12" x2="19" y2="12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

// ── 환자 태그 (옐로우) ────────────────────────────────────
const SVG_PATIENT = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="8" r="5" fill="#F5D547"/>
  <path d="M3 21c0-5 4-9 9-9s9 4 9 9" fill="#F5D547"/>
  <rect x="10" y="5.5" width="4" height="1.5" rx="0.7" fill="#1A1B4B"/>
  <rect x="11.25" y="4" width="1.5" height="4" rx="0.7" fill="#1A1B4B"/>
</svg>`;

// ── 환우 태그 (라벤더) ────────────────────────────────────
const SVG_CAREGIVER = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="7" r="4" fill="#D8D5F0"/>
  <circle cx="16" cy="7" r="4" fill="#D8D5F0"/>
  <path d="M1 21c0-4 3.1-7 7-7h8c3.9 0 7 3 7 7" fill="#D8D5F0"/>
</svg>`;

// ── 공감 아이콘들 ─────────────────────────────────────────
const SVG_HEART_OFF = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 21C12 21 3 14.5 3 8.5A4.5 4.5 0 0112 6a4.5 4.5 0 019 2.5C21 14.5 12 21 12 21z" fill="#D8D5F0"/>
</svg>`;

const SVG_HEART_ON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 21C12 21 3 14.5 3 8.5A4.5 4.5 0 0112 6a4.5 4.5 0 019 2.5C21 14.5 12 21 12 21z" fill="#EF4444"/>
</svg>`;

const SVG_SAME_OFF = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="7" r="3.5" fill="#D8D5F0"/>
  <circle cx="16" cy="7" r="3.5" fill="#D8D5F0"/>
  <path d="M2 19c0-4 2.7-7 6-7h8c3.3 0 6 3 6 7" fill="#D8D5F0"/>
</svg>`;

const SVG_SAME_ON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="7" r="3.5" fill="#3D3D8F"/>
  <circle cx="16" cy="7" r="3.5" fill="#3D3D8F"/>
  <path d="M2 19c0-4 2.7-7 6-7h8c3.3 0 6 3 6 7" fill="#3D3D8F"/>
</svg>`;

const SVG_CHEER_OFF = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="10" width="12" height="10" rx="3" fill="#D8D5F0"/>
  <rect x="7.5" y="6.5" width="3" height="5" rx="1.5" fill="#D8D5F0"/>
  <rect x="11.5" y="5.5" width="3" height="6" rx="1.5" fill="#D8D5F0"/>
  <rect x="15.5" y="6.5" width="3" height="5" rx="1.5" fill="#D8D5F0"/>
  <rect x="4" y="11" width="3" height="5" rx="1.5" fill="#D8D5F0"/>
</svg>`;

const SVG_CHEER_ON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="10" width="12" height="10" rx="3" fill="#3D3D8F"/>
  <rect x="7.5" y="6.5" width="3" height="5" rx="1.5" fill="#3D3D8F"/>
  <rect x="11.5" y="5.5" width="3" height="6" rx="1.5" fill="#3D3D8F"/>
  <rect x="15.5" y="6.5" width="3" height="5" rx="1.5" fill="#3D3D8F"/>
  <rect x="4" y="11" width="3" height="5" rx="1.5" fill="#3D3D8F"/>
</svg>`;

// ── 글 유형 ───────────────────────────────────────────────
const SVG_TYPE_TREATMENT = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="4" width="20" height="24" rx="4" fill="#3D3D8F"/>
  <rect x="6" y="5" width="18" height="22" rx="3" fill="#EEEEF8"/>
  <line x1="9" y1="12" x2="21" y2="12" stroke="#3D3D8F" stroke-width="2" stroke-linecap="round"/>
  <line x1="9" y1="17" x2="21" y2="17" stroke="#3D3D8F" stroke-width="2" stroke-linecap="round"/>
  <line x1="9" y1="22" x2="16" y2="22" stroke="#3D3D8F" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const SVG_TYPE_UNSAID = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 5h20c1.7 0 3 1.3 3 3v13c0 1.7-1.3 3-3 3H18l-5 4-5-4H4c-1.7 0-3-1.3-3-3V8c0-1.7 1.3-3 3-3z" fill="#3D3D8F"/>
  <path d="M5 6h18c1.4 0 2.5 1.1 2.5 2.5v12c0 1.4-1.1 2.5-2.5 2.5H17.5l-4.5 3.5-4.5-3.5H5c-1.4 0-2.5-1.1-2.5-2.5v-12C2.5 7.1 3.6 6 5 6z" fill="#D8D5F0"/>
</svg>`;

const SVG_TYPE_QUESTION = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="14" fill="#3D3D8F"/>
  <text x="16" y="23" text-anchor="middle" font-size="18" font-weight="bold" fill="white" font-family="Arial, sans-serif">?</text>
</svg>`;

const SVG_TYPE_HOSPITAL = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="12" width="20" height="17" rx="2" fill="#3D3D8F"/>
  <rect x="4" y="5" width="20" height="10" rx="2" fill="#2F2F7A"/>
  <rect x="11" y="8" width="6" height="1.5" rx="0.7" fill="#F5D547"/>
  <rect x="13.25" y="6" width="1.5" height="5" rx="0.7" fill="#F5D547"/>
  <rect x="8" y="18" width="4" height="4" rx="1" fill="white" opacity="0.85"/>
  <rect x="16" y="18" width="4" height="4" rx="1" fill="white" opacity="0.85"/>
  <rect x="11" y="23" width="6" height="5" rx="1" fill="white" opacity="0.9"/>
</svg>`;

// ── 검색 아이콘 ───────────────────────────────────────────
const SVG_SEARCH = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="11" cy="11" r="7" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" fill="none"/>
  <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

const SVG_SEARCH_ACTIVE = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="11" cy="11" r="7" stroke="#1A1B4B" stroke-width="2.5" fill="none"/>
  <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#1A1B4B" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

// ── 댓글 아이콘 ───────────────────────────────────────────
const SVG_COMMENT = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 4h16c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2h-5l-3 3-3-3H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="#9B9BC4"/>
</svg>`;

// ─────────────────────────────────────────────────────────
// React 컴포넌트
// ─────────────────────────────────────────────────────────

interface IconProps { size?: number }

export const IconHome         = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_HOME) }} style={{ width: size, height: size }} />;
export const IconHomeActive   = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_HOME_ACTIVE) }} style={{ width: size, height: size }} />;
export const IconLounge       = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_LOUNGE) }} style={{ width: size, height: size }} />;
export const IconLoungeActive = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_LOUNGE_ACTIVE) }} style={{ width: size, height: size }} />;
export const IconMyPage       = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_MYPAGE) }} style={{ width: size, height: size }} />;
export const IconMyPageActive = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_MYPAGE_ACTIVE) }} style={{ width: size, height: size }} />;
export const IconDiet         = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_DIET) }} style={{ width: size, height: size }} />;
export const IconDietActive   = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_DIET_ACTIVE) }} style={{ width: size, height: size }} />;
export const IconDiary        = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_DIARY) }} style={{ width: size, height: size }} />;
export const IconDiaryActive  = ({ size = 26 }: IconProps) => <Image source={{ uri: svg2uri(SVG_DIARY_ACTIVE) }} style={{ width: size, height: size }} />;

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

// backward-compat aliases
export const IconHeart     = ({ size = 14, active = false }: IconProps & { active?: boolean }) =>
  active ? <IconHeartOn size={size} /> : <IconHeartOff size={size} />;
export const IconHandshake = ({ size = 14, active = false }: IconProps & { active?: boolean }) =>
  active ? <IconSameOn size={size} /> : <IconSameOff size={size} />;
export const IconFist      = ({ size = 14, active = false }: IconProps & { active?: boolean }) =>
  active ? <IconCheerOn size={size} /> : <IconCheerOff size={size} />;
