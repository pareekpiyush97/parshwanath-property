# Parshwanath Property &amp; Developers

Marketing site for [Parshwanath Property &amp; Developers](https://www.instagram.com/parshwanath_property/) —
UIT converted plots, villas, farms and homes across **Udaipur, Rajsamand and Mumbai**.

Office: Amberi Circle, Near Skoda Showroom, Udaipur · **+91 88905 07608**

## Structure

A full-viewport hero carrying the project film on a muted autoplay loop, then
the inventory: each listing drawn as a **measured plot plate** with its real
dimensions, facing, road width and status, on a blueprint-sheet section.
Distances, the firm, and a site-visit call to action follow.

## The film

Source is 848x478 at 1.15 Mbps, so some softness is a hard ceiling — the encode
chain gets the most out of it rather than adding detail that was never recorded:

```
delogo -> hqdn3d -> scale (lanczos) -> unsharp
```

Denoising first matters: without it the sharpener amplifies compression noise
instead of edges. Encoded at crf 19 for normal playback, which is far more
efficient than the frame-accurate encode a scroll-scrubbed version would need.

| | Resolution | Size |
| --- | --- | --- |
| `hero.mp4` | 1280x720 | 4.5 MB |
| `hero-mobile.mp4` | 854x480 | 2.0 MB |

Reduced-motion visitors get the poster frame instead of the loop.

## Run locally

```bash
node server.cjs
```

Serves on <http://localhost:4999>. The static server supports byte ranges, which
video playback needs.

## Layout

```
index.html          single page
css/style.css       all styles
js/main.js          nav, hero playback, scroll reveals
assets/video/       hero.mp4 · hero-mobile.mp4
assets/img/         poster, contact backdrop, vector logo mark
server.cjs          static server with range support
```

## Notes

- Interior and elevation imagery are **artist's impressions**, labelled as such
  on the page. Plot dimensions, distances and approvals are as listed and should
  be verified against documents before registry.
- The source film carried a watermark, removed at encode time with
  `delogo=x=750:y=379:w=38:h=39` on the 848x478 original.
- Brand and inventory data are taken from the company's own Instagram.
