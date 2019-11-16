# gatsby-remark-alu

Embed CROPPED MANGA CAPTURE BY [ALU](https://alu.jp/) in Gatsby markdown.

## Install

```bash
npm install --save "gatsby-remark-alu"
```

## How to use

```js
// In your gatsby-config.js
plugins: [
  {
    resolve: "gatsby-transformer-remark",
    options: {
      plugins: ["gatsby-remark-alu"]
    }
  }
];
```

```js
// In your gatsby-config.js
// only maxWidth option is available now.
plugins: [
  {
    resolve: "gatsby-transformer-remark",
    options: {
      plugins: [
        {
          resolve: "gatsby-remark-alu",
          options: {
            maxWidth: '400px'
          }
        }
      ]
    }
  }
];
```

## Usage

1. select image you want to use in [ALU Crop Search](https://alu.jp/cropSearch).
2. copy URL (same as WORDPRESS, Hatena, note).
3. paste to your markdown.

```markdown
# Blog post title

This is an example of embedding ALU CROPPED MANGA CAPTURE.
Add any markdown as you normally do, and then insert a valid
ALU share link anywhere to automatically transform it into an
embed card.

https://alu.jp/series/左ききのエレン/crop/P9ORrSGCBU0rk2RrR2c1

You can embed several cropped capture

https://alu.jp/series/忘却バッテリー/crop/XL5xRVXU10R7P20F8ZV6

https://alu.jp/series/ランウェイで笑って/crop/xnVrMsLbE5clRhHWta9X

```

## How this looks like
[View a demo here](https://charlie043.party/blog/gatsby-remark-alu-demo)

## License

MIT
