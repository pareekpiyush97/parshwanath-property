# Parshwanath Property &amp; Developers

Marketing site for [Parshwanath Property &amp; Developers](https://www.instagram.com/parshwanath_property/) —
UIT converted plots, villas, farms and homes across **Udaipur, Rajsamand and Mumbai**.

Office: Amberi Circle, Near Skoda Showroom, Udaipur · **+91 88905 07608**

## The walkthrough

The page opens on a pinned, full-viewport stage where **scroll position drives
`video.currentTime`** — you walk through the property rather than watch a loop.
Captions and the progress rail switch on the clip's real scene cuts:

| Progress | Scene | Cut at |
| --- | --- | --- |
| 0 – 25% | aerial approach | 0.000s |
| 25 – 51% | living room | 2.458s |
| 51 – 75% | kitchen | 5.083s |
| 75 – 100% | rooftop pool | 7.500s |

Two things make the scrub smooth:

- **All-keyframe encode.** `-g 1 -keyint_min 1 -sc_threshold 0` so every frame is
  a seek target. This came out smaller than an equivalent JPEG frame sequence
  (3.6 MB vs 6.4 MB) with twice the temporal resolution.
- **Eased seeking.** Scroll sets a target; a `requestAnimationFrame` loop eases
  toward it and skips sub-0.015s seeks, which otherwise stall mobile Safari.

Below the walkthrough the page deliberately drops from film to paperwork — a
blueprint sheet where each listing is drawn as a **measured plot plate** with its
real dimensions, facing, road width and status.

Reduced-motion visitors get the same content as a stacked story with no pinning.

## Run locally

```bash
node server.cjs
```

Serves on <http://localhost:4999>. The static server supports byte ranges, which
the scrubbed video needs.

## Layout

```
index.html          single page
css/style.css       all styles
js/main.js          walkthrough scrubbing, nav, reveals
assets/video/       walk.mp4 (1152x648) · walk-mobile.mp4 (720x404)
assets/img/         stills, poster, vector logo mark
server.cjs          static server with range support
```

## Notes

- Interior and elevation imagery are **artist's impressions**, labelled as such
  on the page. Plot dimensions, distances and approvals are as listed and should
  be verified against documents before registry.
- The source film carried a watermark, removed at encode time with
  `delogo=x=750:y=379:w=38:h=39` on the 848x478 original.
