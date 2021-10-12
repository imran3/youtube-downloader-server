const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const PORT = process.env.PORT || 5000;
const app = express();
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());

app.listen(PORT, () => {
  console.log("Server running at http://localhost:", PORT);
});

app.get("/", (_, res) => {
  var msg = "hello there";
  res.json({ status: 200, msg: msg });
});

app.get("/mp3", async (req, res, next) => {
  log("Url: ", req.query.url);
  try {
    var url = req.query.url;
    if (!ytdl.validateURL(url)) {
      return res.status(400).send({
        status: "failed",
        message: "Invalid url",
      });
    }
    let title = "audio";

    await ytdl.getBasicInfo(
      url,
      {
        format: "mp4",
      },
      (err, info) => {
        if (err) throw err;
        title = info.player_response.videoDetails.title.replace(
          /[^\x00-\x7F]/g,
          ""
        );
      }
    );

    res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);
    ytdl(url, {
      format: "mp3",
      filter: "audioonly",
    }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "failed",
      message: "An error occured while processing this request.",
    });
  }
});

app.get("/mp4", async (req, res, next) => {
  log("Url: ", req.query.url);
  try {
    let url = req.query.url;
    if (!ytdl.validateURL(url)) {
      return res.status(400).send({
        status: "failed",
        message: "Invalid url",
      });
    }

    let title = "video";

    await ytdl.getBasicInfo(
      url,
      {
        format: "mp4",
      },
      (err, info) => {
        title = info.player_response.videoDetails.title.replace(
          /[^\x00-\x7F]/g,
          ""
        );
      }
    );

    res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
    ytdl(url, {
      format: "mp4",
    }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "failed",
      message: "An error occured while processing this request.",
    });
  }
});

const log = (...msg) => {
  console.log(msg);
};
