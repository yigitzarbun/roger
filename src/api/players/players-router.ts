const router = require("express").Router();
const playersModel = require("./players-model");

router.get("/", async (req, res, next) => {
  try {
    const players = await playersModel.getAll();
    res.status(200).json(players);
  } catch (error) {
    next(error);
  }
});

router.get("/:player_id", async (req, res, next) => {
  try {
    const player = await playersModel.getById(req.params.player_id);
    res.status(200).json(player);
  } catch (error) {
    next(error);
  }
});

router.put("/:player_id", async (req, res, next) => {
  try {
    await playersModel.update(req.body);
    const updatedPlayer = await playersModel.getById(req.body.player_id);
    res.status(200).json(updatedPlayer);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
