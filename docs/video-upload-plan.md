# Video Upload Plan

## Purpose
Extend the existing VAVAW media library to support safe video uploads and allow admins to use uploaded videos in CMS-driven content blocks across the public apps (Main, Beauty, Franchise).

## Accepted Formats
- MP4 (`video/mp4`)
- WebM (`video/webm`)
- QuickTime (`video/quicktime`)

## File Size Limit
- Maximum **50 MB** per video file.
- Handled gracefully in the UI to prevent large file uploads from crashing the application or consuming excessive bandwidth.

## Storage Path Convention
- Files are saved in the `vavaw-media` bucket.
- Path convention: `{site_key}/videos/{uuid}.{ext}` (e.g. `main/videos/550e8400-e29b-41d4-a716-446655440000.mp4`).

## Database Fields (media_assets table)
The existing `media_assets` schema has been extended with the following fields:
- `mime_type` (text): The detected file MIME type.
- `size_bytes` (bigint): The size of the file in bytes.
- `metadata` (jsonb): Extensible metadata object for future video features (e.g., width, height, duration).

## Admin Upload Flow
- Single unified upload form for both images and videos.
- Automatically routes the upload to the correct bucket folder (`images` vs `videos`) based on MIME type.
- Preview videos safely using standard HTML5 `<video controls preload="metadata">` elements.
- Media assets table includes filters for `All`, `Images`, and `Videos`.

## Public Rendering Behavior
- Videos added via the CMS are rendered using standard HTML5 `<video controls playsInline preload="metadata">`.
- **No autoplay:** Sound policies prevent intrusive autoplay videos.
- Fallback missing states are provided if the URL is empty.
- Fully responsive across desktop, tablet, and mobile devices.

## Security & Privacy
- **No transcoding yet:** Video files are stored as uploaded. Users should be advised to upload web-optimized MP4/WebM files.
- Original raw filenames are completely stripped and replaced by UUIDs to prevent PII leakage (e.g. `client_surgery_123.mp4`).
- No raw storage errors or full signed URLs are leaked to analytics.
- Upload errors are logged centrally via `@vavaw/monitoring`.

## Future Improvements
- **Video Transcoding:** Implement edge-based transcoding (HLS/DASH) for adaptive bitrate streaming.
- **Thumbnail Extraction:** Automatically generate poster images from the first frame.
- **Duration Detection:** Save the video duration into `metadata`.
- **External Hosting:** Connect Cloudinary or Mux for advanced video manipulation if self-hosting becomes too expensive.
