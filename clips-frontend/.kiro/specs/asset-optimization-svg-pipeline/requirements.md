# Requirements Document

## Introduction

This feature establishes an SVG asset pipeline for the ClipCash frontend. It covers exporting and optimizing brand assets (ClipCash logo and platform logos for YouTube, Twitch, TikTok, and Instagram), integrating them into the Next.js app via reusable React components, and ensuring all icons meet accessibility and performance standards.

## Glossary

- **SVG_Asset**: A Scalable Vector Graphic file used for logos or icons in the application.
- **SVGO**: An SVG optimization tool that reduces file size by removing redundant metadata and attributes.
- **ARIA_Label**: An accessible name provided via the `aria-label` HTML attribute, used by screen readers to describe an element.
- **Logo_Component**: A React component that renders the ClipCash brand logo as an inline SVG.
- **Platform_Icon_Component**: A React component that renders a social platform logo (YouTube, Twitch, TikTok, or Instagram) as an inline SVG.
- **Footer**: The bottom section of the application layout that displays platform icons.
- **Asset_Pipeline**: The process of exporting, optimizing, and delivering SVG assets to the application.
- **Inline_SVG**: An SVG rendered directly in the HTML DOM rather than loaded as an external file, enabling CSS styling and ARIA attribute injection.

## Requirements

### Requirement 1: ClipCash Logo SVG Export and Integration

**User Story:** As a developer, I want the ClipCash logo available as an optimized SVG component, so that it renders crisply at any size without network overhead from raster images.

#### Acceptance Criteria

1. THE Asset_Pipeline SHALL provide the ClipCash logo as an SVG file stored under `public/assets/logo/`.
2. THE Logo_Component SHALL render the ClipCash logo as an inline SVG within the React component tree.
3. THE Logo_Component SHALL accept a `width` and `height` prop to control rendered dimensions.
4. THE Logo_Component SHALL accept an `aria-label` prop with a default value of `"ClipCash logo"`.
5. WHEN the `aria-label` prop is provided, THE Logo_Component SHALL apply it to the root SVG element.
6. THE SVGO tool SHALL reduce the ClipCash logo SVG file size by removing comments, metadata, and redundant attributes before the file is committed to the repository.

---

### Requirement 2: Platform Logo SVG Export and Integration

**User Story:** As a developer, I want platform logos (YouTube, Twitch, TikTok, Instagram) available as optimized SVG components, so that the footer renders brand-accurate icons without performance cost.

#### Acceptance Criteria

1. THE Asset_Pipeline SHALL provide one SVG file per platform (YouTube, Twitch, TikTok, Instagram) stored under `public/assets/icons/`.
2. THE Platform_Icon_Component SHALL accept a `platform` prop with accepted values: `"youtube"`, `"twitch"`, `"tiktok"`, `"instagram"`.
3. THE Platform_Icon_Component SHALL render the inline SVG corresponding to the provided `platform` prop value.
4. IF an unrecognized `platform` prop value is provided, THEN THE Platform_Icon_Component SHALL render nothing and log a warning to the console.
5. THE Platform_Icon_Component SHALL accept a `size` prop (number, in pixels) to set both `width` and `height` of the rendered SVG.
6. THE Platform_Icon_Component SHALL accept an `aria-label` prop; WHEN no `aria-label` is provided, THE Platform_Icon_Component SHALL default to `"{Platform} logo"` (e.g., `"YouTube logo"`).
7. THE SVGO tool SHALL reduce each platform SVG file size by removing comments, metadata, and redundant attributes before the files are committed to the repository.

---

### Requirement 3: Accessibility Compliance for All SVG Assets

**User Story:** As a user relying on assistive technology, I want all icons and logos to have descriptive labels, so that I understand the purpose of each visual element.

#### Acceptance Criteria

1. THE Logo_Component SHALL set `role="img"` on the root SVG element.
2. THE Platform_Icon_Component SHALL set `role="img"` on the root SVG element.
3. WHEN an SVG is used purely for decoration (no semantic meaning), THE SVG_Asset SHALL have `aria-hidden="true"` and no `aria-label`.
4. THE Logo_Component SHALL include a `<title>` element inside the SVG whose text matches the resolved `aria-label` value.
5. THE Platform_Icon_Component SHALL include a `<title>` element inside the SVG whose text matches the resolved `aria-label` value.

---

### Requirement 4: Asset Performance Optimization

**User Story:** As a user on a slow connection, I want SVG assets to load fast, so that the page renders without delay caused by large asset files.

#### Acceptance Criteria

1. THE Asset_Pipeline SHALL ensure each optimized SVG file does not exceed 10 KB after SVGO processing.
2. THE Asset_Pipeline SHALL strip all `<script>` elements and event handler attributes (e.g., `onclick`) from SVG files before committing them to the repository.
3. WHERE the Next.js Image component is used for raster fallbacks, THE Asset_Pipeline SHALL not apply it to SVG assets; SVG assets SHALL be rendered as inline SVGs or via `<img>` tags with explicit `width` and `height`.
4. THE Logo_Component SHALL not trigger a layout shift by specifying explicit `width` and `height` attributes on the root SVG element.
5. THE Platform_Icon_Component SHALL not trigger a layout shift by specifying explicit `width` and `height` attributes on the root SVG element.

---

### Requirement 5: Footer Platform Icon Integration

**User Story:** As a visitor, I want to see platform logos in the footer, so that I can identify which platforms ClipCash supports.

#### Acceptance Criteria

1. THE Footer SHALL render one Platform_Icon_Component for each of the four supported platforms: YouTube, Twitch, TikTok, and Instagram.
2. WHEN a platform icon in the Footer is interactive (e.g., a link), THE Footer SHALL wrap the Platform_Icon_Component in an anchor element with a descriptive `aria-label`.
3. THE Footer SHALL display platform icons at a consistent size of 24×24 pixels by default.
4. WHEN the viewport width is below 640px, THE Footer SHALL maintain icon legibility by rendering icons at no smaller than 20×20 pixels.
