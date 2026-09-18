// ==UserScript==
// @name         WhatsApp Web Privacy Blur
// @namespace    https://github.com/bagusarief13/
// @version      1.0.0
// @description  Blur sensitive WhatsApp Web previews
// @match        https://web.whatsapp.com/*
// @run-at       document-start
// @grant        none
// @updateURL    https://raw.githubusercontent.com/bagusarief13/whatsapp-web-privacy-blur/main/whatsapp-web-privacy-blur.user.js
// @downloadURL  https://raw.githubusercontent.com/bagusarief13/whatsapp-web-privacy-blur/main/whatsapp-web-privacy-blur.user.js
// ==/UserScript==

(function () {
    'use strict';

    const BLUR_AMOUNT = '8px';

    // ============================================================
    // STATE & PERSISTENCE
    // ============================================================

    const STORAGE_KEY_CHAT = 'wa_privacy_blur_chat_list';
    const STORAGE_KEY_MSGS = 'wa_privacy_blur_messages';
    const STORAGE_KEY_COLLAPSED = 'wa_privacy_blur_collapsed';

    let isChatListBlurEnabled = localStorage.getItem(STORAGE_KEY_CHAT) !== 'false';
    let isMessagesBlurEnabled = localStorage.getItem(STORAGE_KEY_MSGS) !== 'false';
    let isDockCollapsed = localStorage.getItem(STORAGE_KEY_COLLAPSED) === 'true';

    function updateBlurRootClasses() {
        if (!document.documentElement) {
            return;
        }
        document.documentElement.classList.toggle('wa-chat-blur-disabled', !isChatListBlurEnabled);
        document.documentElement.classList.toggle('wa-msgs-blur-disabled', !isMessagesBlurEnabled);
    }

    // Apply root classes immediately at startup
    updateBlurRootClasses();


    // ============================================================
    // CSS
    // ============================================================

    const style = document.createElement('style');

    style.textContent = `
        /* ========================================================
           CHAT LIST
           ======================================================== */

        /*
         * Contact name
         */
        html:not(.wa-chat-blur-disabled) .wa-privacy-chat-name {
            filter: blur(${BLUR_AMOUNT}) !important;
            transition: filter 0.12s ease !important;
        }

        /*
         * Chat preview text (class-based)
         */
        html:not(.wa-chat-blur-disabled) .wa-privacy-chat-preview {
            filter: blur(${BLUR_AMOUNT}) !important;
            transition: filter 0.12s ease !important;
        }

        /*
         * Fallback preview text
         */
        html:not(.wa-chat-blur-disabled) .wa-privacy-chat-preview-fallback {
            filter: blur(${BLUR_AMOUNT}) !important;
            transition: filter 0.12s ease !important;
        }

        /*
         * Direct CSS targeting for instant zero-flash blurring on chat previews
         * so newly arrived messages are blurred immediately on DOM insertion.
         */
        :where(html:not(.wa-chat-blur-disabled)) [data-testid="cell-frame-secondary"] span[dir="ltr"],
        :where(html:not(.wa-chat-blur-disabled)) [data-testid="cell-frame-secondary"] span[dir="auto"],
        :where(html:not(.wa-chat-blur-disabled)) [data-testid="cell-frame-secondary"] span[dir="rtl"],
        :where(html:not(.wa-chat-blur-disabled)) [data-testid="cell-frame-subtitle"] span,
        :where(html:not(.wa-chat-blur-disabled)) [data-testid="last-msg-status"] span {
            filter: blur(${BLUR_AMOUNT}) !important;
            transition: filter 0.12s ease !important;
        }

        /*
         * Timestamp - Intentionally NOT blurred.
         */
        .wa-privacy-chat-time,
        [data-testid="cell-frame-primary-detail"],
        [data-testid="cell-frame-primary-detail"] * {
            filter: none !important;
        }

        /*
         * Status icons, read receipts, indicators, unread count badges - NOT blurred.
         */
        .wa-privacy-chat-status,
        .wa-privacy-chat-indicator,
        [data-testid*="badge"],
        [data-testid*="badge"] *,
        [data-testid*="unread"],
        [data-testid*="unread"] *,
        [aria-label*="unread" i],
        [aria-label*="Pinned" i],
        [data-testid="icon-pinned"],
        [data-testid="icon-muted"],
        [data-testid="cell-frame-secondary"] svg,
        [data-testid="cell-frame-secondary"] svg * {
            filter: none !important;
        }

        /*
         * When hovering ANY part of the chat row / list item,
         * reveal both the contact name and the message preview together.
         */
        html .wa-privacy-chat-row:hover .wa-privacy-chat-name,
        html .wa-privacy-chat-row:hover .wa-privacy-chat-preview,
        html .wa-privacy-chat-row:hover .wa-privacy-chat-preview-fallback,
        html .wa-privacy-chat-row:hover [data-testid="cell-frame-secondary"] span,
        html .wa-privacy-chat-row:hover [data-testid="cell-frame-secondary"] span[dir="ltr"],
        html .wa-privacy-chat-row:hover [data-testid="cell-frame-secondary"] span[dir="auto"],
        html .wa-privacy-chat-row:hover [data-testid="cell-frame-secondary"] span[dir="rtl"],
        html .wa-privacy-chat-row:hover [data-testid="cell-frame-subtitle"] span,
        html .wa-privacy-chat-row:hover [data-testid="cell-frame-subtitle"] span[dir="ltr"],
        html .wa-privacy-chat-row:hover [data-testid="cell-frame-subtitle"] span[dir="auto"],
        html .wa-privacy-chat-row:hover [data-testid="cell-frame-subtitle"] span[dir="rtl"],
        html .wa-privacy-chat-row:hover [data-testid="last-msg-status"] span,
        html .wa-privacy-chat-row:hover [data-testid="last-msg-status"] span[dir="ltr"],
        html .wa-privacy-chat-row:hover [data-testid="last-msg-status"] span[dir="auto"],
        html .wa-privacy-chat-row:hover [data-testid="last-msg-status"] span[dir="rtl"],

        html [role="listitem"]:hover .wa-privacy-chat-name,
        html [role="listitem"]:hover .wa-privacy-chat-preview,
        html [role="listitem"]:hover .wa-privacy-chat-preview-fallback,
        html [role="listitem"]:hover [data-testid="cell-frame-secondary"] span,
        html [role="listitem"]:hover [data-testid="cell-frame-secondary"] span[dir="ltr"],
        html [role="listitem"]:hover [data-testid="cell-frame-secondary"] span[dir="auto"],
        html [role="listitem"]:hover [data-testid="cell-frame-secondary"] span[dir="rtl"],
        html [role="listitem"]:hover [data-testid="cell-frame-subtitle"] span,
        html [role="listitem"]:hover [data-testid="cell-frame-subtitle"] span[dir="ltr"],
        html [role="listitem"]:hover [data-testid="cell-frame-subtitle"] span[dir="auto"],
        html [role="listitem"]:hover [data-testid="cell-frame-subtitle"] span[dir="rtl"],
        html [role="listitem"]:hover [data-testid="last-msg-status"] span,
        html [role="listitem"]:hover [data-testid="last-msg-status"] span[dir="ltr"],
        html [role="listitem"]:hover [data-testid="last-msg-status"] span[dir="auto"],
        html [role="listitem"]:hover [data-testid="last-msg-status"] span[dir="rtl"],

        html [role="row"]:hover .wa-privacy-chat-name,
        html [role="row"]:hover .wa-privacy-chat-preview,
        html [role="row"]:hover .wa-privacy-chat-preview-fallback,
        html [role="row"]:hover [data-testid="cell-frame-secondary"] span,
        html [role="row"]:hover [data-testid="cell-frame-secondary"] span[dir="ltr"],
        html [role="row"]:hover [data-testid="cell-frame-secondary"] span[dir="auto"],
        html [role="row"]:hover [data-testid="cell-frame-secondary"] span[dir="rtl"],
        html [role="row"]:hover [data-testid="cell-frame-subtitle"] span,
        html [role="row"]:hover [data-testid="cell-frame-subtitle"] span[dir="ltr"],
        html [role="row"]:hover [data-testid="cell-frame-subtitle"] span[dir="auto"],
        html [role="row"]:hover [data-testid="cell-frame-subtitle"] span[dir="rtl"],
        html [role="row"]:hover [data-testid="last-msg-status"] span,
        html [role="row"]:hover [data-testid="last-msg-status"] span[dir="ltr"],
        html [role="row"]:hover [data-testid="last-msg-status"] span[dir="auto"],
        html [role="row"]:hover [data-testid="last-msg-status"] span[dir="rtl"],

        html div.x78zum5.xdl72j9.xdt5ytf:hover .wa-privacy-chat-name,
        html div.x78zum5.xdl72j9.xdt5ytf:hover .wa-privacy-chat-preview,
        html div.x78zum5.xdl72j9.xdt5ytf:hover [data-testid="cell-frame-secondary"] span,
        html div.x78zum5.xdl72j9.xdt5ytf:hover [data-testid="cell-frame-secondary"] span[dir="ltr"],
        html div.x78zum5.xdl72j9.xdt5ytf:hover [data-testid="cell-frame-secondary"] span[dir="auto"],
        html div.x78zum5.xdl72j9.xdt5ytf:hover [data-testid="cell-frame-secondary"] span[dir="rtl"],

        /* Direct element hover */
        .wa-privacy-chat-name:hover,
        .wa-privacy-chat-preview:hover,
        .wa-privacy-chat-preview-fallback:hover,
        [data-testid="cell-frame-secondary"] span:hover,
        [data-testid="cell-frame-secondary"] span[dir="ltr"]:hover,
        [data-testid="cell-frame-secondary"] span[dir="auto"]:hover,
        [data-testid="cell-frame-secondary"] span[dir="rtl"]:hover,
        [data-testid="cell-frame-subtitle"] span:hover,
        [data-testid="last-msg-status"] span:hover {
            filter: none !important;
        }

        /*
         * OVERRIDE: Chat List blur explicitly disabled
         */
        html.wa-chat-blur-disabled .wa-privacy-chat-name,
        html.wa-chat-blur-disabled .wa-privacy-chat-preview,
        html.wa-chat-blur-disabled .wa-privacy-chat-preview-fallback,
        html.wa-chat-blur-disabled [data-testid="cell-frame-secondary"] span[dir="ltr"],
        html.wa-chat-blur-disabled [data-testid="cell-frame-secondary"] span[dir="auto"],
        html.wa-chat-blur-disabled [data-testid="cell-frame-secondary"] span[dir="rtl"],
        html.wa-chat-blur-disabled [data-testid="cell-frame-subtitle"] span,
        html.wa-chat-blur-disabled [data-testid="last-msg-status"] span {
            filter: none !important;
        }


        /* ========================================================
           MESSAGE AREA
           ======================================================== */

        html:not(.wa-msgs-blur-disabled) .wa-privacy-message {
            filter: blur(${BLUR_AMOUNT}) !important;
            transition: filter 0.12s ease !important;
        }

        html:not(.wa-msgs-blur-disabled) .wa-privacy-message:hover {
            filter: none !important;
        }

        html:not(.wa-msgs-blur-disabled) .wa-privacy-blur {
            filter: blur(${BLUR_AMOUNT}) !important;
            transition: filter 0.12s ease !important;
        }

        html:not(.wa-msgs-blur-disabled) .wa-privacy-blur:hover {
            filter: none !important;
        }

        html:not(.wa-msgs-blur-disabled) .wa-privacy-phone {
            filter: blur(${BLUR_AMOUNT}) !important;
            transition: filter 0.12s ease !important;
        }

        html:not(.wa-msgs-blur-disabled) .wa-privacy-phone:hover {
            filter: none !important;
        }

        html:not(.wa-msgs-blur-disabled) .wa-privacy-time {
            filter: blur(${BLUR_AMOUNT}) !important;
            transition: filter 0.12s ease !important;
        }

        html:not(.wa-msgs-blur-disabled) .wa-privacy-time:hover {
            filter: none !important;
        }

        html:not(.wa-msgs-blur-disabled) .wa-privacy-status {
            filter: blur(${BLUR_AMOUNT}) !important;
            transition: filter 0.12s ease !important;
        }

        html:not(.wa-msgs-blur-disabled) .wa-privacy-status:hover {
            filter: none !important;
        }

        /*
         * OVERRIDE: Message Area blur explicitly disabled
         */
        html.wa-msgs-blur-disabled .wa-privacy-message,
        html.wa-msgs-blur-disabled .wa-privacy-blur,
        html.wa-msgs-blur-disabled .wa-privacy-phone,
        html.wa-msgs-blur-disabled .wa-privacy-time,
        html.wa-msgs-blur-disabled .wa-privacy-status {
            filter: none !important;
        }


        /* ========================================================
           FLOATING PRIVACY CONTROL DOCK & TOAST
           ======================================================== */

        #wa-privacy-btn-container {
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
            font-family: inherit;
            user-select: none;
            -webkit-user-select: none;
            pointer-events: auto;
        }

        #wa-privacy-control-dock {
            display: inline-flex;
            align-items: center;
            background: rgba(17, 27, 33, 0.92);
            border: 1px solid rgba(255, 255, 255, 0.14);
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
            border-radius: 20px;
            padding: 3px 5px;
            gap: 4px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Light mode support */
        html:not([class*="dark"]) #wa-privacy-control-dock {
            background: rgba(255, 255, 255, 0.94);
            border: 1px solid rgba(0, 0, 0, 0.12);
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.14);
        }

        .wa-privacy-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            padding: 0 10px;
            border-radius: 16px;
            background: transparent;
            color: #8696a0;
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.18s ease;
            font-size: 12px;
            font-weight: 500;
            gap: 6px;
            outline: none;
        }

        .wa-privacy-btn svg {
            width: 15px;
            height: 15px;
            fill: currentColor;
            flex-shrink: 0;
            transition: transform 0.3s ease, fill 0.18s ease;
        }

        /* Handle button (collapse / expand toggle) */
        .wa-privacy-handle-btn {
            padding: 0 8px;
            gap: 6px;
            color: #e9edef;
        }

        html:not([class*="dark"]) .wa-privacy-handle-btn {
            color: #111b21;
        }

        .wa-privacy-handle-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #00a884;
            box-shadow: 0 0 6px rgba(0, 168, 132, 0.7);
            transition: background 0.2s ease, box-shadow 0.2s ease;
            flex-shrink: 0;
        }

        .wa-privacy-handle-dot.partial {
            background: #eab308;
            box-shadow: 0 0 6px rgba(234, 179, 8, 0.7);
        }

        .wa-privacy-handle-dot.disabled {
            background: #ef4444;
            box-shadow: 0 0 6px rgba(239, 68, 68, 0.7);
        }

        .wa-privacy-icon-chevron {
            width: 13px;
            height: 13px;
            fill: currentColor;
            transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0.75;
        }

        #wa-privacy-control-dock.collapsed .wa-privacy-icon-chevron {
            transform: rotate(0deg);
        }

        #wa-privacy-control-dock:not(.collapsed) .wa-privacy-icon-chevron {
            transform: rotate(180deg);
        }

        /* Collapsible dock items container */
        #wa-privacy-dock-content {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            max-width: 380px;
            opacity: 1;
            transform: scaleX(1);
            transform-origin: left center;
            overflow: hidden;
            transition: max-width 0.28s cubic-bezier(0.4, 0, 0.2, 1),
                        opacity 0.2s ease,
                        transform 0.28s ease,
                        margin 0.28s ease;
        }

        #wa-privacy-control-dock.collapsed #wa-privacy-dock-content {
            max-width: 0;
            opacity: 0;
            transform: scaleX(0.85);
            pointer-events: none;
            margin: 0;
        }

        /* Active toggle state (Blur ON) */
        .wa-privacy-btn.active {
            background: rgba(0, 168, 132, 0.16);
            color: #e9edef;
            border-color: rgba(0, 168, 132, 0.35);
        }

        html:not([class*="dark"]) .wa-privacy-btn.active {
            background: rgba(0, 168, 132, 0.12);
            color: #111b21;
            border-color: rgba(0, 168, 132, 0.3);
        }

        .wa-privacy-btn.active .wa-privacy-status-badge {
            background: #00a884;
            color: #ffffff;
        }

        .wa-privacy-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            color: #e9edef;
            transform: translateY(-1px);
        }

        html:not([class*="dark"]) .wa-privacy-btn:hover {
            background: rgba(0, 0, 0, 0.06);
            color: #111b21;
        }

        .wa-privacy-btn.active:hover {
            background: rgba(0, 168, 132, 0.24);
            border-color: #00a884;
        }

        .wa-privacy-btn:active {
            transform: translateY(0) scale(0.97);
        }

        .wa-privacy-status-badge {
            display: inline-block;
            padding: 1px 5px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: 700;
            line-height: 1.2;
            background: rgba(134, 150, 160, 0.3);
            color: #8696a0;
            transition: all 0.18s ease;
        }

        /* Reload button styling */
        #wa-privacy-reload-btn {
            padding: 0 8px;
            min-width: 32px;
        }

        #wa-privacy-reload-btn:hover svg {
            transform: rotate(45deg);
        }

        #wa-privacy-reload-btn.spinning svg {
            transform: rotate(360deg);
            transition: transform 0.5s ease;
        }

        /* Toast */
        #wa-privacy-toast {
            white-space: nowrap;
            background: rgba(11, 20, 26, 0.95);
            color: #00a884;
            font-size: 11.5px;
            font-weight: 600;
            padding: 5px 11px;
            border-radius: 6px;
            border: 1px solid rgba(0, 168, 132, 0.35);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transform: translateY(6px);
            pointer-events: none;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }

        html:not([class*="dark"]) #wa-privacy-toast {
            background: rgba(255, 255, 255, 0.96);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        #wa-privacy-toast.show {
            opacity: 1;
            transform: translateY(0);
        }
    `;

    (document.head || document.documentElement).appendChild(style);


    // ============================================================
    // Helpers
    // ============================================================

    function addClass(element, className) {
        if (!element || !(element instanceof HTMLElement)) {
            return;
        }

        element.classList.add(className);
    }

    function isVisible(element) {
        if (!element || !(element instanceof HTMLElement)) {
            return false;
        }

        if (!element.isConnected) {
            return false;
        }

        const compStyle = window.getComputedStyle(element);
        return compStyle.display !== 'none' && compStyle.visibility !== 'hidden' && compStyle.opacity !== '0';
    }


    // ============================================================
    // CHAT LIST - FIND ROW
    // ============================================================

    function getChatRow(element) {
        if (!element) {
            return null;
        }

        return (
            element.closest('.wa-privacy-chat-row') ||
            element.closest('[role="listitem"]') ||
            element.closest('[role="row"]') ||
            element.closest('div.x78zum5.xdl72j9.xdt5ytf') ||
            element.closest('[role="gridcell"][aria-colindex="2"]') ||
            element.closest('[data-testid="cell-frame-title"]')?.parentElement ||
            element.closest('[data-testid="cell-frame-secondary"]')?.parentElement
        );
    }


    // ============================================================
    // CHAT LIST - CONTACT NAME
    // ============================================================

    function markChatListName(chatRow) {
        if (!chatRow) {
            return;
        }

        const name = chatRow.querySelector(
            '[data-testid="cell-frame-title"] span[dir="auto"][title], ' +
            '[data-testid="cell-frame-title"] span[title], ' +
            '[data-testid="cell-frame-title"] span[dir="auto"]'
        );

        if (!name) {
            return;
        }

        addClass(name, 'wa-privacy-chat-name');
    }


    // ============================================================
    // CHAT LIST - LAST MESSAGE PREVIEW (INCOMING & OUTGOING)
    // ============================================================

    function markChatListLastMessage(chatRow) {
        if (!chatRow) {
            return;
        }

        const secondaryContainer =
            chatRow.querySelector('[data-testid="cell-frame-secondary"]') ||
            chatRow.querySelector('[data-testid="cell-frame-subtitle"]') ||
            chatRow.querySelector('[data-testid="last-msg-status"]')?.parentElement;

        const lastMsgStatus = chatRow.querySelector(
            '[data-testid="last-msg-status"]'
        );

        const candidateElements = [];
        if (secondaryContainer) {
            candidateElements.push(...secondaryContainer.querySelectorAll('span'));
        }
        if (lastMsgStatus) {
            candidateElements.push(...lastMsgStatus.querySelectorAll('span'));
        }

        const subtitle = chatRow.querySelector('[data-testid="cell-frame-subtitle"]');
        if (subtitle) {
            candidateElements.push(...subtitle.querySelectorAll('span'));
            candidateElements.push(subtitle);
        }

        const candidateSpans = new Set(candidateElements);
        let foundPreview = false;

        candidateSpans.forEach((span) => {
            if (!(span instanceof HTMLElement)) {
                return;
            }

            // Never blur primary title, timestamp, badges, or existing markers
            if (
                span.closest('[data-testid="cell-frame-title"]') ||
                span.closest('[data-testid="cell-frame-primary-detail"]') ||
                span.closest('[data-testid*="badge"]') ||
                span.closest('[data-testid*="unread"]') ||
                span.closest('[aria-label*="unread" i]') ||
                span.classList.contains('wa-privacy-chat-name') ||
                span.classList.contains('wa-privacy-chat-time') ||
                span.classList.contains('wa-privacy-chat-status') ||
                span.classList.contains('wa-privacy-chat-indicator')
            ) {
                return;
            }

            // Check if element is icon-only
            if (span.querySelector('svg, img, video, canvas') && !span.textContent?.trim()) {
                return;
            }

            // If it has children spans with text, avoid blurring container to prevent nested blur issues
            const hasNestedTextSpan = Array.from(span.children).some(
                (child) => child instanceof HTMLElement && child.tagName === 'SPAN' && child.textContent?.trim()
            );
            if (hasNestedTextSpan) {
                return;
            }

            const text = (span.textContent || '').trim();
            if (!text && !span.textContent) {
                return;
            }

            if (!isVisible(span)) {
                return;
            }

            addClass(span, 'wa-privacy-chat-preview');
            foundPreview = true;
        });

        // Fallback 1: Query dir spans inside secondary container
        if (!foundPreview && secondaryContainer) {
            const autoSpans = secondaryContainer.querySelectorAll(
                'span[dir="ltr"], span[dir="auto"], span[dir="rtl"]'
            );
            autoSpans.forEach((span) => {
                if (
                    span instanceof HTMLElement &&
                    !span.closest('[data-testid="cell-frame-title"]') &&
                    !span.closest('[data-testid="cell-frame-primary-detail"]') &&
                    isVisible(span)
                ) {
                    addClass(span, 'wa-privacy-chat-preview');
                    foundPreview = true;
                }
            });
        }

        // Fallback 2: Direct subtitle element
        if (!foundPreview && subtitle instanceof HTMLElement && isVisible(subtitle)) {
            const text = (subtitle.textContent || '').trim();
            if (text) {
                addClass(subtitle, 'wa-privacy-chat-preview-fallback');
                foundPreview = true;
            }
        }
    }


    // ============================================================
    // CHAT LIST - TIMESTAMP
    // ============================================================

    function markChatListTimestamp(chatRow) {
        if (!chatRow) {
            return;
        }

        const timestamp = chatRow.querySelector(
            '[data-testid="cell-frame-primary-detail"]'
        );

        if (!timestamp) {
            return;
        }

        addClass(timestamp, 'wa-privacy-chat-time');
    }


    // ============================================================
    // CHAT LIST - STATUS
    // ============================================================

    function markChatListStatus(chatRow) {
        if (!chatRow) {
            return;
        }

        /*
         * Status icons are intentionally left visible.
         */
        const statusElements = chatRow.querySelectorAll(
            '[data-testid*="status"], ' +
            '[aria-label*="read" i], ' +
            '[aria-label*="sent" i], ' +
            '[aria-label*="delivered" i], ' +
            '[aria-label*="unread" i]'
        );

        statusElements.forEach((element) => {
            if (element instanceof HTMLElement) {
                addClass(element, 'wa-privacy-chat-status');
            }
        });

        chatRow.querySelectorAll('svg title').forEach((title) => {
            const parent = title.closest('svg');
            if (parent instanceof HTMLElement) {
                addClass(parent, 'wa-privacy-chat-status');
            }
        });
    }


    // ============================================================
    // CHAT LIST - INDICATORS
    // ============================================================

    function markChatListIndicators(chatRow) {
        if (!chatRow) {
            return;
        }

        const indicators = chatRow.querySelectorAll(
            '[aria-label*="Pinned" i], ' +
            '[aria-label*="Unread" i], ' +
            '[data-testid*="badge" i], ' +
            '[data-testid*="unread" i]'
        );

        indicators.forEach((element) => {
            if (element instanceof HTMLElement) {
                addClass(element, 'wa-privacy-chat-indicator');
            }
        });
    }


    // ============================================================
    // PROCESS CHAT ROW
    // ============================================================

    function processChatRow(chatRow) {
        if (!chatRow) {
            return;
        }

        addClass(chatRow, 'wa-privacy-chat-row');

        const parentContainer =
            chatRow.closest('div.x78zum5.xdl72j9.xdt5ytf') ||
            chatRow.closest('[role="listitem"]') ||
            chatRow.closest('[role="row"]') ||
            chatRow.parentElement;

        if (parentContainer) {
            addClass(parentContainer, 'wa-privacy-chat-row');
        }

        markChatListName(chatRow);
        markChatListLastMessage(chatRow);
        markChatListTimestamp(chatRow);
        markChatListStatus(chatRow);
        markChatListIndicators(chatRow);
    }


    // ============================================================
    // PROCESS ALL CHAT LIST ROWS
    // ============================================================

    function processAllChatListRows() {
        const seenRows = new Set();

        const markers = document.querySelectorAll(
            '[data-testid="cell-frame-title"], ' +
            '[data-testid="cell-frame-secondary"], ' +
            '[data-testid="cell-frame-subtitle"], ' +
            '[role="gridcell"][aria-colindex="2"]'
        );

        markers.forEach((el) => {
            const row = getChatRow(el);
            if (row && !seenRows.has(row)) {
                seenRows.add(row);
                processChatRow(row);
            }
        });

        // Also check virtualized listitems directly in the chat pane
        const listItems = document.querySelectorAll(
            '#pane-side [role="listitem"], #pane-side [role="row"], [data-testid="chat-list"] [role="listitem"]'
        );
        listItems.forEach((row) => {
            if (!seenRows.has(row)) {
                seenRows.add(row);
                processChatRow(row);
            }
        });
    }


    // ============================================================
    // MESSAGE PROCESSING (ACTIVE CHAT)
    // ============================================================

    function markMessage(element) {
        if (!(element instanceof HTMLElement)) {
            return;
        }

        if (element.classList.contains('wa-privacy-message')) {
            return;
        }

        addClass(element, 'wa-privacy-message');
    }

    function processMessages() {
        // Message text with data-pre-plain-text
        document.querySelectorAll(
            '[data-pre-plain-text]'
        ).forEach((element) => {
            if (element instanceof HTMLElement) {
                const messageContainer =
                    element.closest('[data-testid="msg-container"]') ||
                    element.closest('[role="row"]') ||
                    element;

                markMessage(messageContainer);
            }
        });

        // Message containers
        document.querySelectorAll(
            '[data-testid="msg-container"]'
        ).forEach((element) => {
            if (element instanceof HTMLElement) {
                markMessage(element);
            }
        });
    }


    // ============================================================
    // PROCESS SCHEDULER
    // ============================================================

    let scheduled = false;

    function scheduleProcess(forceImmediate = false) {
        if (forceImmediate) {
            processMessages();
            processAllChatListRows();
            return;
        }

        if (scheduled) {
            return;
        }

        scheduled = true;

        requestAnimationFrame(() => {
            scheduled = false;
            processMessages();
            processAllChatListRows();
        });
    }


    // ============================================================
    // TOAST & TOGGLE CONTROLLERS
    // ============================================================

    let toastTimeout = null;

    function showToast(message) {
        const toast = document.getElementById('wa-privacy-toast');
        if (!toast) {
            return;
        }

        toast.textContent = message;
        toast.classList.add('show');

        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 1400);
    }

    function updateControlBarUI() {
        const dock = document.getElementById('wa-privacy-control-dock');
        if (dock) {
            dock.classList.toggle('collapsed', isDockCollapsed);
        }

        const collapseBtn = document.getElementById('wa-privacy-collapse-btn');
        if (collapseBtn) {
            const dot = collapseBtn.querySelector('.wa-privacy-handle-dot');
            if (dot) {
                dot.classList.remove('partial', 'disabled');
                if (!isChatListBlurEnabled && !isMessagesBlurEnabled) {
                    dot.classList.add('disabled');
                } else if (!isChatListBlurEnabled || !isMessagesBlurEnabled) {
                    dot.classList.add('partial');
                }
            }
            collapseBtn.title = isDockCollapsed
                ? `Privacy Controls (Chats: ${isChatListBlurEnabled ? 'ON' : 'OFF'}, Messages: ${isMessagesBlurEnabled ? 'ON' : 'OFF'}) - Click to Expand (Alt+P)`
                : 'Collapse Privacy Controls (Alt+P)';
        }

        const chatBtn = document.getElementById('wa-privacy-toggle-chat-btn');
        if (chatBtn) {
            chatBtn.classList.toggle('active', isChatListBlurEnabled);
            const badge = chatBtn.querySelector('.wa-privacy-status-badge');
            if (badge) {
                badge.textContent = isChatListBlurEnabled ? 'ON' : 'OFF';
            }
            chatBtn.title = `Chat List Blur: ${isChatListBlurEnabled ? 'Enabled' : 'Disabled'} (Alt+C)`;
        }

        const msgsBtn = document.getElementById('wa-privacy-toggle-msgs-btn');
        if (msgsBtn) {
            msgsBtn.classList.toggle('active', isMessagesBlurEnabled);
            const badge = msgsBtn.querySelector('.wa-privacy-status-badge');
            if (badge) {
                badge.textContent = isMessagesBlurEnabled ? 'ON' : 'OFF';
            }
            msgsBtn.title = `Messages Blur: ${isMessagesBlurEnabled ? 'Enabled' : 'Disabled'} (Alt+M)`;
        }
    }

    function toggleDockCollapse(notify = false) {
        isDockCollapsed = !isDockCollapsed;
        localStorage.setItem(STORAGE_KEY_COLLAPSED, isDockCollapsed ? 'true' : 'false');
        updateControlBarUI();

        if (notify) {
            showToast(isDockCollapsed ? 'Privacy Controls Collapsed' : 'Privacy Controls Expanded');
        }
    }

    function toggleChatListBlur(notify = true) {
        isChatListBlurEnabled = !isChatListBlurEnabled;
        localStorage.setItem(STORAGE_KEY_CHAT, isChatListBlurEnabled ? 'true' : 'false');
        updateBlurRootClasses();
        updateControlBarUI();

        if (isChatListBlurEnabled) {
            scheduleProcess(true);
        }

        if (notify) {
            showToast(`Chat List Blur: ${isChatListBlurEnabled ? 'Enabled' : 'Disabled'}`);
        }
    }

    function toggleMessagesBlur(notify = true) {
        isMessagesBlurEnabled = !isMessagesBlurEnabled;
        localStorage.setItem(STORAGE_KEY_MSGS, isMessagesBlurEnabled ? 'true' : 'false');
        updateBlurRootClasses();
        updateControlBarUI();

        if (isMessagesBlurEnabled) {
            scheduleProcess(true);
        }

        if (notify) {
            showToast(`Messages Blur: ${isMessagesBlurEnabled ? 'Enabled' : 'Disabled'}`);
        }
    }


    // ============================================================
    // FLOATING CONTROL DOCK
    // ============================================================

    function createFloatingControlBar() {
        if (document.getElementById('wa-privacy-btn-container')) {
            updateControlBarUI();
            return;
        }

        const container = document.createElement('div');
        container.id = 'wa-privacy-btn-container';

        const toast = document.createElement('div');
        toast.id = 'wa-privacy-toast';
        toast.textContent = 'Privacy Controls Ready';
        container.appendChild(toast);

        const dock = document.createElement('div');
        dock.id = 'wa-privacy-control-dock';
        if (isDockCollapsed) {
            dock.classList.add('collapsed');
        }

        // 0. Collapse/Expand Toggle Handle Button
        const collapseBtn = document.createElement('button');
        collapseBtn.id = 'wa-privacy-collapse-btn';
        collapseBtn.className = 'wa-privacy-btn wa-privacy-handle-btn';
        collapseBtn.type = 'button';
        collapseBtn.setAttribute('aria-label', 'Toggle Expand or Collapse Privacy Controls');
        collapseBtn.innerHTML = `
            <svg viewBox="0 0 24 24" style="width:15px;height:15px;">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 8.96-7 10.02-3.87-1.06-7-5.35-7-10.02V6.3l7-3.12z"/>
            </svg>
            <span class="wa-privacy-handle-dot"></span>
            <svg class="wa-privacy-icon-chevron" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
        `;
        collapseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDockCollapse(false);
        });
        dock.appendChild(collapseBtn);

        // Collapsible dock content items
        const dockContent = document.createElement('div');
        dockContent.id = 'wa-privacy-dock-content';

        // 1. Chat List Blur Toggle Button
        const chatBtn = document.createElement('button');
        chatBtn.id = 'wa-privacy-toggle-chat-btn';
        chatBtn.className = 'wa-privacy-btn' + (isChatListBlurEnabled ? ' active' : '');
        chatBtn.type = 'button';
        chatBtn.title = `Chat List Blur: ${isChatListBlurEnabled ? 'Enabled' : 'Disabled'} (Alt+C)`;
        chatBtn.setAttribute('aria-label', 'Toggle WhatsApp Web Chat List Blur');
        chatBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
            <span>Chats</span>
            <span class="wa-privacy-status-badge">${isChatListBlurEnabled ? 'ON' : 'OFF'}</span>
        `;
        chatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleChatListBlur(true);
        });
        dockContent.appendChild(chatBtn);

        // 2. Messages Blur Toggle Button
        const msgsBtn = document.createElement('button');
        msgsBtn.id = 'wa-privacy-toggle-msgs-btn';
        msgsBtn.className = 'wa-privacy-btn' + (isMessagesBlurEnabled ? ' active' : '');
        msgsBtn.type = 'button';
        msgsBtn.title = `Messages Blur: ${isMessagesBlurEnabled ? 'Enabled' : 'Disabled'} (Alt+M)`;
        msgsBtn.setAttribute('aria-label', 'Toggle WhatsApp Web Messages Blur');
        msgsBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
            </svg>
            <span>Messages</span>
            <span class="wa-privacy-status-badge">${isMessagesBlurEnabled ? 'ON' : 'OFF'}</span>
        `;
        msgsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMessagesBlur(true);
        });
        dockContent.appendChild(msgsBtn);

        // 3. Refresh Reload Button
        const reloadBtn = document.createElement('button');
        reloadBtn.id = 'wa-privacy-reload-btn';
        reloadBtn.className = 'wa-privacy-btn';
        reloadBtn.type = 'button';
        reloadBtn.title = 'Refresh Privacy Blur (Alt+R)';
        reloadBtn.setAttribute('aria-label', 'Refresh WhatsApp Web Privacy Blur');
        reloadBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
        `;

        reloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            reloadBtn.classList.add('spinning');
            scheduleProcess(true);
            showToast('Privacy Blur Refreshed!');
            setTimeout(() => {
                reloadBtn.classList.remove('spinning');
            }, 600);
        });
        dockContent.appendChild(reloadBtn);

        dock.appendChild(dockContent);
        container.appendChild(dock);
        document.body.appendChild(container);

        updateControlBarUI();
    }


    // ============================================================
    // EVENT LISTENERS & HOTKEYS
    // ============================================================

    function setupEventListeners() {
        // Hotkeys
        window.addEventListener('keydown', (e) => {
            // Alt+P: Toggle Expand / Collapse Privacy Dock
            if (e.altKey && (e.key === 'p' || e.key === 'P')) {
                e.preventDefault();
                toggleDockCollapse(true);
            }
            // Alt+C: Toggle Chat List Blur
            else if (e.altKey && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                toggleChatListBlur(true);
            }
            // Alt+M: Toggle Messages Blur
            else if (e.altKey && (e.key === 'm' || e.key === 'M')) {
                e.preventDefault();
                toggleMessagesBlur(true);
            }
            // Alt+R or Alt+B: Refresh Privacy Blur
            else if (e.altKey && (e.key === 'r' || e.key === 'R' || e.key === 'b' || e.key === 'B')) {
                e.preventDefault();
                const btn = document.getElementById('wa-privacy-reload-btn');
                if (btn) {
                    btn.click();
                } else {
                    scheduleProcess(true);
                }
            }
        });

        // Tab visibility change: refresh immediately when returning from background tab
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                scheduleProcess(true);
            }
        });

        // Window focus
        window.addEventListener('focus', () => {
            scheduleProcess(true);
        });

        // Virtualized scroll listener (capture phase)
        window.addEventListener('scroll', () => {
            scheduleProcess();
        }, { passive: true, capture: true });

        // Periodic safety sweep every 1.5s
        setInterval(() => {
            scheduleProcess();
        }, 1500);
    }


    // ============================================================
    // OBSERVER & INITIALIZATION
    // ============================================================

    function startObserver() {
        if (!document.body) {
            requestAnimationFrame(startObserver);
            return;
        }

        updateBlurRootClasses();
        createFloatingControlBar();
        setupEventListeners();

        const observer = new MutationObserver(() => {
            scheduleProcess();

            // Re-mount control bar if WhatsApp re-renders document body
            if (!document.getElementById('wa-privacy-btn-container')) {
                createFloatingControlBar();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['class', 'dir', 'title']
        });

        scheduleProcess(true);
    }

    function start() {
        startObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            start,
            { once: true }
        );
    } else {
        start();
    }

})();
